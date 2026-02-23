import { API_URL } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../components/CartContext';
import LuxuryBackground from '../components/LuxuryBackground';

export default function MetodoPago() {
  const { cart, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('bold');

  // Función helper para formatear rutas de imagen
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/200x200?text=Producto';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
    return `/images/${imageUrl}`;
  };

  useEffect(() => {
    // Recuperar datos del pedido guardados en localStorage
    const savedOrderData = localStorage.getItem('orderData');
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    } else {
      // Si no hay datos, redirigir al checkout
      router.push('/checkout');
    }
  }, []);

  const handlePayment = async () => {
    if (selectedMethod === 'bold') {
      try {
        // Crear la orden en el backend primero
        const items = cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        }));

        const response = await fetch('${API_URL}/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_info: orderData,
            items: items,
            total: getTotal(),
            payment_method: 'bold',
            session_id: localStorage.getItem('sessionId') || `session_${Date.now()}`
          })
        });

        const result = await response.json();

        if (result.success) {
          console.log('✅ Orden creada:', result.order);
          
          // Aquí integrarás con Bold para procesar el pago
          // Por ahora simulamos el flujo
          alert(`Orden #${result.order.id} creada exitosamente.\n\nEn producción, serás redirigido a Bold para completar el pago.\n\nCuando Bold confirme el pago, recibiremos un webhook y la orden se marcará como "paid" automáticamente en las analíticas.`);
          
          // Limpiar datos
          localStorage.removeItem('orderData');
          clearCart();
          router.push('/');
        } else {
          alert('Error al crear la orden. Por favor intenta nuevamente.');
        }
      } catch (error) {
        console.error('Error al procesar el pago:', error);
        alert('Error al procesar el pago. Por favor intenta nuevamente.');
      }
    }
  };

  if (!orderData) {
    return (
      <LuxuryBackground>
        <main className="min-h-screen text-white py-24 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-300 font-light">Cargando...</p>
          </div>
        </main>
      </LuxuryBackground>
    );
  }

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-12 tracking-wide">
            Método de Pago
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resumen del Pedido */}
            <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
              <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-6 tracking-wide">
                Resumen del Pedido
              </h3>

              {/* Productos */}
              <div className="mb-6">
                <h4 className="text-lg font-light text-gray-300 mb-4">Productos</h4>
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center mb-4 pb-4 border-b border-yellow-500/10 last:border-0">
                    <img src={formatImageUrl(item.image)} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4 border border-yellow-500/20" />
                    <div className="flex-1">
                      <p className="font-light text-white">{item.name}</p>
                      <p className="text-sm text-gray-400 font-light">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-light text-yellow-400">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                  </div>
                ))}
              </div>

              {/* Datos de Envío */}
              <div className="mb-6 pt-6 border-t border-yellow-500/30">
                <h4 className="text-lg font-light text-gray-300 mb-4">Datos de Envío</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">
                    <span className="text-yellow-400 font-light">Nombre:</span> {orderData.nombre} {orderData.apellidos}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-yellow-400 font-light">Cédula:</span> {orderData.cedula}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-yellow-400 font-light">Teléfono:</span> {orderData.telefono}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-yellow-400 font-light">Correo:</span> {orderData.correo}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-yellow-400 font-light">Dirección:</span> {orderData.direccion}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-yellow-400 font-light">Ciudad:</span> {orderData.ciudad}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-yellow-400 font-light">Recibe:</span> {orderData.nombreRecibe}
                  </p>
                  {orderData.observaciones && (
                    <p className="text-gray-400">
                      <span className="text-yellow-400 font-light">Observaciones:</span> {orderData.observaciones}
                    </p>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-yellow-500/30 pt-6">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-light text-gray-300 tracking-wide">Total:</p>
                  <p className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                    ${getTotal().toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
              <h3 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-6 tracking-wide">
                Selecciona tu Método de Pago
              </h3>

              {/* Opción Bold */}
              <div 
                onClick={() => setSelectedMethod('bold')}
                className={`cursor-pointer p-6 rounded-lg border-2 transition-all duration-300 mb-4 ${
                  selectedMethod === 'bold' 
                    ? 'border-yellow-400 bg-yellow-500/10' 
                    : 'border-yellow-500/20 bg-black/30 hover:border-yellow-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'bold' ? 'border-yellow-400' : 'border-gray-500'
                    }`}>
                      {selectedMethod === 'bold' && (
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-light text-white tracking-wide">Bold</p>
                      <p className="text-sm text-gray-400 font-light mt-1">
                        Pago seguro con tarjetas de crédito/débito
                      </p>
                    </div>
                  </div>
                  <svg className="w-16 h-16" viewBox="0 0 100 40" fill="none">
                    <text x="10" y="25" className="text-2xl font-bold fill-yellow-400">BOLD</text>
                  </svg>
                </div>
              </div>

              {/* Información de seguridad */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-6 border border-yellow-500/10">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="text-sm font-light text-gray-300 mb-1">Pago 100% Seguro</p>
                    <p className="text-xs text-gray-400 font-light">
                      Tus datos están protegidos con encriptación SSL de última generación.
                      Nunca almacenamos tu información de pago.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-yellow-600/80 to-yellow-400/80 hover:from-yellow-500 hover:to-yellow-300 text-black font-light py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/30 tracking-wide text-lg"
                >
                  Proceder al Pago - ${getTotal().toLocaleString('es-CO')}
                </button>
                
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-black/30 border border-yellow-500/30 hover:border-yellow-400 text-gray-300 hover:text-white font-light py-3 px-8 rounded-lg transition-all duration-300"
                >
                  Volver al Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LuxuryBackground>
  );
}

