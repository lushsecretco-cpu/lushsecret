const express = require('express');
const router = express.Router();
const pool = require('../db');
const nodemailer = require('nodemailer');

// Configurar transporte de correo (usar variables de entorno en producción)
const transporter = nodemailer.createTransport({
  service: 'gmail', // o el servicio que prefieras
  auth: {
    user: process.env.EMAIL_USER || 'tu-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'tu-contraseña-de-aplicacion'
  }
});

// Estados de envío disponibles
const SHIPPING_STATUSES = {
  pending: 'Pedido Recibido',
  processing: 'En Preparación',
  packed: 'Empacado',
  shipped: 'En Camino',
  out_for_delivery: 'En Reparto',
  delivered: 'Entregado',
  failed: 'Intento de Entrega Fallido',
  returned: 'Devuelto'
};

// Función para enviar correo de actualización
async function sendTrackingEmail(orderData, newStatus, trackingInfo) {
  const customerInfo = orderData.customer_info || {};
  const email = customerInfo.correo;
  
  if (!email) {
    console.log('No hay email para enviar notificación');
    return;
  }

  const statusName = SHIPPING_STATUSES[newStatus] || newStatus;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'Lush Secret <noreply@lushsecret.com>',
    to: email,
    subject: `Actualización de tu pedido #${orderData.id} - ${statusName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%);
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(212, 175, 55, 0.2);
            box-shadow: 0 20px 60px rgba(212, 175, 55, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #D4AF37 0%, #C9B037 100%);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            color: #000;
            font-size: 28px;
            font-weight: 300;
            letter-spacing: 2px;
          }
          .content {
            padding: 40px 30px;
          }
          .status-badge {
            display: inline-block;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(201, 176, 55, 0.2) 100%);
            color: #FFD700;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 300;
            margin: 20px 0;
            border: 1px solid rgba(212, 175, 55, 0.3);
          }
          .info-block {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(212, 175, 55, 0.1);
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            color: #D4AF37;
            font-weight: 300;
          }
          .info-value {
            color: #fff;
            font-weight: 300;
          }
          .tracking-button {
            display: inline-block;
            background: linear-gradient(135deg, #D4AF37 0%, #C9B037 100%);
            color: #000;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 300;
            letter-spacing: 1px;
            transition: all 0.3s ease;
          }
          .tracking-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
          }
          .footer {
            background: rgba(0, 0, 0, 0.5);
            padding: 20px;
            text-align: center;
            color: #888;
            font-size: 12px;
          }
          p {
            color: #ccc;
            line-height: 1.6;
            font-weight: 300;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LUSH SECRET</h1>
          </div>
          <div class="content">
            <h2 style="color: #D4AF37; font-weight: 300; letter-spacing: 1px;">Hola ${customerInfo.nombre || 'Cliente'},</h2>
            <p>Tu pedido ha sido actualizado:</p>
            
            <div style="text-align: center;">
              <div class="status-badge">${statusName}</div>
            </div>
            
            ${trackingInfo.description ? `<p style="text-align: center; color: #fff;">${trackingInfo.description}</p>` : ''}
            
            <div class="info-block">
              <div class="info-row">
                <span class="info-label">Número de Pedido:</span>
                <span class="info-value">#${orderData.id}</span>
              </div>
              ${orderData.tracking_number ? `
                <div class="info-row">
                  <span class="info-label">Número de Guía:</span>
                  <span class="info-value">${orderData.tracking_number}</span>
                </div>
              ` : ''}
              ${orderData.shipping_carrier ? `
                <div class="info-row">
                  <span class="info-label">Transportadora:</span>
                  <span class="info-value">${orderData.shipping_carrier}</span>
                </div>
              ` : ''}
              ${trackingInfo.location ? `
                <div class="info-row">
                  <span class="info-label">Ubicación:</span>
                  <span class="info-value">${trackingInfo.location}</span>
                </div>
              ` : ''}
              ${orderData.estimated_delivery ? `
                <div class="info-row">
                  <span class="info-label">Entrega Estimada:</span>
                  <span class="info-value">${new Date(orderData.estimated_delivery).toLocaleDateString('es-CO', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              ` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tracking/${orderData.id}" class="tracking-button">
                Ver Detalles del Envío
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px;">
              ${newStatus === 'delivered' ? 
                '¡Gracias por tu compra! Esperamos verte pronto.' : 
                'Te mantendremos informado sobre cualquier actualización.'}
            </p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; 2026 Lush Secret. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado a ${email} - Estado: ${statusName}`);
  } catch (error) {
    console.error('❌ Error enviando email:', error);
  }
}

// Obtener información de tracking por ID de orden
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const historyResult = await pool.query(
      `SELECT * FROM tracking_history 
       WHERE order_id = $1 
       ORDER BY created_at DESC`,
      [orderId]
    );

    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [orderId]
    );

    res.json({
      order: orderResult.rows[0],
      tracking_history: historyResult.rows,
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Error obteniendo tracking:', error);
    res.status(500).json({ error: 'Error obteniendo información de tracking' });
  }
});

// Actualizar estado de envío (para administradores)
router.post('/update', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const {
      order_id,
      shipping_status,
      tracking_number,
      tracking_url,
      shipping_carrier,
      estimated_delivery,
      location,
      description
    } = req.body;

    // Actualizar orden
    const updateQuery = `
      UPDATE orders 
      SET 
        shipping_status = $1,
        ${tracking_number ? 'tracking_number = $2,' : ''}
        ${tracking_url ? 'tracking_url = $3,' : ''}
        ${shipping_carrier ? 'shipping_carrier = $4,' : ''}
        ${estimated_delivery ? 'estimated_delivery = $5,' : ''}
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const params = [shipping_status];
    let paramIndex = 2;

    if (tracking_number) params.push(tracking_number);
    if (tracking_url) params.push(tracking_url);
    if (shipping_carrier) params.push(shipping_carrier);
    if (estimated_delivery) params.push(estimated_delivery);
    params.push(order_id);

    const orderResult = await client.query(updateQuery, params);

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Agregar entrada al historial de tracking
    await client.query(
      `INSERT INTO tracking_history (order_id, status, location, description)
       VALUES ($1, $2, $3, $4)`,
      [order_id, shipping_status, location, description]
    );

    await client.query('COMMIT');

    const updatedOrder = orderResult.rows[0];

    // Enviar email de notificación
    await sendTrackingEmail(updatedOrder, shipping_status, {
      location,
      description
    });

    res.json({
      success: true,
      order: updatedOrder,
      message: 'Estado de envío actualizado y email enviado'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error actualizando tracking:', error);
    res.status(500).json({ error: 'Error actualizando estado de envío' });
  } finally {
    client.release();
  }
});

// Obtener todos los pedidos pendientes de envío (para admin)
router.get('/admin/pending', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
              COUNT(oi.id) as items_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.status = 'paid' OR o.shipping_status IN ('pending', 'processing', 'packed', 'shipped', 'out_for_delivery')
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo pedidos pendientes:', error);
    res.status(500).json({ error: 'Error obteniendo pedidos' });
  }
});

module.exports = router;
