import React from 'react';
import LuxuryBackground from '../components/LuxuryBackground';
import { FaTruck, FaBox, FaUserSecret, FaMapMarkedAlt, FaCheckCircle, FaShippingFast } from 'react-icons/fa';
import { usePageTracking } from '../hooks/useAnalytics';

export default function EnviosDiscretos() {
  usePageTracking('Envíos Discretos');

  const features = [
    {
      icon: FaBox,
      title: "Empaque Sin Marcas",
      description: "Cajas genéricas sin logos, etiquetas ni ninguna referencia al contenido interior."
    },
    {
      icon: FaUserSecret,
      title: "Máxima Discreción",
      description: "Descripción neutral en la guía. Tu privacidad es completamente protegida."
    },
    {
      icon: FaShippingFast,
      title: "Envío Express",
      description: "Entregas rápidas en 24-48 horas a principales ciudades de Colombia."
    },
    {
      icon: FaMapMarkedAlt,
      title: "Rastreo en Tiempo Real",
      description: "Seguimiento completo de tu pedido desde la salida hasta tu puerta."
    }
  ];

  const cities = [
    { name: "Barranquilla", delivery: "24 horas" },
    { name: "Bogotá", delivery: "24-48 horas" },
    { name: "Medellín", delivery: "24-48 horas" },
    { name: "Cali", delivery: "24-48 horas" },
    { name: "Cartagena", delivery: "24 horas" },
    { name: "Santa Marta", delivery: "24-48 horas" },
    { name: "Bucaramanga", delivery: "48 horas" },
    { name: "Pereira", delivery: "48 horas" },
    { name: "Manizales", delivery: "48 horas" }
  ];

  const process = [
    {
      step: "1",
      title: "Procesamos tu Pedido",
      description: "Verificamos disponibilidad y preparamos tu orden con el mayor cuidado."
    },
    {
      step: "2",
      title: "Empaque Discreto",
      description: "Embalamos tu pedido en cajas genéricas sin ninguna identificación visible."
    },
    {
      step: "3",
      title: "Envío Seguro",
      description: "Despachamos con transportadoras certificadas y rastreo incluido."
    },
    {
      step: "4",
      title: "Entrega a Domicilio",
      description: "Recibe tu pedido directamente en tu puerta con total privacidad."
    }
  ];

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-32 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-block mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-rose-400/30 to-rose-500/20 blur-3xl animate-pulse"></div>
              <div className="relative p-8 rounded-full bg-gradient-to-br from-rose-600/20 to-rose-500/10 border-2 border-rose-500/40">
                <FaTruck className="w-24 h-24 text-rose-400 drop-shadow-[0_0_30px_rgba(251,113,133,0.8)]" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-6 tracking-wider drop-shadow-[0_0_40px_rgba(251,113,133,0.6)] hover:scale-105 transition-all duration-700">
              Envíos 100% Discretos
            </h1>
            
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/70 to-transparent drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
              Tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 font-normal">privacidad</span> es nuestra prioridad. Entregas completamente <span className="text-rose-300">discretas y anónimas</span>.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-rose-600/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-8 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/20">
                  <div className="mb-6 relative">
                    <div className="inline-block p-5 rounded-2xl bg-gradient-to-br from-rose-600/30 to-rose-500/10 border border-rose-500/30 group-hover:border-rose-400/50 transition-all duration-300">
                      <feature.icon className="w-10 h-10 text-rose-400 group-hover:text-rose-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_15px_rgba(251,113,133,0.7)]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-white group-hover:from-rose-200 group-hover:via-rose-400 group-hover:to-rose-200 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Process Timeline */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-6 tracking-wider drop-shadow-[0_0_30px_rgba(251,113,133,0.5)]">
                Proceso de Envío
              </h2>
              <p className="text-gray-300 text-lg font-light">
                Desde tu pedido hasta tu puerta
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, index) => (
                <div key={index} className="relative">
                  <div className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-8 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-600/40 to-rose-500/20 border-2 border-rose-400/50 mb-6 text-2xl font-bold text-rose-300 drop-shadow-[0_0_20px_rgba(251,113,133,0.6)]">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-white group-hover:from-rose-200 group-hover:via-rose-400 group-hover:to-rose-200 transition-all duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 font-light leading-relaxed text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-px bg-gradient-to-r from-rose-400/50 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cities Coverage */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-6 tracking-wider drop-shadow-[0_0_30px_rgba(251,113,133,0.5)]">
                Cobertura Nacional
              </h2>
              <p className="text-gray-300 text-lg font-light">
                Principales ciudades de Colombia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cities.map((city, index) => (
                <div key={index} className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                      <FaCheckCircle className="w-5 h-5 text-rose-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-lg font-semibold text-white group-hover:text-rose-300 transition-colors">
                        {city.name}
                      </h3>
                    </div>
                    <span className="text-sm text-rose-400 font-light">{city.delivery}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-400 font-light">
                ¿No ves tu ciudad? <span className="text-rose-400">Contáctanos</span> para conocer opciones de envío
              </p>
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-rose-600/10 to-rose-500/5 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-3xl p-12 border-2 border-rose-500/30">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 mb-6 tracking-wide">
                  Garantía de Privacidad Absoluta
                </h2>
                <p className="text-gray-300 text-lg font-light max-w-4xl mx-auto leading-relaxed mb-8">
                  Entendemos la importancia de tu privacidad. Por eso, cada paquete sale de nuestras instalaciones 
                  en empaques completamente neutros, sin marcas, logos o cualquier referencia al contenido. 
                  La guía de envío usa descripciones genéricas que no revelan el tipo de producto.
                </p>
                <div className="inline-block px-8 py-4 bg-gradient-to-r from-rose-600/20 to-rose-500/10 rounded-full border border-rose-500/30">
                  <p className="text-rose-300 font-light text-sm tracking-wide">
                    "Tu pedido, tu secreto" - Compromiso Lush Secret
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </LuxuryBackground>
  );
}
