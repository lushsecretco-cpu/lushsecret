# 🚀 Despliegue del Backend en Render

## Pasos para desplegar

### 1. Crear cuenta en Render
- Ve a https://render.com
- Haz clic en "Get Started" 
- Selecciona "Continue with GitHub"
- Autoriza el acceso a tu repositorio

### 2. Crear Base de Datos PostgreSQL

1. En el dashboard de Render, haz clic en **"New +"** → **"PostgreSQL"**
2. Configura:
   - **Name:** `lushsecret-db`
   - **Database:** `lushsecret`
   - **User:** `lushsecret_user` (auto-generado)
   - **Region:** Oregon (o la más cercana)
   - **Plan:** Free
3. Haz clic en **"Create Database"**
4. **IMPORTANTE:** Copia la **"Internal Database URL"** (la usarás en el siguiente paso)

### 3. Crear Web Service para el Backend

1. En el dashboard, haz clic en **"New +"** → **"Web Service"**
2. Selecciona tu repositorio: **`lushsecretco-cpu/lushsecret`**
3. Haz clic en **"Connect"**

4. Configura el servicio:
   - **Name:** `lushsecret-api`
   - **Region:** Oregon (la misma que la base de datos)
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ **MUY IMPORTANTE**
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Agrega las **Environment Variables** (haz clic en "Add Environment Variable"):

   ```
   NODE_ENV = production
   PORT = 4000
   DATABASE_URL = [pega aquí la Internal Database URL que copiaste]
   JWT_SECRET = [genera un secreto aleatorio seguro]
   EMAIL_USER = tu_email@gmail.com
   EMAIL_PASSWORD = [tu contraseña de aplicación de Gmail]
   FRONTEND_URL = https://lushsecret.vercel.app
   BOLD_API_KEY = [tu API key de Bold]
   BOLD_PUBLIC_KEY = [tu public key de Bold]
   BOLD_API_SECRET = [tu secret de Bold]
   ```

   **⚠️ Para generar JWT_SECRET seguro:**
   - Abre una terminal y ejecuta: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - Copia el resultado

6. Haz clic en **"Create Web Service"**

### 4. Esperar el Deploy

- Render empezará a construir tu backend (2-3 minutos)
- Verás los logs en tiempo real
- ✅ Cuando termine, te dará una URL como: `https://lushsecret-api.onrender.com`

### 5. Inicializar la Base de Datos

Una vez desplegado el backend, necesitas crear las tablas:

1. En el dashboard de tu base de datos PostgreSQL, haz clic en **"Connect"** → **"PSQL Command"**
2. Copia el comando y ejecútalo en tu terminal local
3. Luego ejecuta los siguientes SQL:

```sql
-- Crear tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50) DEFAULT 'user'
);

-- Crear tabla de productos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de pedidos
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_status VARCHAR(100) DEFAULT 'Pendiente',
  shipping_address TEXT,
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de items de pedido
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Crear tabla de analíticas
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  product_id INTEGER,
  user_id INTEGER,
  page VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de historial de tracking
CREATE TABLE tracking_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear usuario admin (opcional)
INSERT INTO users (email, password, name, role) 
VALUES ('admin@lushsecret.co', '$2a$10$ejemplo_hash', 'Admin', 'admin');
```

### 6. Actualizar Frontend en Vercel

Una vez que tengas la URL del backend en Render, actualiza la variable de entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Edita `NEXT_PUBLIC_API_URL`
4. Cambia el valor a: `https://lushsecret-api.onrender.com`
5. Haz clic en "Save"
6. Redeploy el frontend (Deployments → ... → Redeploy)

### 7. Configurar CORS

El backend ya tiene CORS configurado, pero si necesitas agregar tu dominio de Vercel, edita `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'https://lushsecret.vercel.app',  // ⬅️ Agrega tu URL de Vercel
    'https://lushsecret-api.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## ⚠️ Notas Importantes

1. **Plan Free de Render:** El servicio se duerme después de 15 minutos de inactividad. La primera petición puede tardar 30-60 segundos en despertar.

2. **Base de Datos Free:** Tiene límite de 90 días, después deberás migrar o actualizar.

3. **Logs:** Puedes ver los logs en tiempo real desde el dashboard de Render.

4. **Salud del servicio:** Render tiene health checks automáticos en `/` o puedes crear un endpoint `/health`.

## 🔒 Seguridad

- Nunca subas archivos `.env` a GitHub
- Usa variables de entorno para todos los secretos
- Mantén el `JWT_SECRET` seguro
- Usa contraseñas de aplicación para Gmail, no tu contraseña principal

## 📊 Monitoreo

Render ofrece:
- Métricas de CPU y memoria
- Logs en tiempo real
- Alertas por email
- Reinicio automático si el servicio falla

## 🆘 Troubleshooting

**El servicio no inicia:**
- Revisa los logs en el dashboard
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que `Root Directory` sea `backend`

**Error de conexión a base de datos:**
- Verifica que `DATABASE_URL` esté correctamente configurada
- Usa la "Internal Database URL" no la "External"

**CORS errors:**
- Agrega tu dominio de Vercel a `corsOptions` en `server.js`
