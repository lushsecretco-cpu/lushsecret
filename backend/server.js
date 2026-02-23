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

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Lush Secret funcionando');
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