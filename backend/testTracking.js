const pool = require('./db');

async function crearPedidoDeTest() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 === CREANDO PEDIDO DE PRUEBA ===\n');

    // 1. Crear orden de test
    const orderResult = await client.query(`
      INSERT INTO orders (
        user_id, 
        total, 
        status, 
        customer_info, 
        payment_method,
        shipping_status,
        tracking_number,
        tracking_url,
        shipping_carrier,
        estimated_delivery,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
      RETURNING *
    `, [
      null, // user_id
      150000, // total (150,000 COP)
      'paid', // status
      JSON.stringify({
        nombre: 'Juan',
        apellidos: 'Pérez',
        cedula: '1234567890',
        telefono: '3001234567',
        correo: 'test@example.com',
        direccion: 'Calle 123 #45-67',
        ciudad: 'Bogotá',
        nombreRecibe: 'Juan Pérez',
        observaciones: 'Pedido de prueba para sistema de tracking automático'
      }),
      'bold', // payment_method
      'processing', // shipping_status inicial
      'TEST123456789', // tracking_number
      'https://www.servientrega.com/rastreo/test', // tracking_url (URL de prueba)
      'Servientrega', // shipping_carrier
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // estimated_delivery (+3 días)
    ]);

    const order = orderResult.rows[0];
    console.log(`✅ Orden creada: #${order.id}`);
    console.log(`   Total: $${parseFloat(order.total).toLocaleString('es-CO')}`);
    console.log(`   Cliente: ${order.customer_info.nombre} ${order.customer_info.apellidos}`);
    console.log(`   Email: ${order.customer_info.correo}`);
    console.log(`   Estado: ${order.shipping_status}`);
    console.log(`   Guía: ${order.tracking_number}`);
    console.log(`   Transportadora: ${order.shipping_carrier}`);
    console.log(`   URL Tracking: ${order.tracking_url}\n`);

    // 2. Crear items de la orden
    const items = [
      { name: 'Lubricante Premium', price: 80000, quantity: 1 },
      { name: 'Juguete Íntimo', price: 70000, quantity: 1 }
    ];

    for (const item of items) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
        VALUES ($1, $2, $3, $4, $5)
      `, [order.id, 1, item.name, item.quantity, item.price]);
      
      console.log(`   📦 Item: ${item.name} x${item.quantity} - $${item.price.toLocaleString('es-CO')}`);
    }

    // 3. Crear historial inicial de tracking
    await client.query(`
      INSERT INTO tracking_history (order_id, status, location, description)
      VALUES ($1, $2, $3, $4)
    `, [
      order.id,
      'processing',
      'Bogotá - Bodega Principal',
      'Pedido recibido y en preparación'
    ]);

    console.log(`   📝 Historial de tracking inicializado\n`);

    console.log('✅ === PEDIDO DE TEST CREADO EXITOSAMENTE ===\n');
    console.log('📊 Resumen:');
    console.log(`   - ID del pedido: #${order.id}`);
    console.log(`   - El sistema revisará automáticamente cada 4 horas`);
    console.log(`   - Puedes ver el tracking en: http://localhost:3000/tracking/${order.id}`);
    console.log(`   - Puedes actualizar en admin: http://localhost:3000/admin/shipping\n`);

    console.log('🔧 Para probar manualmente el actualizador automático:');
    console.log(`   node backend/manualUpdate.js\n`);

    return order;

  } catch (error) {
    console.error('❌ Error creando pedido de test:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  crearPedidoDeTest()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { crearPedidoDeTest };
