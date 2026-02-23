import React from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaUser, FaPhone, FaTruck } from 'react-icons/fa';
import { useCart } from './CartContext';

export default function Navbar() {
  const { getItemCount } = useCart();
  return (
    <nav className="relative bg-gradient-to-b from-black via-gray-900 to-black text-white shadow-2xl fixed top-0 left-0 right-0 z-50 border-b-2 border-rose-500/40">
      {/* Efecto de resplandor oro rosado superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-400/60 to-transparent blur-sm"></div>
      
      {/* Efecto de brillo animado en el fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/5 to-transparent animate-pulse"></div>
      
      {/* Línea oro rosado brillante inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-400/50 to-transparent shadow-lg shadow-rose-500/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-20">
          {/* Logo Luxury */}
          <div className="flex items-center">
            <Link href="/" className="relative group">
              <span className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 hover:from-rose-200 hover:via-rose-300 hover:to-rose-200 transition-all duration-500 tracking-wider drop-shadow-lg">
                Lush Secret
              </span>
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              {/* Línea oro rosado debajo del logo */}
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          
          {/* Navegación Luxury */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Botones de categorías con efecto dorado brillante */}
            <Link href="/" className="relative group overflow-hidden bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-400 hover:to-rose-500 text-white px-5 py-2.5 rounded-full font-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-600/30 hover:shadow-rose-400/50 hover:shadow-xl">
              <span className="relative z-10">Inicio</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            
            <Link href="/categoria/linea-intima" className="relative group overflow-hidden bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-400 hover:to-rose-500 text-white px-5 py-2.5 rounded-full font-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-600/30 hover:shadow-rose-400/50 hover:shadow-xl">
              <span className="relative z-10">Línea Íntima</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            
            <Link href="/categoria/smart-pleasure" className="relative group overflow-hidden bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-400 hover:to-rose-500 text-white px-5 py-2.5 rounded-full font-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-600/30 hover:shadow-rose-400/50 hover:shadow-xl">
              <span className="relative z-10">Smart Pleasure</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            
            <Link href="/categoria/lub-care" className="relative group overflow-hidden bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-400 hover:to-rose-500 text-white px-5 py-2.5 rounded-full font-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-600/30 hover:shadow-rose-400/50 hover:shadow-xl">
              <span className="relative z-10">Lub & Care</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            
            <Link href="/categoria/power-up" className="relative group overflow-hidden bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-400 hover:to-rose-500 text-white px-5 py-2.5 rounded-full font-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-600/30 hover:shadow-rose-400/50 hover:shadow-xl">
              <span className="relative z-10">Power Up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            
            <Link href="/categoria/zona-fetish" className="relative group overflow-hidden bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:via-rose-400 hover:to-rose-500 text-white px-5 py-2.5 rounded-full font-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-600/30 hover:shadow-rose-400/50 hover:shadow-xl">
              <span className="relative z-10">Zona Fetish</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            
            {/* Iconos con efectos dorados brillantes */}
            <Link href="/tracking" className="relative group p-3 rounded-full hover:bg-rose-500/10 transition-all duration-300 transform hover:scale-110">
              <FaTruck className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors duration-300 drop-shadow-lg group-hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
              <div className="absolute inset-0 rounded-full bg-rose-400/0 group-hover:bg-rose-400/20 blur-md transition-all duration-300"></div>
            </Link>
            
            <Link href="/carrito" className="relative group p-3 rounded-full hover:bg-rose-500/10 transition-all duration-300 transform hover:scale-110">
              <FaShoppingCart className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors duration-300 drop-shadow-lg group-hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold shadow-lg shadow-rose-500/60 animate-pulse border-2 border-rose-300">
                  {getItemCount()}
                </span>
              )}
              <div className="absolute inset-0 rounded-full bg-rose-400/0 group-hover:bg-rose-400/20 blur-md transition-all duration-300"></div>
            </Link>
            
            <Link href="/login" className="relative group p-3 rounded-full hover:bg-rose-500/10 transition-all duration-300 transform hover:scale-110">
              <FaUser className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors duration-300 drop-shadow-lg group-hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
              <div className="absolute inset-0 rounded-full bg-rose-400/0 group-hover:bg-rose-400/20 blur-md transition-all duration-300"></div>
            </Link>
            
            <Link href="/contacto" className="relative group p-3 rounded-full hover:bg-rose-500/10 transition-all duration-300 transform hover:scale-110">
              <FaPhone className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors duration-300 drop-shadow-lg group-hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
              <div className="absolute inset-0 rounded-full bg-rose-400/0 group-hover:bg-rose-400/20 blur-md transition-all duration-300"></div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
