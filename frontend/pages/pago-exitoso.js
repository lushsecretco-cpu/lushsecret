import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import LuxuryBackground from '../components/LuxuryBackground';

export default function PagoExitoso() {
  const router = useRouter();
  const { order_id } = router.query;

  useEffect(() => {
    // Limpiar carrito después de un pago exitoso
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
      localStorage.removeItem('orderData');
    }
  }, []);

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-black/50 backdrop-blur-xl rounded-xl p-12 border border-green-500/20 shadow-lg shadow-green-500/10">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-green-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-green-400 mb-4 tracking-wide">
                ¡Pago Exitoso!
              </h2>
              <p className="text-xl font-light text-gray-300 mb-6">
                Tu pedido ha sido procesado correctamente
              </p>
            </div>

            {order_id && (
              <div className="bg-black/30 rounded-lg p-6 mb-8 border border-green-500/10">
                <p className="text-lg font-light text-gray-300">
                  Número de orden: <span className="text-green-400 font-medium">#{order_id}</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-400 font-light leading-relaxed">
                Recibirás un SMS con la confirmación de tu pedido y los detalles de envío.
                Nuestro equipo se pondrá en contacto contigo pronto para coordinar la entrega.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={() => router.push('/historial')}
                  className="bg-gradient-to-r from-green-600/80 to-green-400/80 hover:from-green-500 hover:to-green-300 text-black font-light py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30"
                >
                  Ver mi pedido
                </button>
                <button
                  onClick={() => router.push('/productos')}
                  className="bg-black/30 border border-green-500/30 hover:border-green-400 text-gray-300 hover:text-white font-light py-3 px-8 rounded-lg transition-all duration-300"
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LuxuryBackground>
  );
}