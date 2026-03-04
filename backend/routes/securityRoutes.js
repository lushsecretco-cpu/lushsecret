const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// Middleware para verificar token de admin
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Función para calcular estadísticas de seguridad
const calculateSecurityStats = async () => {
  try {
    console.log('Calculando estadísticas de seguridad...');

    // Obtener estadísticas básicas
    const basicStatsQuery = `
      SELECT
        COUNT(*) as total_logs,
        COUNT(DISTINCT ip) as unique_ips
      FROM security_logs
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
    `;
    console.log('Ejecutando consulta básica...');
    const basicStatsResult = await pool.query(basicStatsQuery);
    const basicStats = basicStatsResult.rows[0];
    console.log('Consulta básica completada:', basicStats);

    // Obtener tipos de request
    const requestTypesQuery = `
      SELECT method, COUNT(*) as count
      FROM security_logs
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
      GROUP BY method
    `;
    const requestTypesResult = await pool.query(requestTypesQuery);
    const requestTypes = {};
    requestTypesResult.rows.forEach(row => {
      requestTypes[row.method || 'UNKNOWN'] = parseInt(row.count);
    });

    // Obtener actividad por hora
    const hourlyActivityQuery = `
      SELECT
        EXTRACT(hour FROM timestamp)::text as hour,
        COUNT(*) as count
      FROM security_logs
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
      GROUP BY EXTRACT(hour FROM timestamp)
      ORDER BY hour
    `;
    const hourlyActivityResult = await pool.query(hourlyActivityQuery);
    const hourlyActivity = {};
    hourlyActivityResult.rows.forEach(row => {
      hourlyActivity[row.hour] = parseInt(row.count);
    });

    // Obtener IPs más activas
    const topIPsQuery = `
      SELECT ip, COUNT(*) as count
      FROM security_logs
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
      GROUP BY ip
      ORDER BY count DESC
      LIMIT 10
    `;
    const topIPsResult = await pool.query(topIPsQuery);

    // Obtener endpoints más accedidos
    const topEndpointsQuery = `
      SELECT url, COUNT(*) as count
      FROM security_logs
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
      GROUP BY url
      ORDER BY count DESC
      LIMIT 10
    `;
    const topEndpointsResult = await pool.query(topEndpointsQuery);

    // Detectar actividades sospechosas
    const suspiciousQuery = `
      SELECT
        ip,
        COUNT(*) as count,
        MAX(timestamp) as last_attempt
      FROM security_logs
      WHERE timestamp >= NOW() - INTERVAL '1 hour'
      GROUP BY ip
      HAVING COUNT(*) > 5
      ORDER BY count DESC
      LIMIT 20
    `;
    const suspiciousResult = await pool.query(suspiciousQuery);

    // Procesar actividades sospechosas y asignar tipos
    const suspiciousActivities = suspiciousResult.rows.map(row => {
      const count = parseInt(row.count);
      let type = 'Monitoreo';
      if (count > 50) type = 'Ataque masivo';
      else if (count > 20) type = 'Actividad sospechosa alta';
      else if (count > 10) type = 'Actividad sospechosa';

      return {
        ip: row.ip,
        count: count,
        lastAttempt: row.last_attempt,
        type: type
      };
    });

    // Obtener logs recientes
    const recentLogsQuery = `
      SELECT
        method,
        url,
        ip,
        user_id,
        timestamp,
        status_code,
        user_agent,
        CASE
          WHEN status_code >= 400 THEN 'error'
          WHEN url LIKE '%admin%' THEN 'admin'
          WHEN url LIKE '%login%' THEN 'auth'
          ELSE 'normal'
        END as category
      FROM security_logs
      ORDER BY timestamp DESC
      LIMIT 50
    `;
    const recentLogsResult = await pool.query(recentLogsQuery);

    return {
      totalLogs: parseInt(basicStats.total_logs) || 0,
      stats: {
        totalRequests24h: parseInt(basicStats.total_logs) || 0,
        uniqueIPs24h: parseInt(basicStats.unique_ips) || 0,
        requestTypes: {},
        hourlyActivity: {},
        topIPs: [],
        topEndpoints: []
      },
      suspiciousActivities: [],
      recentLogs: [],
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error calculating security stats:', error);
    throw error;
  }
};

// GET /api/security/stats - Obtener estadísticas de seguridad
router.get('/stats', verifyAdminToken, async (req, res) => {
  try {
    const securityData = await calculateSecurityStats();
    res.json(securityData);
  } catch (error) {
    console.error('Error fetching security stats:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// GET /api/security/logs - Obtener logs de seguridad con filtros
router.get('/logs', verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 100, ip, method, status, startDate, endDate } = req.query;

    let query = `
      SELECT
        id,
        method,
        url,
        ip,
        user_id,
        timestamp,
        status_code,
        user_agent,
        request_size,
        response_time
      FROM security_logs
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (ip) {
      query += ` AND ip = $${paramCount}`;
      params.push(ip);
      paramCount++;
    }

    if (method) {
      query += ` AND method = $${paramCount}`;
      params.push(method);
      paramCount++;
    }

    if (status) {
      query += ` AND status_code = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (startDate) {
      query += ` AND timestamp >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND timestamp <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    query += ` ORDER BY timestamp DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, (page - 1) * limit);

    const result = await pool.query(query, params);

    // Obtener total de registros para paginación
    const countQuery = `
      SELECT COUNT(*) as total
      FROM security_logs
      WHERE 1=1
      ${ip ? 'AND ip = $1' : ''}
      ${method ? `AND method = $${ip ? 2 : 1}` : ''}
      ${status ? `AND status_code = $${paramCount - 3}` : ''}
      ${startDate ? `AND timestamp >= $${paramCount - 2}` : ''}
      ${endDate ? `AND timestamp <= $${paramCount - 1}` : ''}
    `;

    const countParams = params.slice(0, -2); // Remover limit y offset
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      logs: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching security logs:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// DELETE /api/security/logs/:id - Eliminar un log específico
router.delete('/logs/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM security_logs WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Log no encontrado' });
    }

    res.json({ message: 'Log eliminado exitosamente', deletedLog: result.rows[0] });
  } catch (error) {
    console.error('Error deleting security log:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// POST /api/security/block-ip - Bloquear una IP
router.post('/block-ip', verifyAdminToken, async (req, res) => {
  try {
    const { ip, reason, duration } = req.body;

    if (!ip) {
      return res.status(400).json({ error: 'IP es requerida' });
    }

    // Aquí podrías implementar lógica para bloquear IPs
    // Por ahora, solo registramos la acción
    await pool.query(`
      INSERT INTO security_logs (method, url, ip, user_id, status_code, user_agent, request_size, response_time)
      VALUES ('BLOCK', '/api/security/block-ip', $1, $2, 200, 'Admin Action', 0, 0)
    `, [ip, req.user.id]);

    res.json({
      message: `IP ${ip} bloqueada exitosamente`,
      blocked: true,
      reason: reason || 'Bloqueo administrativo',
      duration: duration || 'Permanente'
    });
  } catch (error) {
    console.error('Error blocking IP:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

module.exports = router;