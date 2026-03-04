const pool = require('./db');

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
    console.log('Ejecutando consulta de tipos de request...');
    const requestTypesResult = await pool.query(requestTypesQuery);
    const requestTypes = {};
    requestTypesResult.rows.forEach(row => {
      requestTypes[row.method || 'UNKNOWN'] = parseInt(row.count);
    });
    console.log('Tipos de request completados:', requestTypes);

    return {
      totalLogs: parseInt(basicStats.total_logs) || 0,
      stats: {
        totalRequests24h: parseInt(basicStats.total_logs) || 0,
        uniqueIPs24h: parseInt(basicStats.unique_ips) || 0,
        requestTypes: requestTypes
      }
    };
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

async function testStats() {
  try {
    const result = await calculateSecurityStats();
    console.log('Resultado:', result);
  } catch (error) {
    console.error('Error en test:', error);
  }
}

testStats();