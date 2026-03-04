import React, { useState, useEffect, useRef } from 'react';
import { FaShieldAlt, FaExclamationTriangle, FaEye, FaClock, FaNetworkWired, FaUserShield, FaChartBar, FaGlobe, FaServer, FaBolt, FaDownload, FaBell, FaBellSlash } from 'react-icons/fa';
import LuxuryBackground from '../../components/LuxuryBackground';
import { API_URL } from '../../config/api';

export default function SecurityDashboard() {
  const [securityData, setSecurityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 segundos
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const previousSuspiciousCount = useRef(0);
  const previousTotalLogs = useRef(0);

  // Función helper para formatear timestamps
  const formatTimestamp = (timestampString) => {
    const date = new Date(timestampString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    // Solicitar permiso para notificaciones
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    fetchSecurityData();

    // Actualizar automáticamente
    const interval = setInterval(fetchSecurityData, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Efecto para detectar cambios y enviar notificaciones
  useEffect(() => {
    if (securityData && notificationsEnabled) {
      const currentSuspicious = securityData.suspiciousActivities?.length || 0;
      const currentLogs = securityData.totalLogs || 0;

      // Notificar si hay nuevas actividades sospechosas
      if (currentSuspicious > previousSuspiciousCount.current) {
        showNotification(
          '🚨 Actividad Sospechosa Detectada',
          `Se han detectado ${currentSuspicious - previousSuspiciousCount.current} nuevas actividades sospechosas.`,
          'warning'
        );
      }

      // Notificar si hay un aumento significativo en los logs (posible ataque)
      if (currentLogs > previousTotalLogs.current + 50) {
        showNotification(
          '⚠️ Aumento de Actividad',
          `Se detectó un aumento significativo en la actividad del sistema.`,
          'warning'
        );
      }

      // Actualizar referencias
      previousSuspiciousCount.current = currentSuspicious;
      previousTotalLogs.current = currentLogs;
    }
  }, [securityData, notificationsEnabled]);

  const fetchSecurityData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado. Redirigiendo al login...');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/security-logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSecurityData(data);
        setError(''); // Limpiar error si la petición fue exitosa
      } else if (response.status === 401) {
        setError('Token expirado o inválido. Redirigiendo al login...');
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      } else if (response.status === 403) {
        setError('No tienes permisos para acceder a esta información.');
      } else {
        setError(`Error del servidor: ${response.status}`);
      }
    } catch (err) {
      setError('Error de conexión. Verifica que el servidor backend esté funcionando.');
      console.error('Error fetching security data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (title, body, type = 'info') => {
    if (notificationsEnabled && notificationPermission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'security-alert',
        requireInteraction: type === 'warning'
      });

      // Auto-cerrar notificaciones de info después de 5 segundos
      if (type === 'info') {
        setTimeout(() => notification.close(), 5000);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        showNotification('✅ Notificaciones Activadas', 'Recibirás alertas de seguridad en tiempo real.');
      }
    }
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled) {
      if (notificationPermission === 'default') {
        requestNotificationPermission();
      } else if (notificationPermission === 'granted') {
        setNotificationsEnabled(true);
        showNotification('✅ Notificaciones Activadas', 'Recibirás alertas de seguridad en tiempo real.');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const exportToCSV = () => {
    if (!securityData) return;

    const csvData = [];

    // Headers
    csvData.push(['Tipo', 'Métrica', 'Valor', 'Timestamp'].join(','));

    // Estadísticas principales
    csvData.push(['Estadística', 'Total de Logs', securityData.totalLogs || 0, new Date().toISOString()].join(','));
    csvData.push(['Estadística', 'Actividades Sospechosas', securityData.suspiciousActivities?.length || 0, new Date().toISOString()].join(','));
    csvData.push(['Estadística', 'Requests (24h)', securityData.stats?.totalRequests24h || 0, new Date().toISOString()].join(','));
    csvData.push(['Estadística', 'IPs Únicas (24h)', securityData.stats?.uniqueIPs24h || 0, new Date().toISOString()].join(','));

    // Tipos de requests
    if (securityData.stats?.requestTypes) {
      Object.entries(securityData.stats.requestTypes).forEach(([method, count]) => {
        csvData.push(['Request Type', method, count, new Date().toISOString()].join(','));
      });
    }

    // IPs más activas
    if (securityData.stats?.topIPs) {
      securityData.stats.topIPs.forEach((ip, index) => {
        csvData.push(['Top IP', `IP #${index + 1}`, `${ip.ip} (${ip.count} requests)`, new Date().toISOString()].join(','));
      });
    }

    // Endpoints más accedidos
    if (securityData.stats?.topEndpoints) {
      securityData.stats.topEndpoints.forEach((endpoint, index) => {
        csvData.push(['Top Endpoint', `Endpoint #${index + 1}`, `${endpoint.endpoint} (${endpoint.count} requests)`, new Date().toISOString()].join(','));
      });
    }

    // Actividades sospechosas
    if (securityData.suspiciousActivities) {
      securityData.suspiciousActivities.forEach((activity, index) => {
        csvData.push(['Actividad Sospechosa', activity.type, `IP: ${activity.ip}, Count: ${activity.count}`, activity.lastAttempt].join(','));
      });
    }

    // Logs recientes
    if (securityData.recentLogs) {
      securityData.recentLogs.forEach((log) => {
        csvData.push(['Log', `${log.method} ${log.url}`, `IP: ${log.ip}, User: ${log.userId}`, log.timestamp].join(','));
      });
    }

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `security-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToJSON = () => {
    if (!securityData) return;

    const jsonData = {
      exportDate: new Date().toISOString(),
      report: securityData
    };

    const jsonContent = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `security-report-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getRiskColor = (type) => {
    const severity = securityData?.suspiciousActivities?.find(activity => activity.type === type)?.severity;
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100 border-red-300';
      case 'medium':
        return 'text-orange-600 bg-orange-100 border-orange-300';
      default:
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    }
  };

  const getRiskIcon = (type) => {
    switch (type) {
      case 'high_failed_auth_attempts':
        return <FaExclamationTriangle className="text-red-600" />;
      case 'high_request_frequency':
        return <FaBolt className="text-orange-600" />;
      case 'endpoint_scanning':
        return <FaNetworkWired className="text-yellow-600" />;
      default:
        return <FaShieldAlt className="text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <LuxuryBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Cargando panel de seguridad...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <LuxuryBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <LuxuryBackground />
      <div className="relative z-10 px-8 pt-0 pb-4">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-white mb-1 flex items-center">
            <FaShieldAlt className="mr-4 text-blue-400" />
            Panel de Monitoreo de Seguridad
          </h1>
          <p className="text-gray-300">
            Monitoreo en tiempo real • Última actualización: {securityData?.lastUpdated ? formatTimestamp(securityData.lastUpdated) : 'Nunca'}
          </p>
        </div>

        {/* Controles de notificaciones y exportación */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <button
            onClick={toggleNotifications}
            className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              notificationsEnabled
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {notificationsEnabled ? <FaBell className="mr-2" /> : <FaBellSlash className="mr-2" />}
            {notificationsEnabled ? 'Notificaciones ON' : 'Notificaciones OFF'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
            >
              <FaDownload className="mr-2" />
              Exportar CSV
            </button>

            <button
              onClick={exportToJSON}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-200"
            >
              <FaDownload className="mr-2" />
              Exportar JSON
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <FaClock className="text-blue-400" />
            <span>Actualización automática:</span>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
            >
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1min</option>
              <option value={300000}>5min</option>
            </select>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total de Logs</p>
                <p className="text-3xl font-bold text-white">{securityData?.totalLogs || 0}</p>
              </div>
              <FaEye className="text-blue-400 text-3xl" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Actividades Sospechosas</p>
                <p className="text-3xl font-bold text-white">{securityData?.suspiciousActivities?.length || 0}</p>
              </div>
              <FaExclamationTriangle className="text-red-400 text-3xl" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Requests (24h)</p>
                <p className="text-3xl font-bold text-white">{securityData?.stats?.totalRequests24h || 0}</p>
              </div>
              <FaServer className="text-green-400 text-3xl" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">IPs Únicas (24h)</p>
                <p className="text-3xl font-bold text-white">{securityData?.stats?.uniqueIPs24h || 0}</p>
              </div>
              <FaGlobe className="text-purple-400 text-3xl" />
            </div>
          </div>
        </div>

        {/* Gráfico de actividad por hora */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <FaChartBar className="mr-2 text-blue-400" />
            Actividad por Hora (Últimas 24 horas)
          </h2>
          <div className="grid grid-cols-12 gap-2">
            {securityData?.stats?.hourlyActivity && Object.entries(securityData.stats.hourlyActivity).map(([hour, count]) => (
              <div key={hour} className="text-center">
                <div className="bg-blue-600 rounded-t h-16 flex items-end justify-center relative">
                  <div
                    className="bg-blue-400 w-full rounded-t transition-all duration-300"
                    style={{ height: `${Math.min((count / Math.max(...Object.values(securityData.stats.hourlyActivity))) * 100, 100)}%` }}
                  ></div>
                  <span className="absolute -bottom-6 text-xs text-gray-300">{hour}</span>
                </div>
                <span className="text-xs text-gray-400 mt-2 block">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* IPs más activas */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaGlobe className="mr-2 text-green-400" />
              IPs Más Activas (24h)
            </h2>
            <div className="space-y-3">
              {securityData?.stats?.topIPs?.slice(0, 5).map((ipData, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="text-white font-mono text-sm">{ipData.ip}</span>
                  <span className="text-blue-400 font-semibold">{ipData.count} req</span>
                </div>
              ))}
            </div>
          </div>

          {/* Endpoints más accedidos */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaServer className="mr-2 text-purple-400" />
              Endpoints Más Accedidos
            </h2>
            <div className="space-y-3">
              {securityData?.stats?.topEndpoints?.slice(0, 5).map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="text-white font-mono text-sm truncate" title={endpoint.endpoint}>
                    {endpoint.endpoint}
                  </span>
                  <span className="text-green-400 font-semibold">{endpoint.count} req</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tipos de requests */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaChartBar className="mr-2 text-orange-400" />
              Tipos de Requests (24h)
            </h2>
            <div className="space-y-3">
              {securityData?.stats?.requestTypes && Object.entries(securityData.stats.requestTypes).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className={`font-semibold px-2 py-1 rounded text-xs ${
                    method === 'GET' ? 'bg-green-600' :
                    method === 'POST' ? 'bg-blue-600' :
                    method === 'PUT' ? 'bg-yellow-600' : 'bg-red-600'
                  }`}>
                    {method}
                  </span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Actividades Sospechosas */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <FaExclamationTriangle className="mr-2 text-red-400" />
              Actividades Sospechosas
            </h2>

            {securityData?.suspiciousActivities?.length > 0 ? (
              <div className="space-y-3">
                {securityData.suspiciousActivities.map((activity, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${getRiskColor(activity.type)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getRiskIcon(activity.type)}
                        <div className="ml-3">
                          <p className="font-semibold capitalize">
                            {activity.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm">IP: {activity.ip}</p>
                          <p className="text-sm">Cantidad: {activity.count}</p>
                          {activity.timeWindow && (
                            <p className="text-sm">Ventana: {activity.timeWindow}</p>
                          )}
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${
                            activity.severity === 'high' ? 'bg-red-600 text-white' :
                            activity.severity === 'medium' ? 'bg-orange-600 text-white' :
                            'bg-yellow-600 text-white'
                          }`}>
                            {activity.severity?.toUpperCase() || 'LOW'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {formatTimestamp(activity.lastAttempt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No se detectaron actividades sospechosas</p>
            )}
          </div>

          {/* Logs Recientes */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <FaEye className="mr-2 text-blue-400" />
              Actividad Reciente
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {securityData?.recentLogs?.slice().reverse().map((log, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaUserShield className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-white font-medium">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mr-2 ${
                            log.method === 'GET' ? 'bg-green-600' :
                            log.method === 'POST' ? 'bg-blue-600' :
                            log.method === 'PUT' ? 'bg-yellow-600' : 'bg-red-600'
                          }`}>
                            {log.method}
                          </span>
                          {log.url}
                        </p>
                        <p className="text-gray-400 text-sm">
                          IP: {log.ip} | User: {log.userId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">
                        {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={fetchSecurityData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Actualizar Datos
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-gray-300">Auto-refresh:</span>
            <button
              onClick={() => setRefreshInterval(refreshInterval === 30000 ? 10000 : refreshInterval === 10000 ? 60000 : 30000)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold transition-colors duration-200"
            >
              {refreshInterval === 30000 ? '30s' : refreshInterval === 10000 ? '10s' : '60s'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}