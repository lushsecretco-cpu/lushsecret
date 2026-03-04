const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear tabla de analytics si no existe
const initAnalyticsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        product_id INTEGER,
        product_name VARCHAR(255),
        category VARCHAR(100),
        user_ip VARCHAR(100),
        user_agent TEXT,
        session_id VARCHAR(255),
        page_url TEXT,
        referrer TEXT,
        duration INTEGER,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Agregar columna session_id si no existe (para tablas existentes)
    await pool.query(`
      ALTER TABLE analytics ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);
    `);
    
    // Crear tabla de items de órdenes si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER,
        product_name VARCHAR(255),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Crear índices para consultas rápidas
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_product_id ON analytics(product_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
      CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);
      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
      CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
    `);
    
    console.log('✅ Tabla de analytics y order_items inicializadas correctamente');
  } catch (error) {
    console.error('Error al crear tablas de analytics:', error);
  }
};

initAnalyticsTable();

// Registrar evento (visita, venta, etc)
router.post('/track', async (req, res) => {
  try {
    const {
      event_type,
      product_id,
      product_name,
      category,
      user_ip,
      user_agent,
      session_id,
      page_url,
      referrer,
      duration,
      metadata
    } = req.body;

    const result = await pool.query(
      `INSERT INTO analytics 
       (event_type, product_id, product_name, category, user_ip, user_agent, 
        session_id, page_url, referrer, duration, metadata) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [event_type, product_id, product_name, category, user_ip, user_agent, 
       session_id, page_url, referrer, duration, JSON.stringify(metadata || {})]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al registrar evento:', error);
    res.status(500).json({ error: 'Error al registrar evento' });
  }
});

// Obtener estadísticas generales
router.get('/dashboard', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    // Total de visitas
    const totalViews = await pool.query(
      `SELECT COUNT(*) FROM analytics 
       WHERE event_type = 'page_view' 
       AND created_at >= NOW() - INTERVAL '${days} days'`
    );

    // Total de visitas a productos
    const productViews = await pool.query(
      `SELECT COUNT(*) FROM analytics 
       WHERE event_type = 'product_view' 
       AND created_at >= NOW() - INTERVAL '${days} days'`
    );

    // Productos más visitados con información completa
    const topViewed = await pool.query(
      `SELECT 
        a.product_id, 
        a.product_name, 
        a.category, 
        COUNT(*) as views,
        p.image,
        p.price,
        p.stock
       FROM analytics a
       LEFT JOIN products p ON a.product_id = p.id
       WHERE a.event_type = 'product_view' 
       AND a.created_at >= NOW() - INTERVAL '${days} days'
       AND a.product_id IS NOT NULL
       GROUP BY a.product_id, a.product_name, a.category, p.image, p.price, p.stock
       ORDER BY views DESC
       LIMIT 10`
    );

    // Categorías más visitadas
    const topCategories = await pool.query(
      `SELECT category, COUNT(*) as views
       FROM analytics 
       WHERE event_type = 'product_view' 
       AND created_at >= NOW() - INTERVAL '${days} days'
       AND category IS NOT NULL
       GROUP BY category
       ORDER BY views DESC`
    );

    // Visitas por hora (últimas 24 horas)
    const viewsByHour = await pool.query(
      `SELECT 
        DATE_TRUNC('hour', created_at) as hour,
        COUNT(*) as views
       FROM analytics 
       WHERE event_type IN ('page_view', 'product_view')
       AND created_at >= NOW() - INTERVAL '24 hours'
       GROUP BY hour
       ORDER BY hour DESC`
    );

    // Visitas por día (últimos N días)
    const viewsByDay = await pool.query(
      `SELECT 
        TO_CHAR(DATE_TRUNC('day', created_at), 'DD/MM') as date,
        COUNT(*) as count
       FROM analytics 
       WHERE event_type IN ('page_view', 'product_view')
       AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE_TRUNC('day', created_at)
       ORDER BY DATE_TRUNC('day', created_at) ASC`
    );

    // Eventos recientes
    const recentEvents = await pool.query(
      `SELECT * FROM analytics 
       ORDER BY created_at DESC 
       LIMIT 50`
    );

    // Sesiones únicas
    const uniqueSessions = await pool.query(
      `SELECT COUNT(DISTINCT session_id) as count
       FROM analytics 
       WHERE created_at >= NOW() - INTERVAL '${days} days'`
    );

    // Productos agregados al carrito con información completa
    const cartAdds = await pool.query(
      `SELECT 
        a.product_id, 
        a.product_name,
        a.category,
        COUNT(*) as adds,
        p.image,
        p.price,
        p.stock
       FROM analytics a
       LEFT JOIN products p ON a.product_id = p.id
       WHERE a.event_type = 'add_to_cart' 
       AND a.created_at >= NOW() - INTERVAL '${days} days'
       AND a.product_id IS NOT NULL
       GROUP BY a.product_id, a.product_name, a.category, p.image, p.price, p.stock
       ORDER BY adds DESC
       LIMIT 10`
    );

    // Páginas más visitadas
    const topPages = await pool.query(
      `SELECT page_url, COUNT(*) as views
       FROM analytics 
       WHERE event_type = 'page_view'
       AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY page_url
       ORDER BY views DESC
       LIMIT 10`
    );

    // ========== ESTADÍSTICAS DE VENTAS ==========
    
    // Total de ventas (órdenes completadas)
    const totalSales = await pool.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue
       FROM orders 
       WHERE created_at >= NOW() - INTERVAL '${days} days'`
    );

    // Ventas por día
    const salesByDay = await pool.query(
      `SELECT 
        TO_CHAR(DATE_TRUNC('day', created_at), 'DD/MM') as date,
        COUNT(*) as sales,
        COALESCE(SUM(total), 0) as revenue
       FROM orders 
       WHERE created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE_TRUNC('day', created_at)
       ORDER BY DATE_TRUNC('day', created_at) ASC`
    );

    // Productos más vendidos (con métricas de rentabilidad)
    const topSelling = await pool.query(
      `SELECT 
        oi.product_id,
        oi.product_name,
        SUM(oi.quantity) as units_sold,
        COALESCE(SUM(oi.quantity * oi.price), 0) as revenue,
        p.image,
        p.category,
        p.stock,
        p.cost_price,
        COALESCE(SUM(oi.quantity * (oi.price - COALESCE(p.cost_price, 0))), 0) as profit,
        CASE 
          WHEN SUM(oi.quantity * oi.price) > 0 
          THEN ROUND((COALESCE(SUM(oi.quantity * (oi.price - COALESCE(p.cost_price, 0))), 0) / SUM(oi.quantity * oi.price) * 100)::numeric, 1)
          ELSE 0 
        END as profit_margin
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       LEFT JOIN orders o ON oi.order_id = o.id
       WHERE o.created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY oi.product_id, oi.product_name, p.image, p.category, p.stock, p.cost_price
       ORDER BY units_sold DESC
       LIMIT 10`
    );

    // Ticket promedio
    const avgTicket = await pool.query(
      `SELECT COALESCE(AVG(total), 0) as average
       FROM orders 
       WHERE created_at >= NOW() - INTERVAL '${days} days'`
    );

    // Órdenes recientes
    const recentOrders = await pool.query(
      `SELECT 
        o.id,
        o.total,
        o.status,
        o.created_at,
        u.name as customer_name,
        u.email as customer_email,
        COUNT(oi.id) as items_count
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY o.id, o.total, o.status, o.created_at, u.name, u.email
       ORDER BY o.created_at DESC
       LIMIT 20`
    );

    // Tasa de conversión (ventas / sesiones)
    const conversionRate = totalSales.rows[0].count > 0 && uniqueSessions.rows[0].count > 0
      ? ((totalSales.rows[0].count / uniqueSessions.rows[0].count) * 100).toFixed(2)
      : 0;

    // Ganancia total y margen promedio
    const profitStats = await pool.query(
      `SELECT 
        COALESCE(SUM(oi.quantity * (oi.price - COALESCE(p.cost_price, 0))), 0) as total_profit,
        COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue,
        CASE 
          WHEN SUM(oi.quantity * oi.price) > 0 
          THEN ROUND((SUM(oi.quantity * (oi.price - COALESCE(p.cost_price, 0))) / SUM(oi.quantity * oi.price) * 100)::numeric, 1)
          ELSE 0 
        END as avg_margin
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       LEFT JOIN orders o ON oi.order_id = o.id
       WHERE o.created_at >= NOW() - INTERVAL '${days} days'`
    );

    res.json({
      // Estadísticas de tráfico
      totalViews: parseInt(totalViews.rows[0].count),
      productViews: parseInt(productViews.rows[0].count),
      uniqueSessions: parseInt(uniqueSessions.rows[0].count),
      topViewed: topViewed.rows,
      topCategories: topCategories.rows,
      viewsByHour: viewsByHour.rows,
      viewsByDay: viewsByDay.rows,
      recentEvents: recentEvents.rows,
      cartAdds: cartAdds.rows,
      topPages: topPages.rows,
      
      // Estadísticas de ventas
      totalSales: parseInt(totalSales.rows[0].count),
      totalRevenue: parseFloat(totalSales.rows[0].revenue),
      totalProfit: parseFloat(profitStats.rows[0].total_profit),
      avgMargin: parseFloat(profitStats.rows[0].avg_margin),
      avgTicket: parseFloat(avgTicket.rows[0].average),
      conversionRate: parseFloat(conversionRate),
      salesByDay: salesByDay.rows,
      topSelling: topSelling.rows,
      recentOrders: recentOrders.rows
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Obtener eventos por tipo
router.get('/events/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 100, days = 7 } = req.query;

    const result = await pool.query(
      `SELECT * FROM analytics 
       WHERE event_type = $1 
       AND created_at >= NOW() - INTERVAL '${days} days'
       ORDER BY created_at DESC 
       LIMIT $2`,
      [type, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// Obtener productos más vistos (globalmente o por categoría)
router.get('/most-viewed', async (req, res) => {
  try {
    const { category, limit = 3 } = req.query;

    let query = `
      SELECT 
        p.*,
        COUNT(a.id) as view_count
      FROM products p
      LEFT JOIN analytics a ON p.id = a.product_id 
        AND a.event_type = 'product_view'
        AND a.created_at >= NOW() - INTERVAL '30 days'
    `;

    const params = [];
    
    if (category) {
      query += ` WHERE p.category = $1`;
      params.push(category);
    }

    query += `
      GROUP BY p.id
      ORDER BY view_count DESC, p.id ASC
      LIMIT $${params.length + 1}
    `;
    
    params.push(parseInt(limit));

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos más vistos:', error);
    res.status(500).json({ error: 'Error al obtener productos más vistos' });
  }
});

module.exports = router;
