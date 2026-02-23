import React from 'react';
import LuxuryBackground from '../components/LuxuryBackground';
import { usePageTracking } from '../hooks/useAnalytics';

export default function Contacto() {
  // Tracking de página de contacto
  usePageTracking('Contacto');

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-rose-400 mb-12 tracking-wide">Contacto</h2>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 border border-rose-500/20 shadow-lg shadow-rose-500/20">
            <p className="text-gray-300 mb-6 font-light text-lg">¿Tienes dudas? Escríbenos a <a href="mailto:info@lushsecret.co" className="text-rose-400 hover:text-rose-300 transition-colors">info@lushsecret.co</a> o por WhatsApp al <a href="https://wa.me/573005951133" target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-300 transition-colors">3005951133</a>.</p>
            <p className="text-gray-300 font-light text-lg">Dirección: Barranquilla - Colombia</p>
          </div>
        </div>
      </main>
    </LuxuryBackground>
  );
}

