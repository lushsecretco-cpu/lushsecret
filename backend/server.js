const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const { iniciarActualizacionAutomatica } = require('./services/trackingAutoUpdater');
const pool = require('./db');
const cors = require('cors');
const dotenv = require('dotenv');
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

app.use(express.json());

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

app.listen(port, () => {
  console.log(`Servidor backend escuchando en puerto ${port}`);
  
  // Iniciar servicio de actualización automática de tracking
  console.log('\n🚀 Iniciando servicio de tracking automático...');
  iniciarActualizacionAutomatica();
});