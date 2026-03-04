const pool = require('./db');

async function migrateDatabase() {
  try {
    console.log('🚀 Iniciando migración de base de datos...');

    // Agregar columnas faltantes a la tabla users
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_info JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS customer_info JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    // Agregar columnas faltantes a la tabla products
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes JSONB;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS video TEXT;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2);
    `);

    // Agregar columnas faltantes a la tabla orders
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_info JSONB;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_carrier VARCHAR(100);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS last_tracking_check TIMESTAMP;
    `);

    // Agregar columnas faltantes a la tabla analytics
    await pool.query(`
      ALTER TABLE analytics ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);
      ALTER TABLE analytics ADD COLUMN IF NOT EXISTS category VARCHAR(100);
      ALTER TABLE analytics ADD COLUMN IF NOT EXISTS user_ip VARCHAR(100);
      ALTER TABLE analytics ADD COLUMN IF NOT EXISTS user_agent TEXT;
      ALTER TABLE analytics ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);
      ALTER TABLE analytics ADD COLUMN IF NOT EXISTS page_url TEXT;
      ALTER TABLE analytics ADD COLUMN IF NOT EXISTS referrer TEXT;
      ALTER TABLE analytics ADD COLUMN IF NOT EXISTS duration INTEGER;
    `);

    console.log('✅ Migración completada exitosamente');
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
  } finally {
    process.exit();
  }
}

migrateDatabase();