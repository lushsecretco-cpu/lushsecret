import React from 'react';
import { useRouter } from 'next/router';
import LuxuryBackground from '../components/LuxuryBackground';

export default function PagoPendiente() {
  const router = useRouter();
  const { order_id } = router.query;

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-black/50 backdrop-blur-xl rounded-xl p-12 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-yellow-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-4 tracking-wide">
                Pago Pendiente
              </h2>
              <p className="text-xl font-light text-gray-300 mb-6">
                Tu pago está siendo procesado
              </p>
            </div>

            {order_id && (
              <div className="bg-black/30 rounded-lg p-6 mb-8 border border-yellow-500/10">
                <p className="text-lg font-light text-gray-300">
                  Número de orden: <span className="text-yellow-400 font-medium">#{order_id}</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-400 font-light leading-relaxed mb-6">
                Tu pago está en proceso de verificación. Recibirás una confirmación por SMS
                una vez que sea aprobado. Este proceso puede tomar unos minutos.
              </p>

              <div className="bg-black/30 rounded-lg p-6 border border-yellow-500/10 mb-8">
                <h3 className="text-lg font-light text-yellow-400 mb-4">¿Qué sucede ahora?</h3>
                <ul className="text-left text-gray-300 font-light space-y-2">
                  <li>• Estamos verificando tu pago con el banco</li>
                  <li>• Te notificaremos por SMS cuando se complete</li>
                  <li>• Si hay algún problema, te contactaremos</li>
                  <li>• Tu pedido está reservado mientras tanto</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/historial')}
                  className="bg-gradient-to-r from-yellow-600/80 to-yellow-400/80 hover:from-yellow-500 hover:to-yellow-300 text-black font-light py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                >
                  Ver mi pedido
                </button>
                <button
                  onClick={() => router.push('/productos')}
                  className="bg-black/30 border border-yellow-500/30 hover:border-yellow-400 text-gray-300 hover:text-white font-light py-3 px-8 rounded-lg transition-all duration-300"
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