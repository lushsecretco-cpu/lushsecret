import React from 'react';
import LuxuryBackground from '../components/LuxuryBackground';

export default function Politica() {
  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-12 tracking-wide">Política de Privacidad y Términos</h2>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/20">
            <p className="text-gray-300 font-light text-lg">Tu privacidad es nuestra prioridad. Consulta aquí nuestras políticas y términos de uso.</p>
          </div>
        </div>
      </main>
    </LuxuryBackground>
  );
}
