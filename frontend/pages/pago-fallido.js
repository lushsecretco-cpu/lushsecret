import React from 'react';
import { useRouter } from 'next/router';
import LuxuryBackground from '../components/LuxuryBackground';

export default function PagoFallido() {
  const router = useRouter();
  const { order_id } = router.query;

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-black/50 backdrop-blur-xl rounded-xl p-12 border border-red-500/20 shadow-lg shadow-red-500/10">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-red-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-red-400 mb-4 tracking-wide">
                Pago No Completado
              </h2>
              <p className="text-xl font-light text-gray-300 mb-6">
                El pago no pudo ser procesado
              </p>
            </div>

            {order_id && (
              <div className="bg-black/30 rounded-lg p-6 mb-8 border border-red-500/10">
                <p className="text-lg font-light text-gray-300">
                  Número de orden: <span className="text-red-400 font-medium">#{order_id}</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-400 font-light leading-relaxed mb-6">
                No se preocupe, su pedido ha sido guardado y puede intentar el pago nuevamente.
                Si el problema persiste, contacte a nuestro soporte.
              </p>

              <div className="bg-black/30 rounded-lg p-6 border border-yellow-500/10 mb-8">
                <h3 className="text-lg font-light text-yellow-400 mb-4">¿Qué puede hacer?</h3>
                <ul className="text-left text-gray-300 font-light space-y-2">
                  <li>• Verificar que los datos de su tarjeta sean correctos</li>
                  <li>• Asegurarse de tener saldo suficiente</li>
                  <li>• Intentar con otra tarjeta o método de pago</li>
                  <li>• Contactar a su banco si el problema persiste</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/metodo-pago')}
                  className="bg-gradient-to-r from-yellow-600/80 to-yellow-400/80 hover:from-yellow-500 hover:to-yellow-300 text-black font-light py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                >
                  Intentar de nuevo
                </button>
                <button
                  onClick={() => router.push('/soporte')}
                  className="bg-black/30 border border-red-500/30 hover:border-red-400 text-gray-300 hover:text-white font-light py-3 px-8 rounded-lg transition-all duration-300"
                >
                  Contactar soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LuxuryBackground>
  );
}