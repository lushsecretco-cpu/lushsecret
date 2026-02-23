// Simulación de actualización automática con detección de cambio y envío de email
const pool = require('./db');
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

async function simularCambioAutomatico() {
  const client = await pool.connect();
  
  try {
    console.log('🤖 === SIMULACIÓN DE CAMBIO AUTOMÁTICO ===\n');
    console.log('⏰ Simulando consulta automática a transportadora...\n');

    const orderId = 1;
    
    // 1. Obtener orden actual
    const orderResult = await client.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = orderResult.rows[0];
    
    console.log(`📦 Pedido #${order.id}`);
    console.log(`   Estado actual en DB: ${order.shipping_status} (${SHIPPING_STATUSES[order.shipping_status]})`);
    console.log(`   Consultando API de ${order.shipping_carrier}...\n`);

    // 2. Simular respuesta de la API de la transportadora
    const nuevoEstado = {
      status: 'out_for_delivery',
      location: 'Bogotá - Vehículo de Reparto',
      description: 'Tu paquete está en el vehículo de reparto y será entregado hoy',
      estimatedDelivery: null
    };

    console.log(`✅ API respondió:`);
    console.log(`   Nuevo estado: ${nuevoEstado.status} (${SHIPPING_STATUSES[nuevoEstado.status]})`);
    console.log(`   Ubicación: ${nuevoEstado.location}`);
    console.log(`   Descripción: ${nuevoEstado.description}\n`);

    // 3. Verificar si cambió
    if (nuevoEstado.status === order.shipping_status) {
      console.log('ℹ️  Sin cambios detectados\n');
      return;
    }

    console.log(`🔄 ¡CAMBIO DETECTADO!`);
    console.log(`   ${order.shipping_status} → ${nuevoEstado.status}\n`);

    await client.query('BEGIN');

    // 4. Actualizar orden
    await client.query(`
      UPDATE orders 
      SET 
        shipping_status = $1,
        last_tracking_check = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [nuevoEstado.status, orderId]);

    console.log(`✅ Base de datos actualizada`);

    // 5. Crear historial
    await client.query(`
      INSERT INTO tracking_history (order_id, status, location, description)
      VALUES ($1, $2, $3, $4)
    `, [orderId, nuevoEstado.status, nuevoEstado.location, nuevoEstado.description]);

    console.log(`✅ Historial de tracking creado\n`);

    await client.query('COMMIT');

    // 6. Preparar email
    const customerInfo = order.customer_info;
    const email = customerInfo.correo;
    const statusName = SHIPPING_STATUSES[nuevoEstado.status];

    console.log(`📧 Preparando email luxury para ${email}...`);
    console.log(`   Asunto: Actualización Automática - Pedido #${order.id} - ${statusName}`);
    console.log(`   Contenido: Template HTML con diseño gold luxury\n`);

    // Simular envío de email (no enviarlo realmente en test)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      console.log('   ⚠️  Email configurado pero NO se enviará en modo test');
    } else {
      console.log('   ℹ️  Email NO configurado (modo simulación)');
    }

    console.log('\n✅ === SIMULACIÓN COMPLETADA ===\n');
    console.log('📊 Resumen de cambios:');
    console.log(`   - Estado actualizado: ${SHIPPING_STATUSES[order.shipping_status]} → ${statusName}`);
    console.log(`   - Ubicación: ${nuevoEstado.location}`);
    console.log(`   - Historial: +1 nuevo evento`);
    console.log(`   - Email: Preparado (simulado)\n`);

    console.log('🌐 Verifica los cambios en:');
    console.log(`   http://localhost:3000/tracking/${orderId}\n`);

    // Mostrar historial actualizado
    const historyResult = await client.query(`
      SELECT * FROM tracking_history 
      WHERE order_id = $1 
      ORDER BY created_at DESC
      LIMIT 3
    `, [orderId]);

    console.log('📝 Últimos 3 eventos del historial:');
    console.log('─'.repeat(70));
    historyResult.rows.forEach((record, index) => {
      const fecha = new Date(record.created_at).toLocaleString('es-CO');
      console.log(`${index + 1}. [${fecha}] ${SHIPPING_STATUSES[record.status] || record.status}`);
      console.log(`   📍 ${record.location || 'Sin ubicación'}`);
      console.log(`   💬 ${record.description || 'Sin descripción'}\n`);
    });
    console.log('─'.repeat(70));

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en simulación:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Ejecutar
if (require.main === module) {
  simularCambioAutomatico()
    .then(() => {
      console.log('\n✅ Simulación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}
