const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendSMS } = require('../services/twilioService');
const { authenticateToken } = require('../middleware/auth');
const { orderLimiter } = require('../middleware/security');
const { validateOrderCreation, validateGuestOrderCreation, validateShippingAddress, handleValidationErrors } = require('../middleware/validation');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Inicialización lazy de Mercado Pago (evita crash si el token no está al arrancar)
let mpPreference = null;
let mpPayment = null;

const getMPClients = () => {
  if (!mpPreference || !mpPayment) {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!token) throw new Error('MERCADO_PAGO_ACCESS_TOKEN no configurado');
    const mpClient = new MercadoPagoConfig({ accessToken: token });
    mpPreference = new Preference(mpClient);
    mpPayment = new Payment(mpClient);
  }
  return { mpPreference, mpPayment };
};

// Obtener pedidos del usuario autenticado
router.get('/user/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener pedidos del usuario
    const ordersResult = await pool.query(`
      SELECT * FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    // Para cada pedido, obtener sus items
    const ordersWithItems = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(`
          SELECT id, product_id, product_name, quantity, price
          FROM order_items
          WHERE order_id = $1
        `, [order.id]);

        return {
          ...order,
          items: itemsResult.rows
        };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener tus pedidos' });
  }
});

// Obtener todos los pedidos (solo admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Verificar si es admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const result = await pool.query(`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Crear pedido para usuario registrado
router.post('/user/create', authenticateToken, orderLimiter, [...validateOrderCreation, ...validateShippingAddress], handleValidationErrors, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userId = req.user.id;
    const {
      items,          // [{ product_id, product_name, quantity, price }]
      total,
      payment_method = 'bold',
      shipping_address, // Dirección de envío
      session_id
    } = req.body;

    // Obtener información del usuario
    const userResult = await client.query(
      'SELECT name, email, phone, address FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];

    // Crear orden con user_id
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status, shipping_address, payment_method, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, total, 'pending', JSON.stringify(shipping_address || user.address), payment_method]
    );

    const orderId = orderResult.rows[0].id;

    // Crear items de la orden
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.product_name, item.quantity, item.price]
      );

      // Registrar en analytics el evento de conversión pendiente
      await client.query(
        `INSERT INTO analytics (event_type, product_id, product_name, session_id, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        ['checkout_initiated', item.product_id, item.product_name, session_id,
         JSON.stringify({ order_id: orderId, quantity: item.quantity, price: item.price, user_id: userId })]
      );
    }

    await client.query('COMMIT');

    // Enviar SMS de confirmación al cliente
    try {
      if (user.phone) {
        await sendSMS(user.phone, `¡Gracias por tu compra en LushSecret! Tu pedido #${orderId} ha sido creado. Total: $${total}. Te notificaremos cuando sea enviado.`);
      }
    } catch (smsError) {
      console.error('Error enviando SMS de pedido:', smsError.message);
    }

    // Enviar SMS de alerta al admin
    try {
      await sendSMS('+57 6013570804', `Nuevo pedido #${orderId} creado. Total: $${total}. Cliente: ${user.name}, Email: ${user.email}, Tel: ${user.phone}`);
    } catch (smsError) {
      console.error('Error enviando SMS de admin:', smsError.message);
    }

    res.json({
      success: true,
      order: orderResult.rows[0],
      message: 'Orden creada exitosamente'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  } finally {
    client.release();
  }
});

// Crear pedido (desde el checkout) - Para usuarios no registrados
router.post('/', orderLimiter, validateGuestOrderCreation, handleValidationErrors, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { 
      customer_info,  // { nombre, apellidos, cedula, telefono, correo, direccion, ciudad, nombreRecibe, observaciones }
      items,          // [{ product_id, product_name, quantity, price }]
      total,
      payment_method = 'bold',
      session_id
    } = req.body;

    // Crear orden
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status, customer_info, payment_method, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [null, total, 'pending', JSON.stringify(customer_info), payment_method]
    );

    const orderId = orderResult.rows[0].id;

    // Crear items de la orden
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.product_name, item.quantity, item.price]
      );

      // Registrar en analytics el evento de conversión pendiente
      await client.query(
        `INSERT INTO analytics (event_type, product_id, product_name, session_id, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        ['checkout_initiated', item.product_id, item.product_name, session_id, 
         JSON.stringify({ order_id: orderId, quantity: item.quantity, price: item.price })]
      );
    }

    await client.query('COMMIT');
    
    // Enviar SMS de confirmación al cliente
    try {
      const phone = customer_info.telefono;
      if (phone) {
        await sendSMS(phone, `¡Gracias por tu compra en LushSecret! Tu pedido #${orderId} ha sido creado. Total: $${total}. Te notificaremos cuando sea enviado.`);
      }
    } catch (smsError) {
      console.error('Error enviando SMS de pedido:', smsError.message);
    }
    
    // Enviar SMS de alerta al admin
    try {
      await sendSMS('+57 6013570804', `Nuevo pedido #${orderId} creado. Total: $${total}. Cliente: ${customer_info.nombre} ${customer_info.apellidos}, Tel: ${customer_info.telefono}`);
    } catch (smsError) {
      console.error('Error enviando SMS de admin:', smsError.message);
    }
    
    res.json({ 
      success: true, 
      order: orderResult.rows[0],
      message: 'Orden creada exitosamente' 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido', detail: error.message });
  } finally {
    client.release();
  }
});

// Crear preferencia de pago con Mercado Pago
router.post('/mercadopago/create-preference', orderLimiter, async (req, res) => {
  try {
    const { 
      customer_info,
      items,
      total,
      order_id
    } = req.body;

    // Crear items para Mercado Pago
    const preferenceItems = items.map(item => ({
      title: item.product_name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'COP'
    }));

    // Crear preferencia
    const preference = {
      items: preferenceItems,
      payer: {
        name: customer_info.nombre,
        surname: customer_info.apellidos,
        email: customer_info.correo,
        phone: {
          area_code: customer_info.telefono.substring(0, 3),
          number: customer_info.telefono.substring(3)
        },
        identification: {
          type: 'CC',
          number: customer_info.cedula
        }
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-exitoso?order_id=${order_id}`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-fallido?order_id=${order_id}`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-pendiente?order_id=${order_id}`
      },
      auto_return: 'approved',
      external_reference: order_id.toString(),
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/orders/webhook/mercadopago`
    };

    const { mpPreference: pref } = getMPClients();
    const response = await pref.create({ body: preference });
    
    res.json({
      success: true,
      preference_id: response.id,
      init_point: response.init_point
    });
  } catch (error) {
    console.error('Error creando preferencia de Mercado Pago:', error);
    res.status(500).json({ error: 'Error al crear preferencia de pago', detail: error.message });
  }
});

// Webhook de Mercado Pago para confirmar pagos
router.post('/webhook/mercadopago', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Obtener detalles del pago
      const { mpPayment: pay } = getMPClients();
      const payment = await pay.get({ id: paymentId });
      
      if (payment.status === 'approved') {
        const orderId = payment.external_reference;
        
        // Actualizar estado de la orden a 'paid'
        await pool.query(
          `UPDATE orders SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [orderId]
        );

        // Registrar en analytics el evento de conversión completada
        const orderItems = await pool.query(
          `SELECT product_id, product_name, quantity, price FROM order_items WHERE order_id = $1`,
          [orderId]
        );

        for (const item of orderItems.rows) {
          await pool.query(
            `INSERT INTO analytics (event_type, product_id, product_name, session_id, metadata)
             VALUES ($1, $2, $3, $4, $5)`,
            ['purchase_completed', item.product_id, item.product_name, `mp_${paymentId}`, 
             JSON.stringify({ order_id: orderId, quantity: item.quantity, price: item.price, payment_method: 'mercadopago' })]
          );
        }

        console.log(`Pago aprobado para orden ${orderId}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error procesando webhook de Mercado Pago:', error);
    res.sendStatus(500);
  }
});

// Webhook de Bold para confirmar pagos exitosos
router.post('/webhook/bold', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Bold envía información del pago en el webhook
    const {
      transaction,
      status,
      order_id,
      amount,
      reference,
      customer,
      // Otros campos que Bold pueda enviar
    } = req.body;

    console.log('📩 Webhook de Bold recibido:', req.body);

    // Verificar que el pago fue exitoso
    if (status === 'approved' || status === 'success') {
      // Actualizar el estado de la orden
      const updateResult = await client.query(
        `UPDATE orders 
         SET status = 'paid', 
             payment_info = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [JSON.stringify(req.body), order_id]
      );

      if (updateResult.rows.length > 0) {
        const order = updateResult.rows[0];

        // Obtener items de la orden para analytics
        const itemsResult = await client.query(
          `SELECT * FROM order_items WHERE order_id = $1`,
          [order_id]
        );

        // Registrar conversión exitosa en analytics para cada producto
        for (const item of itemsResult.rows) {
          await client.query(
            `INSERT INTO analytics (event_type, product_id, product_name, metadata)
             VALUES ($1, $2, $3, $4)`,
            ['purchase_completed', item.product_id, item.product_name, 
             JSON.stringify({ 
               order_id: order_id, 
               quantity: item.quantity, 
               price: item.price,
               revenue: item.quantity * item.price,
               transaction_id: transaction
             })]
          );
        }

        console.log(`✅ Orden #${order_id} marcada como pagada y registrada en analytics`);

        // Enviar SMS de confirmación de pago al cliente
        try {
          let phoneNumber = null;
          let customerName = 'Cliente';

          if (order.user_id) {
            // Pedido de usuario registrado
            const userResult = await client.query('SELECT name, phone FROM users WHERE id = $1', [order.user_id]);
            if (userResult.rows.length > 0) {
              phoneNumber = userResult.rows[0].phone;
              customerName = userResult.rows[0].name;
            }
          } else if (order.customer_info) {
            // Pedido de usuario no registrado
            const customerInfo = JSON.parse(order.customer_info);
            phoneNumber = customerInfo.telefono;
            customerName = customerInfo.nombre;
          }

          if (phoneNumber) {
            await sendSMS(phoneNumber, `¡Hola ${customerName}! Tu pago ha sido confirmado. Tu pedido #${order_id} está siendo procesado. Te notificaremos cuando sea enviado. LushSecret`);
          }
        } catch (smsError) {
          console.error('Error enviando SMS de confirmación de pago:', smsError.message);
        }

        // Enviar SMS de alerta al admin
        try {
          await sendSMS('+57 6013570804', `💰 Pago confirmado para pedido #${order_id}. Total: $${order.total}. Transacción: ${transaction}`);
        } catch (smsError) {
          console.error('Error enviando SMS de admin:', smsError.message);
        }
      }

      await client.query('COMMIT');
      
      // Responder a Bold que el webhook fue procesado correctamente
      res.json({ success: true, message: 'Pago procesado exitosamente' });
    } else {
      // Pago rechazado o pendiente
      await client.query(
        `UPDATE orders 
         SET status = $1, 
             payment_info = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [status === 'rejected' ? 'failed' : 'pending', JSON.stringify(req.body), order_id]
      );

      await client.query('COMMIT');
      
      res.json({ success: true, message: `Pago ${status}` });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al procesar webhook de Bold:', error);
    res.status(500).json({ error: 'Error al procesar webhook' });
  } finally {
    client.release();
  }
});

// Actualizar estado de orden (para admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar estado de orden:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// Obtener estadísticas de pedidos (para analytics)
router.get('/stats/shipping', async (req, res) => {
  try {
    // Obtener conteo de pedidos por estado de envío
    const statusCounts = await pool.query(`
      SELECT 
        COALESCE(shipping_status, 'sin_asignar') as status,
        COUNT(*) as count,
        SUM(total) as total_amount
      FROM orders
      WHERE status = 'paid'
      GROUP BY shipping_status
    `);

    // Obtener pedidos recientes con estado de envío
    const recentOrders = await pool.query(`
      SELECT 
        id,
        total,
        status,
        shipping_status,
        shipping_carrier,
        tracking_number,
        estimated_delivery,
        created_at,
        updated_at,
        customer_info
      FROM orders
      WHERE status = 'paid'
      ORDER BY created_at DESC
      LIMIT 20
    `);

    // Obtener total de ingresos por pedidos pagados
    const totalRevenue = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total) as total_revenue,
        AVG(total) as avg_order_value
      FROM orders
      WHERE status = 'paid'
    `);

    // Calcular pedidos por mes (últimos 6 meses)
    const ordersByMonth = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Mon YYYY') as month,
        COUNT(*) as count,
        SUM(total) as revenue
      FROM orders
      WHERE status = 'paid'
        AND created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) DESC
    `);

    res.json({
      statusCounts: statusCounts.rows,
      recentOrders: recentOrders.rows,
      totals: totalRevenue.rows[0],
      ordersByMonth: ordersByMonth.rows
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de pedidos:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas de pedidos' });
  }
});

// Actualizar estado de envío (solo admin)
router.put('/:id/shipping', authenticateToken, async (req, res) => {
  try {
    // Verificar si es admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const { id } = req.params;
    const { shipping_status, tracking_number } = req.body;

    const result = await pool.query(
      `UPDATE orders
       SET shipping_status = $1, tracking_number = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [shipping_status, tracking_number, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    const order = result.rows[0];

    // Enviar SMS al cliente si hay número de teléfono
    try {
      let phoneNumber = null;
      let customerName = 'Cliente';

      if (order.user_id) {
        // Pedido de usuario registrado
        const userResult = await pool.query('SELECT name, phone FROM users WHERE id = $1', [order.user_id]);
        if (userResult.rows.length > 0) {
          phoneNumber = userResult.rows[0].phone;
          customerName = userResult.rows[0].name;
        }
      } else if (order.customer_info) {
        // Pedido de usuario no registrado
        const customerInfo = JSON.parse(order.customer_info);
        phoneNumber = customerInfo.telefono;
        customerName = customerInfo.nombre;
      }

      if (phoneNumber) {
        let message = '';
        if (shipping_status === 'Enviado' && tracking_number) {
          message = `¡Hola ${customerName}! Tu pedido #${id} ha sido enviado. Número de seguimiento: ${tracking_number}. LushSecret`;
        } else {
          message = `¡Hola ${customerName}! El estado de tu pedido #${id} ha cambiado a: ${shipping_status}. LushSecret`;
        }
        await sendSMS(phoneNumber, message);
      }
    } catch (smsError) {
      console.error('Error enviando SMS de actualización:', smsError.message);
    }

    res.json({
      success: true,
      order: result.rows[0],
      message: 'Estado de envío actualizado'
    });
  } catch (error) {
    console.error('Error al actualizar estado de envío:', error);
    res.status(500).json({ error: 'Error al actualizar estado de envío' });
  }
});

// Obtener detalles de una orden
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderResult = await pool.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [id]
    );

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Error al obtener detalles de orden:', error);
    res.status(500).json({ error: 'Error al obtener detalles de orden' });
  }
});

module.exports = router;

