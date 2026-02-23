/**
 * Script para simular vistas de productos y probar el sistema de productos más vistos
 */

const pool = require('./db');

const simularVistas = async () => {
  try {
    console.log('🔍 Iniciando simulación de vistas de productos...\n');

    // Obtener algunos productos
    const productos = await pool.query('SELECT * FROM products LIMIT 10');
    
    if (productos.rows.length === 0) {
      console.log('⚠️  No hay productos en la base de datos');
      return;
    }

    console.log(`✅ Encontrados ${productos.rows.length} productos\n`);

    // Simular diferentes cantidades de vistas para diferentes productos
    const vistasConfig = [
      { productIndex: 0, vistas: 15 }, // Producto más visto
      { productIndex: 1, vistas: 12 },
      { productIndex: 2, vistas: 10 },
      { productIndex: 3, vistas: 8 },
      { productIndex: 4, vistas: 6 },
      { productIndex: 5, vistas: 4 },
      { productIndex: 6, vistas: 3 },
      { productIndex: 7, vistas: 2 },
      { productIndex: 8, vistas: 1 },
      { productIndex: 9, vistas: 1 },
    ];

    for (const config of vistasConfig) {
      if (config.productIndex >= productos.rows.length) continue;

      const producto = productos.rows[config.productIndex];
      
      console.log(`📊 Simulando ${config.vistas} vistas para: ${producto.name} (${producto.category})`);

      for (let i = 0; i < config.vistas; i++) {
        await pool.query(
          `INSERT INTO analytics 
           (event_type, product_id, product_name, category, user_ip, user_agent, 
            session_id, page_url, referrer, duration, metadata) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            'product_view',
            producto.id,
            producto.name,
            producto.category,
            `192.168.1.${Math.floor(Math.random() * 255)}`,
            'Mozilla/5.0 (Simulation)',
            `session_${Date.now()}_${i}`,
            `/producto/${producto.id}`,
            'http://localhost:3000/',
            Math.floor(Math.random() * 60) + 10, // 10-70 segundos
            JSON.stringify({ simulated: true, timestamp: new Date().toISOString() })
          ]
        );
      }
    }

    console.log('\n✅ Simulación completada!\n');

    // Mostrar estadísticas
    console.log('📈 Top 5 productos más vistos (últimos 30 días):\n');
    
    const topVistos = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.category,
        COUNT(a.id) as view_count
      FROM products p
      LEFT JOIN analytics a ON p.id = a.product_id 
        AND a.event_type = 'product_view'
        AND a.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY p.id
      HAVING COUNT(a.id) > 0
      ORDER BY view_count DESC, p.id ASC
      LIMIT 5
    `);

    topVistos.rows.forEach((prod, index) => {
      console.log(`${index + 1}. ${prod.name} (${prod.category}) - ${prod.view_count} vistas`);
    });

    console.log('\n📊 Productos más vistos por categoría:\n');

    const categorias = ['linea-intima', 'smart-pleasure', 'lub-care', 'power-up', 'zona-fetish'];
    
    for (const cat of categorias) {
      const topPorCategoria = await pool.query(`
        SELECT 
          p.id,
          p.name,
          COUNT(a.id) as view_count
        FROM products p
        LEFT JOIN analytics a ON p.id = a.product_id 
          AND a.event_type = 'product_view'
          AND a.created_at >= NOW() - INTERVAL '30 days'
        WHERE p.category = $1
        GROUP BY p.id
        HAVING COUNT(a.id) > 0
        ORDER BY view_count DESC, p.id ASC
        LIMIT 3
      `, [cat]);

      if (topPorCategoria.rows.length > 0) {
        console.log(`\n🏷️  ${cat}:`);
        topPorCategoria.rows.forEach((prod, index) => {
          console.log(`   ${index + 1}. ${prod.name} - ${prod.view_count} vistas`);
        });
      }
    }

    console.log('\n✅ Ahora puedes refrescar localhost:3000 para ver los productos más vistos\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al simular vistas:', error);
    process.exit(1);
  }
};

simularVistas();
