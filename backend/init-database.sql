-- Script de inicialización de base de datos para LushSecret
-- Ejecutar este script en la base de datos PostgreSQL de Render

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50) DEFAULT 'user'
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_status VARCHAR(100) DEFAULT 'Pendiente',
  shipping_address TEXT,
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items de pedido
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Tabla de analíticas
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  product_id INTEGER,
  user_id INTEGER,
  page VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial de tracking
CREATE TABLE IF NOT EXISTS tracking_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear usuario administrador
-- Contraseña: admin123 (cambiar después del primer login)
-- Hash generado con bcrypt (10 rounds)
INSERT INTO users (email, password, name, role) 
VALUES (
  'admin@lushsecret.com', 
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
  'Administrador', 
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Productos de ejemplo (opcional - puedes eliminar estas líneas si no quieres datos de prueba)
INSERT INTO products (name, description, price, category, stock) VALUES
  ('Lubricante Premium', 'Lubricante a base de agua de larga duración', 29900, 'lub-care', 50),
  ('Vibrador Personal', 'Dispositivo de masaje discreto y silencioso', 89900, 'smart-pleasure', 25),
  ('Conjunto Lencería', 'Set de lencería elegante y sensual', 159900, 'linea-intima', 30)
ON CONFLICT DO NOTHING;

-- Verificar que las tablas se crearon correctamente
SELECT 'Tablas creadas exitosamente!' AS status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_products FROM products;
