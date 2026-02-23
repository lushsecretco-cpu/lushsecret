import { API_URL } from '../../config/api';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LuxuryBackground from '../components/LuxuryBackground';
import { usePageTracking } from '../hooks/useAnalytics';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Tracking de página de productos
  usePageTracking('Todos los Productos');

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-extralight text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-12 tracking-wider drop-shadow-[0_0_30px_rgba(251,113,133,0.6)] hover:scale-105 transition-all duration-500 cursor-default">Catálogo de Productos</h2>
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto"></div>
              <p className="mt-4 text-gray-300 font-light">Cargando...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productos.map(prod => (
                <div 
                  key={prod.id} 
                  onClick={() => router.push(`/producto/${prod.id}`)}
                  className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/20 hover:scale-105 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-white group-hover:from-rose-200 group-hover:via-rose-400 group-hover:to-rose-200 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{prod.name}</h3>
                    <p className="text-gray-300 mb-6 font-light leading-relaxed">{prod.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.6)] animate-pulse">${prod.price}</span>
                      <button className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-400/50 transition-all duration-300 transform hover:-translate-y-0.5">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </LuxuryBackground>
  );
}

