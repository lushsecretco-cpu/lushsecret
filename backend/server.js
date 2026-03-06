const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const securityRoutes = require('./routes/securityRoutes');
const { iniciarActualizacionAutomatica } = require('./services/trackingAutoUpdater');
const pool = require('./db');
const cors = require('cors');
const dotenv = require('dotenv');
const { securityMiddleware, limiter, authLimiter, orderLimiter } = require('./middleware/security');
const { securityLogger } = require('./middleware/securityLogger');
dotenv.config();

const port = process.env.PORT || 4000;

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // process.exit(1);
});

// Configuración CORS para desarrollo y producción
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://lushsecret.vercel.app', // URL de Vercel
  'https://lushsecret.co', // Dominio personalizado
  'https://www.lushsecret.co', // Dominio personalizado con www
  'http://lushsecret.co', // HTTP (por si acaso)
  'http://www.lushsecret.co', // HTTP con www
  process.env.FRONTEND_URL, // URL de Vercel desde variable de entorno
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin?.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de seguridad
app.use(securityMiddleware);

// Security logging
app.use(securityLogger);

// Rate limiting general
app.use(limiter);

// Parsing del body con límite de tamaño
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API Lush Secret funcionando',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.use('/api/auth', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/security', securityRoutes);

app.listen(port, async () => {
  console.log(`Servidor backend escuchando en puerto ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`Database configured: ${process.env.DATABASE_URL ? 'YES' : 'NO'}`);
  
  // Verificar conexión a base de datos
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Base de datos conectada:', result.rows[0].now);
  } catch (err) {
    console.error('❌ Error conectando a base de datos:', err.message);
  }
  
  // Iniciar servicio de actualización automática de tracking
  console.log('\n🚀 Iniciando servicio de tracking automático...');
  iniciarActualizacionAutomatica();
});