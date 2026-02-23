import React, { useState, useEffect } from 'react';
import LuxuryBackground from '../../components/LuxuryBackground';

const SHIPPING_STATUSES = {
  pending: 'Pedido Recibido',
  processing: 'En Preparación',
  packed: 'Empacado',
  shipped: 'En Camino',
  out_for_delivery: 'En Reparto',
  delivered: 'Entregado',
  failed: 'Intento Fallido',
  returned: 'Devuelto'
};

export default function ShippingAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    shipping_status: '',
    tracking_number: '',
    tracking_url: '',
    shipping_carrier: '',
    estimated_delivery: '',
    location: '',
    description: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/tracking/admin/pending');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setUpdateForm({
      shipping_status: order.shipping_status || 'pending',
      tracking_number: order.tracking_number || '',
      tracking_url: order.tracking_url || '',
      shipping_carrier: order.shipping_carrier || '',
      estimated_delivery: order.estimated_delivery ? new Date(order.estimated_delivery).toISOString().split('T')[0] : '',
      location: '',
      description: ''
    });
  };

  const handleUpdateShipping = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch('http://localhost:4000/api/tracking/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          ...updateForm
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Estado actualizado y email enviado al cliente');
        setSelectedOrder(null);
        fetchOrders();
        setUpdateForm({
          shipping_status: '',
          tracking_number: '',
          tracking_url: '',
          shipping_carrier: '',
          estimated_delivery: '',
          location: '',
          description: ''
        });
      } else {
        alert('❌ Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating shipping:', error);
      alert('❌ Error al actualizar el estado');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-rose-400/20 text-rose-300 border-rose-400/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      packed: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      out_for_delivery: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      returned: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[status] || colors.pending;
  };

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-light text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-300 mb-12 tracking-wide">
            Gestión de Envíos
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lista de Pedidos */}
            <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-rose-400/30 shadow-lg shadow-rose-400/20">
              <h2 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-300 mb-6 tracking-wide">
                Pedidos Activos
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-rose-300 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {orders.map((order) => {
                    const customerInfo = order.customer_info || {};
                    return (
                      <div
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className={`cursor-pointer p-4 rounded-lg border transition-all duration-300 ${
                          selectedOrder?.id === order.id
                            ? 'bg-rose-400/20 border-rose-300'
                            : 'bg-black/30 border-rose-400/10 hover:border-rose-400/30'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-rose-300 font-light">Pedido #{order.id}</p>
                            <p className="text-white font-light">{customerInfo.nombre} {customerInfo.apellidos}</p>
                            <p className="text-gray-400 font-light text-sm">{customerInfo.ciudad}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-rose-300 font-light">${parseFloat(order.total).toLocaleString('es-CO')}</p>
                            <p className="text-gray-400 font-light text-sm">{order.items_count} items</p>
                          </div>
                        </div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-light border ${getStatusColor(order.shipping_status || 'pending')}`}>
                          {SHIPPING_STATUSES[order.shipping_status || 'pending']}
                        </div>
                      </div>
                    );
                  })}
                  {orders.length === 0 && (
                    <p className="text-gray-400 font-light text-center py-8">
                      No hay pedidos activos
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Formulario de Actualización */}
            <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-rose-400/30 shadow-lg shadow-rose-400/20">
              <h2 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-300 mb-6 tracking-wide">
                Actualizar Estado
              </h2>

              {selectedOrder ? (
                <form onSubmit={handleUpdateShipping} className="space-y-4">
                  {/* Info del Pedido */}
                  <div className="bg-black/30 rounded-lg p-4 mb-6 border border-rose-400/10">
                    <p className="text-rose-300 font-light mb-2">Pedido #{selectedOrder.id}</p>
                    <p className="text-white font-light">
                      {selectedOrder.customer_info?.nombre} {selectedOrder.customer_info?.apellidos}
                    </p>
                    <p className="text-gray-400 font-light text-sm">
                      {selectedOrder.customer_info?.correo}
                    </p>
                    <p className="text-gray-400 font-light text-sm">
                      {selectedOrder.customer_info?.telefono}
                    </p>
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">
                      Estado del Envío *
                    </label>
                    <select
                      value={updateForm.shipping_status}
                      onChange={(e) => setUpdateForm({ ...updateForm, shipping_status: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-rose-400/30 rounded-lg focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 text-white font-light transition-all duration-300"
                    >
                      {Object.entries(SHIPPING_STATUSES).map(([key, value]) => (
                        <option key={key} value={key} className="bg-gray-900">
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Número de Guía */}
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">
                      Número de Guía
                    </label>
                    <input
                      type="text"
                      value={updateForm.tracking_number}
                      onChange={(e) => setUpdateForm({ ...updateForm, tracking_number: e.target.value })}
                      placeholder="Ej: 1234567890"
                      className="w-full px-4 py-3 bg-black/30 border border-rose-400/30 rounded-lg focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 text-white font-light transition-all duration-300"
                    />
                  </div>

                  {/* URL de Rastreo */}
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">
                      URL de Rastreo de la Transportadora 🤖
                      <span className="block text-xs text-rose-300 mt-1">
                        Se actualizará automáticamente cada 4 horas
                      </span>
                    </label>
                    <input
                      type="url"
                      value={updateForm.tracking_url}
                      onChange={(e) => setUpdateForm({ ...updateForm, tracking_url: e.target.value })}
                      placeholder="https://www.servientrega.com/rastreo/..."
                      className="w-full px-4 py-3 bg-black/30 border border-rose-400/30 rounded-lg focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 text-white font-light transition-all duration-300"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Pega aquí la URL de rastreo de Servientrega, Coordinadora, etc.
                    </p>
                  </div>

                  {/* Transportadora */}
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">
                      Transportadora
                    </label>
                    <input
                      type="text"
                      value={updateForm.shipping_carrier}
                      onChange={(e) => setUpdateForm({ ...updateForm, shipping_carrier: e.target.value })}
                      placeholder="Ej: Servientrega, Coordinadora, etc."
                      className="w-full px-4 py-3 bg-black/30 border border-rose-400/30 rounded-lg focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 text-white font-light transition-all duration-300"
                    />
                  </div>

                  {/* Fecha Estimada */}
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">
                      Entrega Estimada
                    </label>
                    <input
                      type="date"
                      value={updateForm.estimated_delivery}
                      onChange={(e) => setUpdateForm({ ...updateForm, estimated_delivery: e.target.value })}
                      className="w-full px-4 py-3 bg-black/30 border border-rose-400/30 rounded-lg focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 text-white font-light transition-all duration-300"
                    />
                  </div>

                  {/* Ubicación */}
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">
                      Ubicación Actual
                    </label>
                    <input
                      type="text"
                      value={updateForm.location}
                      onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                      placeholder="Ej: Bogotá - Centro de Distribución"
                      className="w-full px-4 py-3 bg-black/30 border border-rose-400/30 rounded-lg focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 text-white font-light transition-all duration-300"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2 tracking-wide">
                      Descripción/Nota
                    </label>
                    <textarea
                      value={updateForm.description}
                      onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                      rows="3"
                      placeholder="Información adicional para el cliente..."
                      className="w-full px-4 py-3 bg-black/30 border border-rose-400/30 rounded-lg focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 text-white font-light transition-all duration-300 resize-none"
                    ></textarea>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 bg-gradient-to-r from-rose-400/80 to-pink-300/80 hover:from-rose-300 hover:to-pink-200 text-black font-light py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? 'Actualizando...' : 'Actualizar y Notificar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(null)}
                      className="px-6 bg-black/30 border border-rose-400/30 hover:border-rose-300 text-gray-300 hover:text-white font-light py-3 rounded-lg transition-all duration-300"
                    >
                      Cancelar
                    </button>
                  </div>

                  <p className="text-gray-400 font-light text-sm text-center mt-4">
                    💌 Se enviará un correo automático al cliente con la actualización
                  </p>
                </form>
              ) : (
                <div className="text-center py-20">
                  <svg className="w-24 h-24 mx-auto mb-4 text-rose-300/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-400 font-light">
                    Selecciona un pedido de la lista para actualizar su estado
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </LuxuryBackground>
  );
}


