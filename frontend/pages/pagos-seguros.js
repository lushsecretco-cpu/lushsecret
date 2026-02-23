import React from 'react';
import LuxuryBackground from '../components/LuxuryBackground';
import { FaLock, FaShieldAlt, FaCreditCard, FaCheckCircle, FaFingerprint, FaUserSecret } from 'react-icons/fa';
import { usePageTracking } from '../hooks/useAnalytics';

export default function PagosSegurос() {
  usePageTracking('Pagos Seguros');

  const features = [
    {
      icon: FaShieldAlt,
      title: "Encriptación SSL 256-bit",
      description: "Toda tu información viaja protegida con el más alto nivel de seguridad bancaria."
    },
    {
      icon: FaFingerprint,
      title: "Autenticación Segura",
      description: "Verificación en dos pasos y protocolos de seguridad avanzados para cada transacción."
    },
    {
      icon: FaCreditCard,
      title: "Métodos Certificados",
      description: "Procesadores de pago certificados internacionalmente con garantía de protección."
    },
    {
      icon: FaUserSecret,
      title: "Privacidad Total",
      description: "Tus datos jamás son compartidos. Cumplimos con las más estrictas normas de privacidad."
    }
  ];

  const paymentMethods = [
    { name: "Tarjetas de Crédito", desc: "Visa, Mastercard, American Express" },
    { name: "Tarjetas Débito", desc: "Todas las entidades bancarias" },
    { name: "PSE", desc: "Pagos seguros en línea" },
    { name: "Transferencias", desc: "Bancolombia, Davivienda, BBVA" },
    { name: "Efectivo", desc: "Puntos autorizados Efecty, Baloto" },
    { name: "Bold", desc: "Plataforma de pagos certificada" }
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
                <FaLock className="w-24 h-24 text-rose-400 drop-shadow-[0_0_30px_rgba(251,113,133,0.8)]" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-6 tracking-wider drop-shadow-[0_0_40px_rgba(251,113,133,0.6)] hover:scale-105 transition-all duration-700">
              Pagos 100% Seguros
            </h1>
            
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/70 to-transparent drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
              Tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 font-normal">seguridad</span> es nuestra prioridad. Cada transacción está protegida con tecnología de <span className="text-rose-300">última generación</span>.
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

          {/* Payment Methods Section */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-6 tracking-wider drop-shadow-[0_0_30px_rgba(251,113,133,0.5)]">
                Métodos de Pago Disponibles
              </h2>
              <p className="text-gray-300 text-lg font-light">
                Múltiples opciones para tu comodidad
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentMethods.map((method, index) => (
                <div key={index} className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-rose-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <FaCheckCircle className="w-6 h-6 text-rose-400 mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-rose-300 transition-colors">
                        {method.name}
                      </h3>
                      <p className="text-sm text-gray-400 font-light">{method.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Guarantee Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-rose-600/10 to-rose-500/5 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-3xl p-12 border-2 border-rose-500/30">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 mb-6 tracking-wide">
                  Garantía de Seguridad Total
                </h2>
                <p className="text-gray-300 text-lg font-light max-w-4xl mx-auto leading-relaxed mb-8">
                  Cumplimos con los estándares PCI-DSS nivel 1, la certificación más alta en seguridad de pagos. 
                  Nuestros sistemas son auditados constantemente para garantizar la protección absoluta de tu información.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-rose-400 mb-2 drop-shadow-[0_0_20px_rgba(251,113,133,0.6)]">
                      100%
                    </div>
                    <p className="text-gray-400 font-light">Transacciones Seguras</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-rose-400 mb-2 drop-shadow-[0_0_20px_rgba(251,113,133,0.6)]">
                      24/7
                    </div>
                    <p className="text-gray-400 font-light">Monitoreo Activo</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-rose-400 mb-2 drop-shadow-[0_0_20px_rgba(251,113,133,0.6)]">
                      0
                    </div>
                    <p className="text-gray-400 font-light">Fraudes Reportados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </LuxuryBackground>
  );
}
