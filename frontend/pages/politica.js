import React from 'react';
import LuxuryBackground from '../components/LuxuryBackground';

export default function Politica() {
  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-light text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-4 tracking-wide">
            Política de Privacidad
          </h1>
          <p className="text-center text-gray-300 mb-12 text-lg">Última actualización: 4 de marzo de 2026</p>

          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 border border-rose-500/20 shadow-lg shadow-rose-500/20 space-y-8">

            {/* Introducción */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">1. Introducción</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                En LushSecret, valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos,
                utilizamos, protegemos y manejamos tu información personal cuando utilizas nuestro sitio web
                <strong> lushsecret.vercel.app</strong> y nuestros servicios relacionados.
              </p>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Nos comprometemos a proteger tu privacidad y a garantizar que tu experiencia de compra sea segura,
                discreta y confidencial. Esta política se aplica a todos los usuarios de nuestro sitio web,
                incluyendo visitantes, clientes registrados y usuarios de nuestros servicios.
              </p>
              <p className="text-gray-300 font-light leading-relaxed">
                Al utilizar nuestros servicios, aceptas las prácticas descritas en esta política. Te recomendamos
                leer esta política detenidamente para entender cómo protegemos tu información.
              </p>
            </section>

            {/* Información que recopilamos */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">2. Información que Recopilamos</h2>

              <h3 className="text-xl font-light text-rose-400 mb-3">2.1 Información Personal que Proporcionas</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Recopilamos información personal que nos proporcionas directamente, incluyendo:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li><strong>Información de cuenta:</strong> Nombre, dirección de correo electrónico, contraseña y número de teléfono</li>
                <li><strong>Información de envío:</strong> Dirección de entrega, incluyendo dirección completa, ciudad, estado/provincia, código postal y país</li>
                <li><strong>Información de pago:</strong> Detalles de tarjetas de crédito/débito y otra información de pago (procesada de forma segura por proveedores certificados)</li>
                <li><strong>Información de perfil:</strong> Preferencias personales, historial de compras y configuraciones de cuenta</li>
                <li><strong>Comunicaciones:</strong> Mensajes, consultas, reseñas y feedback que nos envíes</li>
              </ul>

              <h3 className="text-xl font-light text-rose-400 mb-3">2.2 Información Recopilada Automáticamente</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Cuando visitas nuestro sitio web, recopilamos automáticamente cierta información técnica:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li><strong>Información del dispositivo:</strong> Tipo de dispositivo, sistema operativo, navegador web y resolución de pantalla</li>
                <li><strong>Información de uso:</strong> Páginas visitadas, tiempo en el sitio, clics, desplazamientos y patrones de navegación</li>
                <li><strong>Información de ubicación:</strong> Dirección IP aproximada y ubicación geográfica general</li>
                <li><strong>Cookies y tecnologías similares:</strong> Información almacenada en cookies, web beacons y tecnologías de seguimiento</li>
              </ul>

              <h3 className="text-xl font-light text-rose-400 mb-3">2.3 Información de Terceros</h3>
              <p className="text-gray-300 font-light leading-relaxed">
                Podemos recibir información sobre ti de terceros proveedores de servicios, incluyendo:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed space-y-2">
                <li>Proveedores de pago para verificar transacciones</li>
                <li>Servicios de envío para actualizar el estado de entregas</li>
                <li>Plataformas de redes sociales si te registras usando cuentas sociales</li>
              </ul>
            </section>

            {/* Cómo usamos la información */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">3. Cómo Utilizamos Tu Información</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Utilizamos la información recopilada para los siguientes propósitos:
              </p>

              <h3 className="text-xl font-light text-rose-400 mb-3">3.1 Prestación de Servicios</h3>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li>Procesar y completar tus pedidos</li>
                <li>Gestionar tu cuenta y preferencias</li>
                <li>Proporcionar atención al cliente</li>
                <li>Enviar confirmaciones de pedido y actualizaciones de envío</li>
                <li>Facilitar devoluciones y reembolsos</li>
              </ul>

              <h3 className="text-xl font-light text-rose-400 mb-3">3.2 Comunicación</h3>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li>Enviar información sobre tu pedido y cuenta</li>
                <li>Responder a tus consultas y solicitudes de soporte</li>
                <li>Enviar actualizaciones importantes sobre nuestros servicios</li>
                <li>Proporcionar información sobre productos y ofertas (con tu consentimiento)</li>
              </ul>

              <h3 className="text-xl font-light text-rose-400 mb-3">3.3 Mejora de Servicios</h3>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li>Analizar patrones de uso para mejorar nuestro sitio web</li>
                <li>Personalizar tu experiencia de compra</li>
                <li>Desarrollar nuevos productos y servicios</li>
                <li>Realizar investigaciones de mercado y análisis</li>
              </ul>

              <h3 className="text-xl font-light text-rose-400 mb-3">3.4 Cumplimiento Legal</h3>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed space-y-2">
                <li>Cumplir con obligaciones legales y regulatorias</li>
                <li>Proteger nuestros derechos y propiedad</li>
                <li>Prevenir fraudes y actividades ilegales</li>
                <li>Cooperar con autoridades cuando sea requerido por ley</li>
              </ul>
            </section>

            {/* Compartir información */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">4. Compartir Tu Información</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                No vendemos, alquilamos ni compartimos tu información personal con terceros para fines comerciales,
                excepto en las siguientes circunstancias:
              </p>

              <h3 className="text-xl font-light text-rose-400 mb-3">4.1 Proveedores de Servicios</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Compartimos información con proveedores de servicios de confianza que nos ayudan a operar nuestro negocio:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li><strong>Procesadores de pago:</strong> Para procesar transacciones de forma segura</li>
                <li><strong>Servicios de envío:</strong> Para entregar tus pedidos</li>
                <li><strong>Proveedores de hosting:</strong> Para almacenar y procesar datos</li>
                <li><strong>Servicios de análisis:</strong> Para entender el uso del sitio web</li>
              </ul>

              <h3 className="text-xl font-light text-rose-400 mb-3">4.2 Requerimientos Legales</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Podemos divulgar tu información si es requerido por ley, orden judicial o para proteger nuestros
                derechos legales, incluyendo:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li>Cumplir con citaciones legales</li>
                <li>Investigar posibles violaciones de nuestros términos</li>
                <li>Proteger contra amenazas a la seguridad</li>
                <li>Prevenir actividades fraudulentas</li>
              </ul>

              <h3 className="text-xl font-light text-rose-400 mb-3">4.3 Transferencias Empresariales</h3>
              <p className="text-gray-300 font-light leading-relaxed">
                En caso de fusión, adquisición o venta de activos, tu información puede ser transferida como
                parte de la transacción. Te notificaremos sobre cualquier cambio en la propiedad de tus datos.
              </p>
            </section>

            {/* Seguridad de datos */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">5. Seguridad de Datos</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tu información personal:
              </p>

              <h3 className="text-xl font-light text-rose-400 mb-3">5.1 Medidas Técnicas</h3>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li><strong>Encriptación:</strong> Toda la información sensible se transmite usando SSL/TLS</li>
                <li><strong>Almacenamiento seguro:</strong> Datos encriptados en servidores con controles de acceso</li>
                <li><strong>Firewalls y monitoreo:</strong> Sistemas de protección contra accesos no autorizados</li>
                <li><strong>Actualizaciones regulares:</strong> Software y sistemas mantenidos al día</li>
              </ul>

              <h3 className="text-xl font-light text-rose-400 mb-3">5.2 Medidas Administrativas</h3>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li><strong>Acceso limitado:</strong> Solo personal autorizado puede acceder a datos personales</li>
                <li><strong>Entrenamiento:</strong> Empleados capacitados en protección de datos</li>
                <li><strong>Auditorías regulares:</strong> Revisiones periódicas de seguridad</li>
                <li><strong>Planes de respuesta:</strong> Protocolos para incidentes de seguridad</li>
              </ul>

              <h3 className="text-xl font-light text-rose-400 mb-3">5.3 Tu Responsabilidad</h3>
              <p className="text-gray-300 font-light leading-relaxed">
                Aunque implementamos medidas robustas de seguridad, la seguridad de tu información también depende de ti.
                Mantén tu contraseña segura, no la compartas con terceros y cierra sesión cuando uses dispositivos compartidos.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">6. Cookies y Tecnologías de Seguimiento</h2>

              <h3 className="text-xl font-light text-rose-400 mb-3">6.1 Qué son las Cookies</h3>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web.
                Nos ayudan a proporcionar una mejor experiencia de usuario y a entender cómo interactúas con nuestro sitio.
              </p>

              <h3 className="text-xl font-light text-rose-400 mb-3">6.2 Tipos de Cookies que Utilizamos</h3>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Cookies de rendimiento:</strong> Ayudan a analizar y mejorar el rendimiento del sitio</li>
                <li><strong>Cookies funcionales:</strong> Recuerdan tus preferencias y configuraciones</li>
                <li><strong>Cookies de marketing:</strong> Utilizadas para mostrar anuncios relevantes (solo con consentimiento)</li>
              </ul>

              <h3 className="text-xl font-light text-rose-400 mb-3">6.3 Control de Cookies</h3>
              <p className="text-gray-300 font-light leading-relaxed">
                Puedes controlar y gestionar las cookies a través de la configuración de tu navegador.
                Sin embargo, desactivar ciertas cookies puede afectar la funcionalidad de nuestro sitio web.
              </p>
            </section>

            {/* Derechos del usuario */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">7. Tus Derechos</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Tienes ciertos derechos respecto a tu información personal. Dependiendo de tu ubicación,
                puedes tener los siguientes derechos:
              </p>

              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li><strong>Acceso:</strong> Solicitar una copia de la información personal que tenemos sobre ti</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de tu información personal</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado</li>
                <li><strong>Restricción:</strong> Limitar el procesamiento de tu información</li>
                <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos para ciertos fines</li>
              </ul>

              <p className="text-gray-300 font-light leading-relaxed">
                Para ejercer estos derechos, contáctanos usando la información proporcionada en la sección de contacto.
                Responderemos a tu solicitud dentro de los plazos legales aplicables.
              </p>
            </section>

            {/* Retención de datos */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">8. Retención de Datos</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Retenemos tu información personal solo durante el tiempo necesario para cumplir con los propósitos
                descritos en esta política, a menos que un período de retención más largo sea requerido o permitido por ley.
              </p>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed space-y-2">
                <li><strong>Datos de cuenta:</strong> Mientras tu cuenta esté activa y por un período razonable después</li>
                <li><strong>Datos de pedidos:</strong> Según requerimientos fiscales y contables (generalmente 5-7 años)</li>
                <li><strong>Datos de marketing:</strong> Hasta que solicites la eliminación o retires tu consentimiento</li>
                <li><strong>Datos técnicos:</strong> Generalmente por 2 años para análisis y mejoras</li>
              </ul>
            </section>

            {/* Cambios en la política */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">9. Cambios en Esta Política</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras
                prácticas o por requerimientos legales. Cuando hagamos cambios significativos, te notificaremos
                mediante:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed mb-4 space-y-2">
                <li>Un aviso destacado en nuestro sitio web</li>
                <li>Un correo electrónico a la dirección asociada con tu cuenta</li>
                <li>Una notificación en la aplicación móvil (si aplica)</li>
              </ul>
              <p className="text-gray-300 font-light leading-relaxed">
                Te recomendamos revisar esta política periódicamente. El uso continuado de nuestros servicios
                después de cambios constituyen tu aceptación de la política actualizada.
              </p>
            </section>

            {/* Contacto */}
            <section>
              <h2 className="text-3xl font-light text-rose-300 mb-4">10. Contacto</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                Si tienes preguntas, preocupaciones o solicitudes relacionadas con esta Política de Privacidad,
                puedes contactarnos de las siguientes maneras:
              </p>

              <div className="bg-gray-900/50 rounded-lg p-6 border border-rose-500/10">
                <h3 className="text-xl font-light text-rose-400 mb-4">Información de Contacto</h3>
                <div className="space-y-3 text-gray-300 font-light">
                  <p><strong>Email:</strong> privacidad@lushsecret.co</p>
                  <p><strong>Teléfono:</strong> +57 XXX XXX XXXX</p>
                  <p><strong>Dirección:</strong> [Dirección de la empresa]</p>
                  <p><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-5)</p>
                </div>
              </div>

              <p className="text-gray-300 font-light leading-relaxed mt-4">
                Para solicitudes relacionadas con el ejercicio de tus derechos de privacidad, incluye "Solicitud GDPR"
                o "Solicitud de Privacidad" en el asunto de tu mensaje para una respuesta prioritaria.
              </p>
            </section>

            {/* Compromiso con la privacidad */}
            <section className="border-t border-rose-500/20 pt-8">
              <h2 className="text-3xl font-light text-rose-300 mb-4">Compromiso con Tu Privacidad</h2>
              <p className="text-gray-300 font-light leading-relaxed mb-4">
                En LushSecret, entendemos la sensibilidad de la información que manejamos, especialmente en el contexto
                de productos para adultos. Nos comprometemos a:
              </p>
              <ul className="list-disc list-inside text-gray-300 font-light leading-relaxed space-y-2">
                <li><strong>Discreción absoluta:</strong> Toda tu información se maneja con el máximo nivel de confidencialidad</li>
                <li><strong>Transparencia:</strong> Ser claros sobre cómo usamos y protegemos tus datos</li>
                <li><strong>Control:</strong> Darle el control sobre tu información y preferencias</li>
                <li><strong>Cumplimiento:</strong> Adherirnos a las leyes de protección de datos aplicables</li>
                <li><strong>Mejora continua:</strong> Revisar y actualizar nuestras prácticas de privacidad regularmente</li>
              </ul>
              <p className="text-gray-300 font-light leading-relaxed mt-4">
                Tu confianza es fundamental para nosotros. Si en algún momento no estás satisfecho con cómo manejamos
                tu información, te invitamos a contactarnos para resolver cualquier preocupación.
              </p>
            </section>

          </div>
        </div>
      </main>
    </LuxuryBackground>
  );
}
