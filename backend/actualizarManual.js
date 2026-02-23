const pool = require('./db');

async function actualizarPedidoManual() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 === ACTUALIZANDO PEDIDO #1 MANUALMENTE ===\n');

    // Simular actualización desde admin panel
    const orderId = 1;
    const nuevoEstado = 'shipped'; // Cambiar a "En Camino"
    const ubicacion = 'Bogotá - Centro de Distribución';
    const descripcion = 'El paquete ha salido de nuestra bodega y está en camino a tu ciudad';

    await client.query('BEGIN');

    // 1. Actualizar la orden
    const updateResult = await client.query(`
      UPDATE orders 
      SET 
        shipping_status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [nuevoEstado, orderId]);

    const order = updateResult.rows[0];
    console.log(`✅ Orden #${order.id} actualizada`);
    console.log(`   Estado anterior: processing → Nuevo estado: ${nuevoEstado}`);
    console.log(`   Ubicación: ${ubicacion}`);
    console.log(`   Descripción: ${descripcion}\n`);

    // 2. Agregar al historial de tracking
    await client.query(`
      INSERT INTO tracking_history (order_id, status, location, description)
      VALUES ($1, $2, $3, $4)
    `, [orderId, nuevoEstado, ubicacion, descripcion]);

    console.log(`📝 Historial de tracking actualizado\n`);

    // 3. Verificar información del cliente
    const customerInfo = order.customer_info;
    console.log(`📧 Información del cliente:`);
    console.log(`   Nombre: ${customerInfo.nombre} ${customerInfo.apellidos}`);
    console.log(`   Email: ${customerInfo.correo}`);
    console.log(`   Teléfono: ${customerInfo.telefono}\n`);

    await client.query('COMMIT');

    console.log('✅ === ACTUALIZACIÓN COMPLETADA ===\n');
    console.log('🎯 Ahora puedes:');
    console.log('   1. Refrescar http://localhost:3000/tracking/1 para ver los cambios');
    console.log('   2. Revisar el historial de tracking');
    console.log('   3. Ver el nuevo estado "En Camino"\n');

    console.log('📨 Nota: En producción, se enviaría un email automático al cliente');
    console.log('   con el diseño luxury notificando el cambio de estado.\n');

    // Mostrar historial completo
    const historyResult = await client.query(`
      SELECT * FROM tracking_history 
      WHERE order_id = $1 
      ORDER BY created_at ASC
    `, [orderId]);

    console.log('📊 Historial completo de tracking:');
    console.log('─'.repeat(70));
    historyResult.rows.forEach((record, index) => {
      const fecha = new Date(record.created_at).toLocaleString('es-CO');
      console.log(`${index + 1}. [${fecha}]`);
      console.log(`   Estado: ${record.status}`);
      console.log(`   Ubicación: ${record.location || 'No especificada'}`);
      console.log(`   Descripción: ${record.description || 'Sin descripción'}`);
      console.log('');
    });
    console.log('─'.repeat(70));

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error actualizando pedido:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Ejecutar
if (require.main === module) {
  actualizarPedidoManual()
    .then(() => {
      console.log('\n✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { actualizarPedidoManual };
