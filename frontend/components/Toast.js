import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-24 right-4 z-[100] animate-slide-in-right">
      <div className="bg-gradient-to-r from-yellow-600/95 to-yellow-400/95 backdrop-blur-md text-black px-6 py-4 rounded-lg shadow-2xl shadow-yellow-500/50 border border-yellow-300/50 min-w-[320px] max-w-md">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <FaCheckCircle className="text-2xl text-green-900 drop-shadow-lg animate-scale-in" />
          </div>
          <div className="flex-1">
            <p className="font-light text-base leading-relaxed">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="flex-shrink-0 hover:bg-black/10 rounded-full p-1 transition-all duration-200 -mt-1 -mr-2"
          >
            <FaTimes className="text-lg text-black/70 hover:text-black" />
          </button>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-3 h-1 bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black/40 rounded-full animate-progress"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  );
}
