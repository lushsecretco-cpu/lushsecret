const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
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

// Crear pedido (desde el checkout)
router.post('/', async (req, res) => {
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

module.exports = router;

