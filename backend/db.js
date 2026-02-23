const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Crear tablas si no existen
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user'
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(500),
        category VARCHAR(100),
        sizes JSONB,
        stock INTEGER DEFAULT 0,
        video VARCHAR(500)
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Agregar columna image si no existe
    try {
      await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image VARCHAR(500);`);
      console.log('Columna image agregada o ya existe.');
    } catch (err) {
      console.log('Columna image ya existe o error:', err.message);
    }

    // Agregar columna sizes si no existe
    try {
      await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes JSONB;`);
      console.log('Columna sizes agregada o ya existe.');
    } catch (err) {
      console.log('Columna sizes ya existe o error:', err.message);
    }

    // Agregar columna stock si no existe
    try {
      await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;`);
      console.log('Columna stock agregada o ya existe.');
    } catch (err) {
      console.log('Columna stock ya existe o error:', err.message);
    }

    // Agregar columna video si no existe
    try {
      await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS video VARCHAR(500);`);
      console.log('Columna video agregada o ya existe.');
    } catch (err) {
      console.log('Columna video ya existe o error:', err.message);
    }

    // Agregar columna cost_price para costo de producción
    try {
      await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2) DEFAULT 0;`);
      console.log('Columna cost_price agregada o ya existe.');
    } catch (err) {
      console.log('Columna cost_price ya existe o error:', err.message);
    }

    // Agregar columnas a users si no existen
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER;`);
      console.log('Columna age agregada o ya existe.');
    } catch (err) {
      console.log('Columna age ya existe o error:', err.message);
    }
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(255);`);
      console.log('Columna city agregada o ya existe.');
    } catch (err) {
      console.log('Columna city ya existe o error:', err.message);
    }
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;`);
      console.log('Columna address agregada o ya existe.');
    } catch (err) {
      console.log('Columna address ya existe o error:', err.message);
    }

    // Agregar columnas a orders para información de pago
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_info JSONB;`);
      console.log('Columna customer_info agregada o ya existe.');
    } catch (err) {
      console.log('Columna customer_info ya existe o error:', err.message);
    }
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'bold';`);
      console.log('Columna payment_method agregada o ya existe.');
    } catch (err) {
      console.log('Columna payment_method ya existe o error:', err.message);
    }
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_info JSONB;`);
      console.log('Columna payment_info agregada o ya existe.');
    } catch (err) {
      console.log('Columna payment_info ya existe o error:', err.message);
    }
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;`);
      console.log('Columna updated_at agregada o ya existe.');
    } catch (err) {
      console.log('Columna updated_at ya existe o error:', err.message);
    }

    // Agregar columnas para tracking de envíos
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);`);
      console.log('Columna tracking_number agregada o ya existe.');
    } catch (err) {
      console.log('Columna tracking_number ya existe o error:', err.message);
    }
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;`);
      console.log('Columna tracking_url agregada o ya existe.');
    } catch (err) {
      console.log('Columna tracking_url ya existe o error:', err.message);
    }
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_status VARCHAR(50) DEFAULT 'pending';`);
      console.log('Columna shipping_status agregada o ya existe.');
    } catch (err) {
      console.log('Columna shipping_status ya existe o error:', err.message);
    }
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_carrier VARCHAR(100);`);
      console.log('Columna shipping_carrier agregada o ya existe.');
    } catch (err) {
      console.log('Columna shipping_carrier ya existe o error:', err.message);
    }
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP;`);
      console.log('Columna estimated_delivery agregada o ya existe.');
    } catch (err) {
      console.log('Columna estimated_delivery ya existe o error:', err.message);
    }
    try {
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS last_tracking_check TIMESTAMP;`);
      console.log('Columna last_tracking_check agregada o ya existe.');
    } catch (err) {
      console.log('Columna last_tracking_check ya existe o error:', err.message);
    }

    // Crear tabla de historial de tracking
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tracking_history (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL,
        location VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla tracking_history creada o ya existe.');

    // Crear índices para tracking
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_tracking_order_id ON tracking_history(order_id);
        CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);
      `);
      console.log('Índices de tracking creados.');
    } catch (err) {
      console.log('Índices de tracking ya existen o error:', err.message);
    }

    // Insertar usuario admin por defecto si no existe
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Admin', 'admin@lushsecret.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword]);
    console.log('Usuario admin creado o ya existe.');
  } catch (err) {
    console.error('Error creando tablas o usuario:', err);
  }
};

(async () => {
  try {
    await createTables();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
})();

module.exports = pool;
