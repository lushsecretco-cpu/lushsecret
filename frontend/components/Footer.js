import React from 'react';
import Link from 'next/link';
import { FaLock, FaTruck, FaHeadset, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-black via-gray-900/50 to-black text-white py-16 border-t-2 border-rose-600/30 overflow-hidden">
      {/* Efecto de brillo oro rosado superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-400/70 to-transparent blur-sm shadow-lg shadow-rose-500/30"></div>
      
      {/* Efecto de resplandor animado de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/5 to-transparent animate-pulse pointer-events-none"></div>
      
      {/* Líneas decorativas laterales */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-rose-400/20 to-transparent"></div>
      <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-rose-400/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Columna 1: Marca y Redes Sociales */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-extralight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 tracking-wider drop-shadow-[0_0_20px_rgba(251,113,133,0.5)] hover:scale-105 transition-all duration-500 cursor-default">
              Lush Secret
            </h3>
            <div className="h-px w-20 bg-gradient-to-r from-rose-400/0 via-rose-400/60 to-rose-400/0 mx-auto md:mx-0 mb-6"></div>
            <p className="text-gray-300 font-light mb-8 leading-relaxed text-sm">
              Tienda exclusiva de lencería y productos íntimos. <span className="text-rose-300">Envíos discretos</span> a toda Colombia.
            </p>
            <div className="flex space-x-5 justify-center md:justify-start">
              <a href="https://facebook.com/lushsecret" target="_blank" rel="noopener noreferrer" className="relative group">
                <div className="p-3 rounded-full bg-gradient-to-br from-rose-600/20 to-rose-500/10 group-hover:from-rose-500/30 group-hover:to-rose-600/20 transition-all duration-300 border border-rose-500/20 group-hover:border-rose-400/40">
                  <FaFacebook className="w-5 h-5 text-rose-400 group-hover:text-rose-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-rose-400/0 group-hover:bg-rose-400/10 blur-xl transition-all duration-300"></div>
              </a>
              <a href="https://instagram.com/lushsecret" target="_blank" rel="noopener noreferrer" className="relative group">
                <div className="p-3 rounded-full bg-gradient-to-br from-rose-600/20 to-rose-500/10 group-hover:from-rose-500/30 group-hover:to-rose-600/20 transition-all duration-300 border border-rose-500/20 group-hover:border-rose-400/40">
                  <FaInstagram className="w-5 h-5 text-rose-400 group-hover:text-rose-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-rose-400/0 group-hover:bg-rose-400/10 blur-xl transition-all duration-300"></div>
              </a>
              <a href="https://twitter.com/lushsecret" target="_blank" rel="noopener noreferrer" className="relative group">
                <div className="p-3 rounded-full bg-gradient-to-br from-rose-600/20 to-rose-500/10 group-hover:from-rose-500/30 group-hover:to-rose-600/20 transition-all duration-300 border border-rose-500/20 group-hover:border-rose-400/40">
                  <FaTwitter className="w-5 h-5 text-rose-400 group-hover:text-rose-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-rose-400/0 group-hover:bg-rose-400/10 blur-xl transition-all duration-300"></div>
              </a>
              <a href="https://wa.me/573005951133" target="_blank" rel="noopener noreferrer" className="relative group">
                <div className="p-3 rounded-full bg-gradient-to-br from-rose-600/20 to-rose-500/10 group-hover:from-rose-500/30 group-hover:to-rose-600/20 transition-all duration-300 border border-rose-500/20 group-hover:border-rose-400/40">
                  <FaWhatsapp className="w-5 h-5 text-rose-400 group-hover:text-rose-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-rose-400/0 group-hover:bg-rose-400/10 blur-xl transition-all duration-300"></div>
              </a>
            </div>
          </div>
          
          {/* Columna 2: Datos de la Empresa */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-light mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 tracking-wide drop-shadow-[0_0_15px_rgba(251,113,133,0.4)]">
              Datos de la Empresa
            </h3>
            <div className="h-px w-16 bg-gradient-to-r from-rose-400/0 via-rose-400/50 to-rose-400/0 mx-auto md:mx-0 mb-5"></div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300 font-light hover:text-rose-300 transition-colors duration-300">
                <span className="text-rose-400/70">•</span> Lush Secret S.A.S.
              </p>
              <p className="text-gray-300 font-light hover:text-rose-300 transition-colors duration-300">
                <span className="text-rose-400/70">•</span> NIT: 123456789-0
              </p>
              <p className="text-gray-300 font-light hover:text-rose-300 transition-colors duration-300">
                <span className="text-rose-400/70">•</span> Barranquilla, Colombia
              </p>
              <p className="text-gray-300 font-light hover:text-rose-300 transition-colors duration-300">
                <span className="text-rose-400/70">•</span> Tel: 3005951133
              </p>
              <p className="text-gray-300 font-light hover:text-rose-300 transition-colors duration-300">
                <span className="text-rose-400/70">•</span> info@lushsecret.com
              </p>
            </div>
          </div>
          
          {/* Columna 3: Enlaces */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-light mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 tracking-wide drop-shadow-[0_0_15px_rgba(251,113,133,0.4)]">
              Enlaces Rápidos
            </h3>
            <div className="h-px w-16 bg-gradient-to-r from-rose-400/0 via-rose-400/50 to-rose-400/0 mx-auto md:mx-0 mb-5"></div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/login" className="text-gray-300 hover:text-rose-300 transition-all duration-300 font-light inline-flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/50 group-hover:bg-rose-400 mr-2 transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(251,113,133,0.6)]"></span>
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/registro" className="text-gray-300 hover:text-rose-300 transition-all duration-300 font-light inline-flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/50 group-hover:bg-rose-400 mr-2 transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(251,113,133,0.6)]"></span>
                  Registrarse
                </Link>
              </li>
              <li>
                <Link href="/politica" className="text-gray-300 hover:text-rose-300 transition-all duration-300 font-light inline-flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/50 group-hover:bg-rose-400 mr-2 transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(251,113,133,0.6)]"></span>
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-gray-300 hover:text-rose-300 transition-all duration-300 font-light inline-flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/50 group-hover:bg-rose-400 mr-2 transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(251,113,133,0.6)]"></span>
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-rose-300 transition-all duration-300 font-light inline-flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/50 group-hover:bg-rose-400 mr-2 transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(251,113,133,0.6)]"></span>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Sección de Beneficios con diseño luxury */}
        <div className="relative mb-12 py-10">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-rose-600/10 to-rose-500/5 rounded-2xl blur-xl"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/pagos-seguros" className="flex flex-col items-center group cursor-pointer">
              <div className="relative mb-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-600/20 to-rose-500/10 group-hover:from-rose-500/30 group-hover:to-rose-600/20 transition-all duration-300 border border-rose-500/30 group-hover:border-rose-400/50 shadow-lg group-hover:shadow-rose-500/20">
                  <FaLock className="w-8 h-8 text-rose-400 group-hover:text-rose-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_12px_rgba(251,113,133,0.6)]" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-rose-400/0 group-hover:bg-rose-400/10 blur-2xl transition-all duration-500"></div>
              </div>
              <span className="font-light text-gray-200 group-hover:text-rose-200 transition-colors duration-300 text-lg">Pagos Seguros</span>
              <p className="text-gray-400 text-xs mt-1 font-light">100% Protegidos</p>
            </Link>
            
            <Link href="/envios-discretos" className="flex flex-col items-center group cursor-pointer">
              <div className="relative mb-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-600/20 to-rose-500/10 group-hover:from-rose-500/30 group-hover:to-rose-600/20 transition-all duration-300 border border-rose-500/30 group-hover:border-rose-400/50 shadow-lg group-hover:shadow-rose-500/20">
                  <FaTruck className="w-8 h-8 text-rose-400 group-hover:text-rose-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_12px_rgba(251,113,133,0.6)]" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-rose-400/0 group-hover:bg-rose-400/10 blur-2xl transition-all duration-500"></div>
              </div>
              <span className="font-light text-gray-200 group-hover:text-rose-200 transition-colors duration-300 text-lg">Envíos Discretos</span>
              <p className="text-gray-400 text-xs mt-1 font-light">Privacidad Total</p>
            </Link>
            
            <Link href="/soporte" className="flex flex-col items-center group cursor-pointer">
              <div className="relative mb-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-600/20 to-rose-500/10 group-hover:from-rose-500/30 group-hover:to-rose-600/20 transition-all duration-300 border border-rose-500/30 group-hover:border-rose-400/50 shadow-lg group-hover:shadow-rose-500/20">
                  <FaHeadset className="w-8 h-8 text-rose-400 group-hover:text-rose-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_12px_rgba(251,113,133,0.6)]" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-rose-400/0 group-hover:bg-rose-400/10 blur-2xl transition-all duration-500"></div>
              </div>
              <span className="font-light text-gray-200 group-hover:text-rose-200 transition-colors duration-300 text-lg">Soporte 24/7</span>
              <p className="text-gray-400 text-xs mt-1 font-light">Siempre Disponible</p>
            </Link>
          </div>
        </div>
        
        {/* Línea divisoria con efecto oro rosado */}
        <div className="relative mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-rose-400/30 to-transparent"></div>
          <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-rose-400/20 to-transparent blur-sm"></div>
        </div>
        
        {/* Copyright con diseño premium */}
        <div className="text-center">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-rose-300/60 to-gray-400 font-light text-sm tracking-wider">
            © 2026 <span className="text-rose-300 font-normal">Lush Secret</span> • Todos los derechos reservados
          </p>
          <p className="text-gray-500 text-xs mt-2 font-light">Diseñado con elegancia y pasión</p>
        </div>
      </div>
    </footer>
  );
}
