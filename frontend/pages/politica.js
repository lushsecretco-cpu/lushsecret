import React from 'react';
import LuxuryBackground from '../components/LuxuryBackground';

export default function Politica() {
  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-light text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-4 tracking-wide">
            Tu Privacidad es Nuestra Prioridad
          </h1>
          <p className="text-center text-gray-300 mb-12 text-lg">Discreción absoluta garantizada</p>

          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 border border-rose-500/20 shadow-lg shadow-rose-500/20 space-y-8">

            {/* Mensaje principal de discreción */}
            <div className="text-center bg-gradient-to-r from-rose-900/30 to-pink-900/30 rounded-lg p-6 border border-rose-500/30">
              <h2 className="text-2xl font-light text-rose-300 mb-4">🛡️ Compromiso de Discreción Total</h2>
              <p className="text-gray-200 font-light text-lg leading-relaxed">
                En LushSecret, entendemos que tu privacidad es sagrada. Cada aspecto de nuestro servicio
                está diseñado para garantizar que tus compras permanezcan completamente confidenciales.
                <strong className="text-rose-300"> Nadie sabrá jamás qué has comprado con nosotros.</strong>
              </p>
            </div>

            {/* Empaques discretos */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4 flex items-center">
                📦 Empaques 100% Discretos
              </h2>
              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
                <p className="text-gray-300 font-light leading-relaxed mb-4">
                  Nuestros empaques están diseñados específicamente para proteger tu privacidad:
                </p>
                <ul className="space-y-3 text-gray-300 font-light">
                  <li className="flex items-start">
                    <span className="text-rose-400 mr-3">✓</span>
                    <span><strong>Sin logos visibles:</strong> Ningún empaque lleva marcas, logos o indicaciones de contenido</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-400 mr-3">✓</span>
                    <span><strong>Empaque doble:</strong> Tus productos van dentro de otro empaque genérico antes del envío</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-400 mr-3">✓</span>
                    <span><strong>Dirección del remitente neutral:</strong> No aparecerá nuestro nombre en el paquete</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-400 mr-3">✓</span>
                    <span><strong>Materiales opacos:</strong> No se puede ver el contenido a través del empaque</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-400 mr-3">✓</span>
                    <span><strong>Tamaño estándar:</strong> Los paquetes tienen apariencia común y corriente</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Anonimato total */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4 flex items-center">
                🔒 Anonimato Garantizado
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-xl font-light text-rose-400 mb-3">Compra Anónima</h3>
                  <ul className="space-y-2 text-gray-300 font-light text-sm">
                    <li>• No requerimos registro obligatorio</li>
                    <li>• Puedes comprar como invitado</li>
                    <li>• No guardamos datos sin tu consentimiento</li>
                    <li>• Opción de pago con criptomonedas disponibles</li>
                  </ul>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-xl font-light text-rose-400 mb-3">Comunicación Discreta</h3>
                  <ul className="space-y-2 text-gray-300 font-light text-sm">
                    <li>• Emails sin referencias al contenido</li>
                    <li>• Asunto genérico en todas las comunicaciones</li>
                    <li>• No enviamos publicidad no solicitada</li>
                    <li>• Soporte al cliente confidencial</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* No compartimos información */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4 flex items-center">
                🚫 Política de No Compartir
              </h2>
              <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/30">
                <p className="text-gray-300 font-light leading-relaxed mb-4">
                  <strong className="text-red-300">Jamás compartimos, vendemos o alquilamos tu información personal.</strong>
                  Tu privacidad es absoluta y no negociable.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-800/50 rounded p-4">
                    <div className="text-2xl mb-2">🚫</div>
                    <div className="text-sm text-gray-300">No vendemos datos</div>
                  </div>
                  <div className="bg-gray-800/50 rounded p-4">
                    <div className="text-2xl mb-2">🚫</div>
                    <div className="text-sm text-gray-300">No compartimos con terceros</div>
                  </div>
                  <div className="bg-gray-800/50 rounded p-4">
                    <div className="text-2xl mb-2">🚫</div>
                    <div className="text-sm text-gray-300">No publicidad externa</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Seguridad de datos */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4 flex items-center">
                🔐 Seguridad Máxima
              </h2>
              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
                <p className="text-gray-300 font-light leading-relaxed mb-4">
                  Implementamos las medidas de seguridad más avanzadas para proteger tu información:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-rose-400 font-light mb-2">Tecnología</h4>
                    <ul className="space-y-1 text-gray-300 font-light text-sm">
                      <li>• Encriptación SSL de extremo a extremo</li>
                      <li>• Servidores seguros con firewalls avanzados</li>
                      <li>• Datos encriptados en reposo</li>
                      <li>• Monitoreo 24/7 de seguridad</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-rose-400 font-light mb-2">Procesos</h4>
                    <ul className="space-y-1 text-gray-300 font-light text-sm">
                      <li>• Eliminación automática de datos temporales</li>
                      <li>• Acceso restringido al personal mínimo</li>
                      <li>• Auditorías de seguridad regulares</li>
                      <li>• Planes de respuesta a incidentes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Confidencialidad en el proceso de compra */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4 flex items-center">
                🛒 Proceso de Compra Confidencial
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-xl font-light text-rose-400 mb-3">Navegación Privada</h3>
                  <p className="text-gray-300 font-light leading-relaxed">
                    Nuestro sitio web no deja rastros identificables. Puedes navegar con total tranquilidad
                    sabiendo que tu actividad permanece completamente privada.
                  </p>
                </div>

                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-xl font-light text-rose-400 mb-3">Pago Seguro y Anónimo</h3>
                  <p className="text-gray-300 font-light leading-relaxed">
                    Aceptamos múltiples métodos de pago seguros. Los datos de tu tarjeta nunca se almacenan
                    en nuestros servidores. Para máxima discreción, considera opciones como criptomonedas
                    cuando estén disponibles.
                  </p>
                </div>

                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-xl font-light text-rose-400 mb-3">Envío Discreto Garantizado</h3>
                  <p className="text-gray-300 font-light leading-relaxed">
                    Trabajamos con servicios de envío premium que entienden la importancia de la discreción.
                    Tus paquetes llegan en perfecto estado, sin ninguna indicación de su contenido especial.
                  </p>
                </div>
              </div>
            </section>

            {/* Derechos y control */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4 flex items-center">
                🎛️ Tú Tienes el Control
              </h2>
              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
                <p className="text-gray-300 font-light leading-relaxed mb-4">
                  Tú decides cuánto compartir y cómo gestionar tu privacidad:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-rose-400 font-light mb-2">Tus Derechos</h4>
                    <ul className="space-y-1 text-gray-300 font-light text-sm">
                      <li>• Eliminar tu cuenta en cualquier momento</li>
                      <li>• Solicitar eliminación de todos tus datos</li>
                      <li>• Optar por no recibir comunicaciones</li>
                      <li>• Acceder a la información que tenemos sobre ti</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-rose-400 font-light mb-2">Tus Opciones</h4>
                    <ul className="space-y-1 text-gray-300 font-light text-sm">
                      <li>• Comprar como invitado (sin registro)</li>
                      <li>• Usar direcciones de envío alternativas</li>
                      <li>• Gestionar preferencias de privacidad</li>
                      <li>• Controlar cookies y seguimiento</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Compromiso final */}
            <section className="border-t border-rose-500/20 pt-8">
              <div className="text-center bg-gradient-to-r from-rose-900/20 to-pink-900/20 rounded-lg p-8 border border-rose-500/20">
                <h2 className="text-3xl font-light text-rose-300 mb-4">Nuestra Promesa</h2>
                <p className="text-gray-200 font-light text-lg leading-relaxed mb-6">
                  En LushSecret, creemos que tu privacidad es un derecho fundamental. No somos solo una tienda;
                  somos guardianes de tu confidencialidad. Cada decisión que tomamos, cada proceso que implementamos,
                  está diseñado con un solo objetivo: mantener tu mundo privado exactamente como lo deseas.
                </p>
                <div className="flex justify-center items-center space-x-8 text-sm text-gray-300">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🔒</div>
                    <div>Privacidad Primero</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🤫</div>
                    <div>Discreción Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🛡️</div>
                    <div>Protección Completa</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Información de contacto discreta */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">¿Preguntas sobre tu Privacidad?</h2>
              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/50">
                <p className="text-gray-300 font-light leading-relaxed mb-4">
                  Si tienes alguna pregunta sobre cómo protegemos tu privacidad o necesitas asistencia,
                  nuestro equipo de soporte está aquí para ayudarte de manera completamente confidencial.
                </p>
                <div className="text-center">
                  <p className="text-rose-300 font-light mb-2">Contáctanos de forma segura:</p>
                  <p className="text-gray-300 font-light">📧 info@lushsecret.co</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Todas las comunicaciones son encriptadas y confidenciales
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
</LuxuryBackground>
  );
}
