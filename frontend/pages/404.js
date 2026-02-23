import React from 'react';
import Link from 'next/link';
import LuxuryBackground from '../components/LuxuryBackground';

export default function NotFound() {
  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-6 tracking-wide">404</h2>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/20">
            <h3 className="text-2xl font-light text-white mb-4">Página no encontrada</h3>
            <p className="text-gray-300 font-light text-lg mb-6">La página que buscas no existe.</p>
            <Link href="/" className="inline-block bg-gradient-to-r from-yellow-600/80 to-yellow-400/80 hover:from-yellow-500 hover:to-yellow-300 text-black font-light py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </main>
    </LuxuryBackground>
  );
}
