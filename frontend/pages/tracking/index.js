import React, { useState } from 'react';
import { useRouter } from 'next/router';
import LuxuryBackground from '../../components/LuxuryBackground';
import { FaSearch, FaBox, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';
import { usePageTracking } from '../../hooks/useAnalytics';

export default function TrackingIndex() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  // Tracking de página
  usePageTracking('Rastrear Pedido');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!orderId.trim()) {
      setError('Por favor ingresa el número de orden');
      return;
    }

    setSearching(true);

    try {
      // Verificar si la orden existe
      const response = await fetch(`http://localhost:4000/api/tracking/${orderId.trim()}`);
      
      if (!response.ok) {
        throw new Error('Orden no encontrada. Verifica el número de orden.');
      }

      // Si existe, redirigir a la página de tracking
      router.push(`/tracking/${orderId.trim()}`);
    } catch (err) {
      setError(err.message);
      setSearching(false);
    }
  };

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-6 tracking-wider drop-shadow-[0_0_30px_rgba(251,113,133,0.6)] hover:scale-105 transition-all duration-500">
              Rastrear Mi Pedido
            </h1>
            <p className="text-xl text-gray-300 font-light tracking-wide">
              Ingresa tu número de orden para ver el estado de tu envío
            </p>
          </div>

          {/* Formulario de búsqueda */}
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-rose-600/20 shadow-2xl shadow-rose-500/10 mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="orderId" className="block text-sm font-light text-gray-300 mb-2 tracking-wide">
                  Número de Orden *
                </label>
                <div className="relative">
                  <FaBox className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-400" />
                  <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Ej: 1234"
                    className="w-full bg-black/40 border border-rose-600/30 rounded-lg px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all duration-300 font-light"
                    disabled={searching}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-400 font-light">
                  Puedes encontrar tu número de orden en el correo de confirmación
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-light text-gray-300 mb-2 tracking-wide">
                  Correo Electrónico (Opcional)
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-black/40 border border-rose-600/30 rounded-lg px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all duration-300 font-light"
                    disabled={searching}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm font-light">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={searching}
                className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-400/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {searching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <FaSearch />
                    <span>Rastrear Pedido</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20 text-center group hover:border-rose-400/40 transition-all duration-300">
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-rose-500/10 to-rose-600/10 mb-4 group-hover:from-rose-500/20 group-hover:to-rose-600/20 transition-all duration-300">
                <FaBox className="text-4xl text-rose-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 mb-2">
                Seguimiento en Tiempo Real
              </h3>
              <p className="text-sm text-gray-400 font-light">
                Rastrea tu pedido desde la preparación hasta la entrega
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20 text-center group hover:border-rose-400/40 transition-all duration-300">
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-rose-500/10 to-rose-600/10 mb-4 group-hover:from-rose-500/20 group-hover:to-rose-600/20 transition-all duration-300">
                <FaTruck className="text-4xl text-rose-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 mb-2">
                Actualizaciones Automáticas
              </h3>
              <p className="text-sm text-gray-400 font-light">
                Recibe notificaciones cada vez que tu pedido cambie de estado
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20 text-center group hover:border-rose-400/40 transition-all duration-300">
              <div className="inline-block p-4 rounded-full bg-gradient-to-br from-rose-500/10 to-rose-600/10 mb-4 group-hover:from-rose-500/20 group-hover:to-rose-600/20 transition-all duration-300">
                <FaMapMarkerAlt className="text-4xl text-rose-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 mb-2">
                Ubicación Precisa
              </h3>
              <p className="text-sm text-gray-400 font-light">
                Conoce exactamente dónde se encuentra tu pedido
              </p>
            </div>
          </div>

          {/* Ayuda */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 font-light mb-4">
              ¿No encuentras tu número de orden?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/historial"
                className="inline-block bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-rose-600/20 hover:to-rose-400/20 border border-rose-500/30 hover:border-rose-400 text-rose-400 hover:text-rose-300 px-6 py-3 rounded-lg font-light transition-all duration-300"
              >
                Ver Mis Pedidos
              </a>
              <a
                href="/soporte"
                className="inline-block bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-rose-600/20 hover:to-rose-400/20 border border-rose-500/30 hover:border-rose-400 text-rose-400 hover:text-rose-300 px-6 py-3 rounded-lg font-light transition-all duration-300"
              >
                Contactar Soporte
              </a>
            </div>
          </div>
        </div>
      </main>
    </LuxuryBackground>
  );
}
