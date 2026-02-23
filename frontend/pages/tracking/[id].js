import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LuxuryBackground from '../../components/LuxuryBackground';

const SHIPPING_STATUSES = {
  pending: { name: 'Pedido Recibido', icon: '📦', color: 'yellow' },
  processing: { name: 'En Preparación', icon: '⚙️', color: 'blue' },
  packed: { name: 'Empacado', icon: '📦', color: 'indigo' },
  shipped: { name: 'En Camino', icon: '🚚', color: 'purple' },
  out_for_delivery: { name: 'En Reparto', icon: '🏃', color: 'orange' },
  delivered: { name: 'Entregado', icon: '✅', color: 'green' },
  failed: { name: 'Intento Fallido', icon: '⚠️', color: 'red' },
  returned: { name: 'Devuelto', icon: '↩️', color: 'gray' }
};

export default function TrackingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTrackingData();
    }
  }, [id]);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/tracking/${id}`);
      
      if (!response.ok) {
        throw new Error('Orden no encontrada');
      }

      const data = await response.json();
      setTrackingData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tracking data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    return SHIPPING_STATUSES[status] || { 
      name: status, 
      icon: '📦', 
      color: 'gray' 
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <LuxuryBackground>
        <main className="min-h-screen text-white py-24 relative z-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-yellow-500/20 rounded w-1/3 mx-auto mb-8"></div>
              <div className="h-64 bg-black/30 rounded-xl"></div>
            </div>
          </div>
        </main>
      </LuxuryBackground>
    );
  }

  if (error) {
    return (
      <LuxuryBackground>
        <main className="min-h-screen text-white py-24 relative z-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-8 tracking-wide">
              Error
            </h1>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8">
              <p className="text-red-300 font-light text-lg">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="mt-8 bg-gradient-to-r from-yellow-600/80 to-yellow-400/80 hover:from-yellow-500 hover:to-yellow-300 text-black font-light py-3 px-8 rounded-lg transition-all duration-300"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </main>
      </LuxuryBackground>
    );
  }

  const { order, tracking_history, items } = trackingData;
  const customerInfo = order.customer_info || {};
  const currentStatus = getStatusInfo(order.shipping_status || 'pending');

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-4 tracking-wide">
              Seguimiento de Pedido
            </h1>
            <p className="text-gray-400 font-light">Pedido #{order.id}</p>
          </div>

          {/* Estado Actual */}
          <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/10 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">{currentStatus.icon}</div>
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-2">
                {currentStatus.name}
              </h2>
              {order.tracking_number && (
                <p className="text-gray-400 font-light mt-4">
                  Número de Guía: <span className="text-yellow-400">{order.tracking_number}</span>
                </p>
              )}
              {order.shipping_carrier && (
                <p className="text-gray-400 font-light">
                  Transportadora: <span className="text-white">{order.shipping_carrier}</span>
                </p>
              )}
              {order.estimated_delivery && (
                <p className="text-gray-400 font-light mt-2">
                  Entrega estimada: <span className="text-yellow-400">
                    {new Date(order.estimated_delivery).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Historial de Tracking */}
            <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
              <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-6 tracking-wide">
                Historial de Envío
              </h3>

              <div className="space-y-4">
                {tracking_history && tracking_history.length > 0 ? (
                  tracking_history.map((event, index) => {
                    const statusInfo = getStatusInfo(event.status);
                    return (
                      <div
                        key={event.id}
                        className={`relative pl-8 pb-6 ${
                          index === tracking_history.length - 1 ? '' : 'border-l-2 border-yellow-500/30'
                        }`}
                      >
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-400 border-2 border-black"></div>
                        
                        <div className="bg-black/30 rounded-lg p-4 border border-yellow-500/10">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{statusInfo.icon}</span>
                            <div className="flex-1">
                              <p className="text-yellow-400 font-light text-lg">{statusInfo.name}</p>
                              {event.description && (
                                <p className="text-gray-300 font-light mt-1">{event.description}</p>
                              )}
                              {event.location && (
                                <p className="text-gray-400 font-light text-sm mt-1">
                                  📍 {event.location}
                                </p>
                              )}
                              <p className="text-gray-500 font-light text-sm mt-2">
                                {formatDate(event.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 font-light text-center py-8">
                    No hay actualizaciones de seguimiento aún
                  </p>
                )}
              </div>
            </div>

            {/* Información del Pedido */}
            <div className="space-y-8">
              {/* Datos de Envío */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
                <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-6 tracking-wide">
                  Datos de Envío
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-light">Nombre:</span>
                    <span className="text-white font-light">{customerInfo.nombre} {customerInfo.apellidos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-light">Teléfono:</span>
                    <span className="text-white font-light">{customerInfo.telefono}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-light">Correo:</span>
                    <span className="text-white font-light">{customerInfo.correo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-light">Dirección:</span>
                    <span className="text-white font-light text-right">{customerInfo.direccion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-light">Ciudad:</span>
                    <span className="text-white font-light">{customerInfo.ciudad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-light">Recibe:</span>
                    <span className="text-white font-light">{customerInfo.nombreRecibe}</span>
                  </div>
                  {customerInfo.observaciones && (
                    <div className="pt-3 border-t border-yellow-500/10">
                      <span className="text-gray-400 font-light">Observaciones:</span>
                      <p className="text-white font-light mt-1">{customerInfo.observaciones}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Productos */}
              <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
                <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-6 tracking-wide">
                  Productos
                </h3>
                <div className="space-y-4">
                  {items && items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center pb-4 border-b border-yellow-500/10 last:border-0">
                      <div>
                        <p className="text-white font-light">{item.product_name}</p>
                        <p className="text-gray-400 font-light text-sm">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="text-yellow-400 font-light">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </p>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-yellow-500/30 flex justify-between">
                    <span className="text-xl font-light text-gray-300">Total:</span>
                    <span className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                      ${order.total.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Actualizar */}
          <div className="mt-8 text-center">
            <button
              onClick={fetchTrackingData}
              className="bg-gradient-to-r from-yellow-600/80 to-yellow-400/80 hover:from-yellow-500 hover:to-yellow-300 text-black font-light py-3 px-12 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Actualizar Estado
            </button>
          </div>
        </div>
      </main>
    </LuxuryBackground>
  );
}
