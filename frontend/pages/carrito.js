import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../components/CartContext';
import LuxuryBackground from '../components/LuxuryBackground';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { usePageTracking } from '../hooks/useAnalytics';

export default function Carrito() {
  const { cart, removeItem, updateQuantity, updateItemDetails, getTotal } = useCart();
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Tracking de página de carrito
  usePageTracking('Carrito de Compras');

  // Función helper para formatear rutas de imagen
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/200x200?text=Producto';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
    return `/images/${imageUrl}`;
  };

  // Función auxiliar para verificar si un item tiene opciones editables
  const hasEditableOptions = (item) => {
    const hasSizes = item.sizes && Array.isArray(item.sizes) && item.sizes.length > 0;
    const hasColors = item.hasColors && item.colors && Array.isArray(item.colors) && item.colors.length > 0;
    return hasSizes || hasColors;
  };

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-rose-400 mb-12 tracking-wide">Carrito de Compras</h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-300 font-light">Tu carrito está vacío.</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {cart.map((item) => {
                const isEditing = editingItem === item.id;
                const currentValues = isEditing ? editValues : {
                  selectedSize: item.selectedSize,
                  selectedColor: item.selectedColor,
                  quantity: item.quantity
                };

                // Debug: ver estructura del item
                if (isEditing) {
                  console.log('Item en edición:', {
                    id: item.id,
                    name: item.name,
                    hasColors: item.hasColors,
                    colors: item.colors,
                    sizes: item.sizes,
                    selectedColor: item.selectedColor,
                    selectedSize: item.selectedSize
                  });
                }

                return (
                  <div key={item.id} className="bg-black/50 backdrop-blur-sm rounded-lg shadow-lg shadow-rose-500/10 overflow-hidden border border-rose-600/20 hover:shadow-rose-500/30 transition-all duration-300">
                    <img src={formatImageUrl(item.image)} alt={item.name} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-light text-white mb-2">{item.name}</h3>
                      <p className="text-rose-400 font-light mb-4">${parseFloat(item.price).toLocaleString('es-CO')}</p>
                      
                      {/* Mostrar/Editar Talla */}
                      <div className="mb-3">
                        <label className="text-gray-400 text-sm font-light block mb-1">Talla:</label>
                        {isEditing ? (
                          (() => {
                            // Obtener las tallas disponibles según la estructura
                            let availableSizes = [];
                            
                            if (item.hasColors && item.colors && item.colors.length > 0) {
                              // Producto con colores: obtener tallas del color seleccionado
                              const selectedColorObj = item.colors.find(c => c.color === currentValues.selectedColor);
                              if (selectedColorObj && selectedColorObj.sizes) {
                                availableSizes = selectedColorObj.sizes;
                              }
                            } else if (item.sizes && Array.isArray(item.sizes)) {
                              // Producto sin colores: usar sizes directamente
                              availableSizes = item.sizes;
                            }

                            if (availableSizes.length > 0) {
                              return (
                                <select
                                  value={currentValues.selectedSize || ''}
                                  onChange={(e) => setEditValues({...editValues, selectedSize: e.target.value})}
                                  className="w-full bg-gray-800 text-white border border-rose-500/30 rounded-lg px-3 py-2 font-light focus:outline-none focus:border-rose-400"
                                >
                                  {availableSizes.map((sizeItem, idx) => {
                                    const sizeValue = typeof sizeItem === 'object' ? sizeItem.size : sizeItem;
                                    return (
                                      <option key={idx} value={sizeValue}>
                                        {sizeValue}
                                        {typeof sizeItem === 'object' && sizeItem.stock ? ` (${sizeItem.stock})` : ''}
                                      </option>
                                    );
                                  })}
                                </select>
                              );
                            } else {
                              return (
                                <div className="text-rose-400 text-sm">
                                  No hay tallas disponibles para editar
                                </div>
                              );
                            }
                          })()
                        ) : (
                          <span className="text-white font-medium">{item.selectedSize || 'N/A'}</span>
                        )}
                      </div>

                      {/* Mostrar/Editar Color (si tiene colores) */}
                      {item.hasColors && item.colors && item.colors.length > 0 && (
                        <div className="mb-3">
                          <label className="text-gray-400 text-sm font-light block mb-1">Color:</label>
                          {isEditing ? (
                            <select
                              value={currentValues.selectedColor || ''}
                              onChange={(e) => {
                                const newColor = e.target.value;
                                const colorObj = item.colors.find(c => c.color === newColor);
                                setEditValues({
                                  ...editValues, 
                                  selectedColor: newColor,
                                  selectedSize: colorObj?.sizes?.[0]?.size || colorObj?.sizes?.[0] || editValues.selectedSize
                                });
                              }}
                              className="w-full bg-gray-800 text-white border border-rose-500/30 rounded-lg px-3 py-2 font-light focus:outline-none focus:border-rose-400"
                            >
                              {item.colors.map((colorItem, idx) => (
                                <option key={idx} value={colorItem.color}>{colorItem.color}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 rounded-full border border-gray-600"
                                style={{backgroundColor: item.selectedColorCode || '#888'}}
                              />
                              <span className="text-white font-medium">{item.selectedColor || 'N/A'}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mostrar/Editar Cantidad */}
                      <div className="mb-4">
                        <label className="text-gray-400 text-sm font-light block mb-1">Cantidad:</label>
                        {isEditing ? (
                          <input
                            type="number"
                            min="1"
                            value={currentValues.quantity}
                            onChange={(e) => setEditValues({...editValues, quantity: parseInt(e.target.value) || 1})}
                            className="w-full bg-gray-800 text-white border border-rose-500/30 rounded-lg px-3 py-2 font-light focus:outline-none focus:border-rose-400"
                          />
                        ) : (
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gradient-to-r from-rose-600/80 to-rose-400/80 hover:from-rose-500 hover:to-rose-300 text-white px-4 py-2 rounded-lg font-light transition-all duration-300"
                            >
                              -
                            </button>
                            <span className="text-white font-medium text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gradient-to-r from-rose-600/80 to-rose-400/80 hover:from-rose-500 hover:to-rose-300 text-white px-4 py-2 rounded-lg font-light transition-all duration-300"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Botones de Acción */}
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => {
                                updateItemDetails(item.id, editValues);
                                setEditingItem(null);
                                setEditValues({});
                              }}
                              className="flex-1 bg-gradient-to-r from-green-600/80 to-green-400/80 hover:from-green-500 hover:to-green-300 text-white px-4 py-2 rounded-lg font-light transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <FaCheck /> Guardar
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(null);
                                setEditValues({});
                              }}
                              className="flex-1 bg-gradient-to-r from-gray-700/80 to-gray-600/80 hover:from-gray-600 hover:to-gray-500 text-white px-4 py-2 rounded-lg font-light transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <FaTimes /> Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            {hasEditableOptions(item) ? (
                              <button
                                onClick={() => {
                                  console.log('Iniciando edición para item:', item.id);
                                  console.log('Estructura del item completa:', JSON.stringify(item, null, 2));
                                  setEditingItem(item.id);
                                  setEditValues({
                                    selectedSize: item.selectedSize,
                                    selectedColor: item.selectedColor,
                                    quantity: item.quantity
                                  });
                                }}
                                className="flex-1 bg-gradient-to-r from-blue-600/80 to-blue-400/80 hover:from-blue-500 hover:to-blue-300 text-white px-4 py-2 rounded-lg font-light transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                <FaEdit /> Editar
                              </button>
                            ) : (
                              <div className="flex-1 bg-gray-700/50 text-gray-400 px-4 py-2 rounded-lg font-light text-center text-sm border border-gray-600/30">
                                Sin opciones editables
                              </div>
                            )}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex-1 bg-gradient-to-r from-red-600/80 to-red-400/80 hover:from-red-500 hover:to-red-300 text-white px-4 py-2 rounded-lg font-light transition-all duration-300"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 text-center border border-rose-600/20 shadow-lg shadow-rose-500/20">
              <h3 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-rose-400 mb-6">Total: ${getTotal().toFixed(2)}</h3>
              <div className="flex justify-center">
                <Link href="/checkout">
                  <button className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-light py-3 px-12 rounded-lg transition-all duration-300 transform hover:scale-105">
                    Proceder al Pago
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
    </LuxuryBackground>
  );
}

