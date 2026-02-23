const cron = require('node-cron');
const pool = require('../db');
const nodemailer = require('nodemailer');

// Configurar transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'tu-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'tu-contraseña-de-aplicacion'
  }
});

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

// Función para enviar email de actualización
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
    subject: `Actualización Automática - Pedido #${orderData.id} - ${statusName}`,
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
          .badge {
            display: inline-block;
            background: rgba(212, 175, 55, 0.2);
            color: #FFD700;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 300;
            border: 1px solid rgba(212, 175, 55, 0.3);
            margin-top: 5px;
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
            <div class="badge">🤖 ACTUALIZACIÓN AUTOMÁTICA</div>
          </div>
          <div class="content">
            <h2 style="color: #D4AF37; font-weight: 300; letter-spacing: 1px;">Hola ${customerInfo.nombre || 'Cliente'},</h2>
            <p>Tu pedido ha sido actualizado automáticamente:</p>
            
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
              <div class="info-row">
                <span class="info-label">Última Actualización:</span>
                <span class="info-value">${new Date().toLocaleString('es-CO')}</span>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tracking/${orderData.id}" class="tracking-button">
                Ver Seguimiento Completo
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px;">
              ${newStatus === 'delivered' ? 
                '¡Gracias por tu compra! Esperamos verte pronto.' : 
                'Este estado se actualizó automáticamente consultando la transportadora.'}
            </p>
          </div>
          <div class="footer">
            <p>Este es un correo automático generado por nuestro sistema de seguimiento.</p>
            <p>&copy; 2026 Lush Secret. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email automático enviado a ${email} - Estado: ${statusName}`);
  } catch (error) {
    console.error('❌ Error enviando email automático:', error);
  }
}

// Función simulada para consultar API de transportadora
// En producción, aquí consultarías las APIs reales de Servientrega, Coordinadora, etc.
async function consultarEstadoTransportadora(trackingNumber, carrier, trackingUrl) {
  // SIMULACIÓN - En producción reemplazar con llamadas reales a las APIs
  
  // Ejemplo de cómo sería con una API real:
  /*
  if (carrier === 'Servientrega') {
    const response = await fetch(`https://api.servientrega.com/tracking/${trackingNumber}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SERVIENTREGA_API_KEY}`
      }
    });
    const data = await response.json();
    return {
      status: data.estado, // mapear al formato interno
      location: data.ubicacion,
      description: data.descripcion,
      estimatedDelivery: data.fechaEstimada
    };
  }
  */
  
  // Por ahora, simulamos cambios de estado aleatorios para testing
  const estadosSimulados = ['processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
  const randomStatus = estadosSimulados[Math.floor(Math.random() * estadosSimulados.length)];
  
  console.log(`🔍 Consultando estado para guía ${trackingNumber} (${carrier})`);
  
  // Simular que a veces no hay cambios (70% de probabilidad)
  if (Math.random() < 0.7) {
    return null; // Sin cambios
  }
  
  // Simular un nuevo estado
  return {
    status: randomStatus,
    location: 'Bogotá - Centro de Distribución',
    description: `Estado actualizado automáticamente`,
    estimatedDelivery: null
  };
}

// Función principal de actualización automática
async function actualizarEstadosAutomaticamente() {
  const client = await pool.connect();
  
  try {
    console.log('\n🤖 === ACTUALIZADOR AUTOMÁTICO DE TRACKING ===');
    console.log(`⏰ Ejecutando a las ${new Date().toLocaleString('es-CO')}`);
    
    // Obtener pedidos que tienen guía pero no están entregados
    const ordersResult = await client.query(`
      SELECT * FROM orders 
      WHERE tracking_number IS NOT NULL 
      AND shipping_status NOT IN ('delivered', 'returned')
      AND status = 'paid'
      ORDER BY created_at DESC
    `);

    const orders = ordersResult.rows;
    console.log(`📦 Encontrados ${orders.length} pedidos activos para revisar\n`);

    let actualizados = 0;
    let sinCambios = 0;
    let errores = 0;

    for (const order of orders) {
      try {
        console.log(`🔍 Revisando pedido #${order.id} - Guía: ${order.tracking_number}`);
        
        // Consultar estado actual en la transportadora
        const nuevoEstado = await consultarEstadoTransportadora(
          order.tracking_number,
          order.shipping_carrier,
          order.tracking_url
        );

        if (!nuevoEstado) {
          console.log(`  ℹ️  Sin cambios`);
          sinCambios++;
          
          // Actualizar timestamp de última revisión
          await client.query(
            `UPDATE orders SET last_tracking_check = CURRENT_TIMESTAMP WHERE id = $1`,
            [order.id]
          );
          continue;
        }

        // Verificar si el estado cambió
        if (nuevoEstado.status === order.shipping_status) {
          console.log(`  ℹ️  Estado sin cambios: ${nuevoEstado.status}`);
          sinCambios++;
          
          await client.query(
            `UPDATE orders SET last_tracking_check = CURRENT_TIMESTAMP WHERE id = $1`,
            [order.id]
          );
          continue;
        }

        console.log(`  ✅ CAMBIO DETECTADO: ${order.shipping_status} → ${nuevoEstado.status}`);

        // Actualizar la orden
        await client.query(
          `UPDATE orders 
           SET shipping_status = $1,
               last_tracking_check = CURRENT_TIMESTAMP,
               updated_at = CURRENT_TIMESTAMP
               ${nuevoEstado.estimatedDelivery ? ', estimated_delivery = $4' : ''}
           WHERE id = $2`,
          nuevoEstado.estimatedDelivery 
            ? [nuevoEstado.status, order.id, nuevoEstado.estimatedDelivery]
            : [nuevoEstado.status, order.id]
        );

        // Agregar al historial de tracking
        await client.query(
          `INSERT INTO tracking_history (order_id, status, location, description)
           VALUES ($1, $2, $3, $4)`,
          [order.id, nuevoEstado.status, nuevoEstado.location, nuevoEstado.description]
        );

        // Enviar email al cliente
        const updatedOrder = { ...order, shipping_status: nuevoEstado.status };
        await sendTrackingEmail(updatedOrder, nuevoEstado.status, {
          location: nuevoEstado.location,
          description: nuevoEstado.description
        });

        actualizados++;
        console.log(`  📧 Email enviado al cliente`);

      } catch (error) {
        console.error(`  ❌ Error procesando pedido #${order.id}:`, error.message);
        errores++;
      }
    }

    console.log('\n📊 === RESUMEN DE ACTUALIZACIÓN ===');
    console.log(`✅ Actualizados: ${actualizados}`);
    console.log(`ℹ️  Sin cambios: ${sinCambios}`);
    console.log(`❌ Errores: ${errores}`);
    console.log(`⏱️  Próxima revisión en 4 horas\n`);

  } catch (error) {
    console.error('❌ Error en actualización automática:', error);
  } finally {
    client.release();
  }
}

// Función para iniciar el servicio de actualización automática
function iniciarActualizacionAutomatica() {
  console.log('🤖 Servicio de actualización automática de tracking iniciado');
  console.log('⏰ Se ejecutará cada 4 horas');
  console.log('⏰ Primera ejecución programada');

  // Ejecutar inmediatamente al iniciar (opcional, comentar si no deseas)
  // setTimeout(actualizarEstadosAutomaticamente, 30000); // Ejecutar después de 30 segundos

  // Programar ejecución cada 4 horas
  // Formato cron: minuto hora día mes día-semana
  // '0 */4 * * *' = Cada 4 horas en el minuto 0
  cron.schedule('0 */4 * * *', async () => {
    await actualizarEstadosAutomaticamente();
  });

  // También puedes usar otros intervalos:
  // Cada hora: '0 * * * *'
  // Cada 6 horas: '0 */6 * * *'
  // Cada día a las 9am: '0 9 * * *'
  // Cada 15 minutos: '*/15 * * * *'

  console.log('✅ Servicio configurado correctamente');
}

module.exports = {
  iniciarActualizacionAutomatica,
  actualizarEstadosAutomaticamente // Exportar para poder ejecutar manualmente
};
