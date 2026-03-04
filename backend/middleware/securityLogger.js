const fs = require('fs').promises;
const path = require('path');

// Middleware para logging de seguridad
const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  const method = req.method;
  const url = req.url;
  const userId = req.user ? req.user.id : 'anonymous';

  // Log básico de todas las requests
  const logEntry = {
    timestamp,
    ip,
    userAgent,
    method,
    url,
    userId,
    headers: {
      'content-type': req.get('content-type'),
      'content-length': req.get('content-length'),
      'x-forwarded-for': req.get('x-forwarded-for'),
      'x-real-ip': req.get('x-real-ip')
    }
  };

  // Loggear en consola para desarrollo
  console.log(`[SECURITY] ${timestamp} - ${ip} - ${method} ${url} - User: ${userId}`);

  // En producción, podrías querer escribir a un archivo o servicio de logging
  // Por ahora, solo mantenemos en memoria para análisis
  if (!global.securityLogs) {
    global.securityLogs = [];
  }

  global.securityLogs.push(logEntry);

  // Mantener solo los últimos 1000 logs para evitar memory leaks
  if (global.securityLogs.length > 1000) {
    global.securityLogs = global.securityLogs.slice(-1000);
  }

  next();
};

// Función para detectar actividades sospechosas
const detectSuspiciousActivity = (logs) => {
  const suspicious = [];
  const now = new Date();

  // Agrupar por IP
  const ipGroups = {};
  logs.forEach(log => {
    if (!ipGroups[log.ip]) {
      ipGroups[log.ip] = [];
    }
    ipGroups[log.ip].push(log);
  });

  // Detectar IPs con muchos requests fallidos de autenticación
  Object.keys(ipGroups).forEach(ip => {
    const ipLogs = ipGroups[ip];
    const failedAuthAttempts = ipLogs.filter(log =>
      (log.url.includes('/login') || log.url.includes('/register') || log.url.includes('/verify')) &&
      log.method === 'POST'
    );

    if (failedAuthAttempts.length > 5) {
      suspicious.push({
        type: 'high_failed_auth_attempts',
        ip,
        count: failedAuthAttempts.length,
        lastAttempt: failedAuthAttempts[failedAuthAttempts.length - 1].timestamp,
        severity: failedAuthAttempts.length > 10 ? 'high' : 'medium'
      });
    }

    // Detectar requests muy rápidos (posible bot)
    const recentLogs = ipLogs.filter(log =>
      (now - new Date(log.timestamp)) < 60000 // últimos 60 segundos
    );

    if (recentLogs.length > 20) {
      suspicious.push({
        type: 'high_request_frequency',
        ip,
        count: recentLogs.length,
        timeWindow: '60s',
        lastAttempt: recentLogs[recentLogs.length - 1].timestamp,
        severity: recentLogs.length > 50 ? 'high' : 'medium'
      });
    }

    // Detectar escaneo de endpoints
    const uniqueUrls = new Set(ipLogs.map(log => log.url));
    if (uniqueUrls.size > 10 && ipLogs.length > 15) {
      suspicious.push({
        type: 'endpoint_scanning',
        ip,
        count: uniqueUrls.size,
        lastAttempt: ipLogs[ipLogs.length - 1].timestamp,
        severity: 'medium'
      });
    }
  });

  return suspicious;
};

// Función para calcular estadísticas de seguridad
const calculateSecurityStats = (logs) => {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

  const recentLogs = logs.filter(log => new Date(log.timestamp) > last24Hours);
  const veryRecentLogs = logs.filter(log => new Date(log.timestamp) > lastHour);

  // Contar tipos de requests
  const requestTypes = {
    GET: recentLogs.filter(log => log.method === 'GET').length,
    POST: recentLogs.filter(log => log.method === 'POST').length,
    PUT: recentLogs.filter(log => log.method === 'PUT').length,
    DELETE: recentLogs.filter(log => log.method === 'DELETE').length
  };

  // IPs más activas
  const ipActivity = {};
  recentLogs.forEach(log => {
    ipActivity[log.ip] = (ipActivity[log.ip] || 0) + 1;
  });

  const topIPs = Object.entries(ipActivity)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([ip, count]) => ({ ip, count }));

  // Endpoints más accedidos
  const endpointActivity = {};
  recentLogs.forEach(log => {
    endpointActivity[log.url] = (endpointActivity[log.url] || 0) + 1;
  });

  const topEndpoints = Object.entries(endpointActivity)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([endpoint, count]) => ({ endpoint, count }));

  // Actividad por hora (últimas 24 horas)
  const hourlyActivity = {};
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourKey = hour.getHours().toString().padStart(2, '0') + ':00';
    hourlyActivity[hourKey] = recentLogs.filter(log => {
      const logHour = new Date(log.timestamp);
      return logHour.getHours() === hour.getHours() &&
             logHour.toDateString() === hour.toDateString();
    }).length;
  }

  return {
    totalRequests24h: recentLogs.length,
    totalRequests1h: veryRecentLogs.length,
    uniqueIPs24h: new Set(recentLogs.map(log => log.ip)).size,
    requestTypes,
    topIPs,
    topEndpoints,
    hourlyActivity,
    averageRequestsPerHour: Math.round(recentLogs.length / 24)
  };
};

// Endpoint para obtener logs de seguridad (solo admin)
const getSecurityLogs = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  const logs = global.securityLogs || [];
  const suspicious = detectSuspiciousActivity(logs);
  const stats = calculateSecurityStats(logs);

  res.json({
    totalLogs: logs.length,
    suspiciousActivities: suspicious,
    recentLogs: logs.slice(-50), // últimos 50 logs
    stats,
    lastUpdated: new Date().toISOString()
  });
};

module.exports = {
  securityLogger,
  getSecurityLogs,
  detectSuspiciousActivity
};