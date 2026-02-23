import React from 'react';
import LuxuryBackground from '../components/LuxuryBackground';
import { FaHeadset, FaWhatsapp, FaEnvelope, FaClock, FaComments, FaQuestionCircle, FaPhone } from 'react-icons/fa';
import { usePageTracking } from '../hooks/useAnalytics';

export default function Soporte() {
  usePageTracking('Soporte 24/7');

  const channels = [
    {
      icon: FaWhatsapp,
      title: "WhatsApp",
      description: "Respuesta inmediata por mensaje",
      contact: "+57 300 595 1133",
      available: "24/7",
      color: "from-green-600/30 to-green-500/10",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
      link: "https://wa.me/573005951133"
    },
    {
      icon: FaEnvelope,
      title: "Email",
      description: "Respuesta en menos de 2 horas",
      contact: "info@lushsecret.com",
      available: "24/7",
      color: "from-rose-600/30 to-rose-500/10",
      borderColor: "border-rose-500/30",
      iconColor: "text-rose-400",
      link: "mailto:info@lushsecret.com"
    },
    {
      icon: FaPhone,
      title: "Teléfono",
      description: "Atención personalizada",
      contact: "300 595 1133",
      available: "Lun-Sab 8am-8pm",
      color: "from-blue-600/30 to-blue-500/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      link: "tel:+573005951133"
    }
  ];

  const faqs = [
    {
      question: "¿Cómo rastreo mi pedido?",
      answer: "Una vez procesado tu pedido, recibirás un email con el enlace de rastreo. También puedes consultar el estado en nuestra sección de seguimiento."
    },
    {
      question: "¿Cuál es el tiempo de entrega?",
      answer: "24-48 horas para principales ciudades. Otras zonas pueden tomar 3-5 días hábiles. Envíos express disponibles."
    },
    {
      question: "¿Los envíos son discretos?",
      answer: "Absolutamente. Todos nuestros paquetes vienen en cajas genéricas sin marcas ni referencias al contenido."
    },
    {
      question: "¿Puedo cambiar o devolver un producto?",
      answer: "Sí, tienes 30 días para cambios. Por higiene, algunos productos no admiten devolución una vez abiertos."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Tarjetas de crédito/débito, PSE, transferencias bancarias, Efecty, Baloto y Bold. Todos 100% seguros."
    },
    {
      question: "¿Cómo sé que mi compra es segura?",
      answer: "Usamos encriptación SSL 256-bit y cumplimos con PCI-DSS. Tu información está completamente protegida."
    }
  ];

  const features = [
    {
      icon: FaClock,
      title: "Disponibilidad 24/7",
      description: "Atención todos los días del año, a cualquier hora que nos necesites."
    },
    {
      icon: FaComments,
      title: "Asesoría Personalizada",
      description: "Equipo especializado que te guía en cada compra con discreción total."
    },
    {
      icon: FaQuestionCircle,
      title: "Resolución Rápida",
      description: "Tiempo promedio de respuesta: menos de 15 minutos vía WhatsApp."
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
                <FaHeadset className="w-24 h-24 text-rose-400 drop-shadow-[0_0_30px_rgba(251,113,133,0.8)]" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-6 tracking-wider drop-shadow-[0_0_40px_rgba(251,113,133,0.6)] hover:scale-105 transition-all duration-700">
              Soporte 24/7
            </h1>
            
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400/70 to-transparent drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
              Estamos aquí para <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 font-normal">ayudarte</span> en todo momento. Tu satisfacción es nuestra <span className="text-rose-300">prioridad</span>.
            </p>
          </div>

          {/* Contact Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {channels.map((channel, index) => (
              <a 
                key={index} 
                href={channel.link}
                target={channel.link.startsWith('http') ? '_blank' : '_self'}
                rel={channel.link.startsWith('http') ? 'noopener noreferrer' : ''}
                className="group relative block"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-rose-600/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-8 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/20">
                  <div className="mb-6 relative">
                    <div className={`inline-block p-6 rounded-2xl bg-gradient-to-br ${channel.color} border ${channel.borderColor} group-hover:border-opacity-70 transition-all duration-300`}>
                      <channel.icon className={`w-12 h-12 ${channel.iconColor} group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_15px_rgba(251,113,133,0.7)]`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-white group-hover:from-rose-200 group-hover:via-rose-400 group-hover:to-rose-200 transition-all duration-300">
                    {channel.title}
                  </h3>
                  <p className="text-gray-400 font-light mb-4">
                    {channel.description}
                  </p>
                  <p className="text-rose-400 font-semibold mb-2">
                    {channel.contact}
                  </p>
                  <p className="text-sm text-gray-500 font-light">
                    Disponible: {channel.available}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {features.map((feature, index) => (
              <div key={index} className="group text-center">
                <div className="inline-block mb-6 relative">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-600/30 to-rose-500/10 border border-rose-500/30 group-hover:border-rose-400/50 transition-all duration-300">
                    <feature.icon className="w-10 h-10 text-rose-400 group-hover:text-rose-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_15px_rgba(251,113,133,0.7)]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-white transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-6 tracking-wider drop-shadow-[0_0_30px_rgba(251,113,133,0.5)]">
                Preguntas Frecuentes
              </h2>
              <p className="text-gray-300 text-lg font-light">
                Encuentra respuestas rápidas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-white group-hover:from-rose-200 group-hover:via-rose-400 group-hover:to-rose-200 transition-all duration-300 flex items-start">
                      <FaQuestionCircle className="w-5 h-5 text-rose-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-gray-400 font-light leading-relaxed text-sm ml-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-rose-600/10 to-rose-500/5 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-3xl p-12 border-2 border-rose-500/30">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 mb-6 tracking-wide">
                  ¿Necesitas Ayuda Ahora?
                </h2>
                <p className="text-gray-300 text-lg font-light max-w-3xl mx-auto leading-relaxed mb-8">
                  Nuestro equipo está listo para atenderte. Contáctanos por el canal de tu preferencia 
                  y obtén respuestas inmediatas con la discreción que mereces.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://wa.me/573005951133" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-400/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <FaWhatsapp className="w-6 h-6 mr-3" />
                    Chatear por WhatsApp
                  </a>
                  <a 
                    href="mailto:info@lushsecret.com"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-rose-400/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <FaEnvelope className="w-6 h-6 mr-3" />
                    Enviar Email
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </LuxuryBackground>
  );
}
