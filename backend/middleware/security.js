const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora (aumentado para desarrollo)
  max: 1000, // límite de 1000 requests por hora (ajustado para e-commerce con analytics)
  message: {
    error: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting más estricto para rutas de autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 intentos de login/registro por windowMs
  message: {
    error: 'Demasiados intentos de autenticación. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No cuenta las solicitudes exitosas
});

// Rate limiting para creación de pedidos
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 pedidos por hora por IP
  message: {
    error: 'Demasiados pedidos desde esta IP. Contacta soporte si crees que es un error.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuración de Helmet para headers de seguridad
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.twilio.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Middleware de sanitización y seguridad
const securityMiddleware = [
  helmetConfig,
  mongoSanitize(), // Sanitiza datos contra inyección NoSQL
  xss(), // Sanitiza datos contra XSS
  hpp(), // Previene HTTP Parameter Pollution
];

module.exports = {
  limiter,
  authLimiter,
  orderLimiter,
  securityMiddleware,
};