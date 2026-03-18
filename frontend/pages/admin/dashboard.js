import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import LuxuryBackground from '../../components/LuxuryBackground';
import { API_URL } from '../../config/api';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost_price: '',
    image: '',
    category: '',
    sizes: [],
    colors: [],
    stock: 0,
    video: ''
  });

  // Función helper para formatear rutas de imagen
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/200x200?text=Producto';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
    return `/images/${imageUrl}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/products?includeInactive=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Error al cargar productos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const addSize = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, { size: '', stock: 0, video: '' }] });
  };

  const updateSize = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const removeSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  // Funciones para manejar colores
  const addColor = () => {
    setFormData({ 
      ...formData, 
      colors: [...formData.colors, { 
        color: '', 
        colorCode: '#000000', 
        image: '', 
        sizes: [{ size: '', stock: 0, video: '' }] 
      }] 
    });
  };

  const updateColor = (colorIndex, field, value) => {
    const newColors = [...formData.colors];
    newColors[colorIndex][field] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const removeColor = (colorIndex) => {
    const newColors = formData.colors.filter((_, i) => i !== colorIndex);
    setFormData({ ...formData, colors: newColors });
  };

  const addColorSize = (colorIndex) => {
    const newColors = [...formData.colors];
    newColors[colorIndex].sizes.push({ size: '', stock: 0, video: '' });
    setFormData({ ...formData, colors: newColors });
  };

  const updateColorSize = (colorIndex, sizeIndex, field, value) => {
    const newColors = [...formData.colors];
    newColors[colorIndex].sizes[sizeIndex][field] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const removeColorSize = (colorIndex, sizeIndex) => {
    const newColors = [...formData.colors];
    newColors[colorIndex].sizes = newColors[colorIndex].sizes.filter((_, i) => i !== sizeIndex);
    setFormData({ ...formData, colors: newColors });
  };

  // Funciones para manejar tallas con colores
  const addSizeWithColors = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { 
        size: '', 
        stock: 0, 
        video: '',
        colors: [{ color: '', colorCode: '#000000', image: '' }]
      }]
    });
  };

  const updateSizeField = (sizeIndex, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[sizeIndex][field] = value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const removeSizeWithColors = (sizeIndex) => {
    const newSizes = formData.sizes.filter((_, i) => i !== sizeIndex);
    setFormData({ ...formData, sizes: newSizes });
  };

  const addColorToSize = (sizeIndex) => {
    const newSizes = [...formData.sizes];
    if (!newSizes[sizeIndex].colors) {
      newSizes[sizeIndex].colors = [];
    }
    newSizes[sizeIndex].colors.push({ color: '', colorCode: '#000000', image: '' });
    setFormData({ ...formData, sizes: newSizes });
  };

  const updateSizeColor = (sizeIndex, colorIndex, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[sizeIndex].colors[colorIndex][field] = value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const removeSizeColor = (sizeIndex, colorIndex) => {
    const newSizes = [...formData.sizes];
    newSizes[sizeIndex].colors = newSizes[sizeIndex].colors.filter((_, i) => i !== colorIndex);
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingProduct
        ? `${API_URL}/api/products/${editingProduct.id}`
        : `${API_URL}/api/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      // Enviar colors si existen, de lo contrario enviar sizes
      const dataToSend = {
        ...formData,
        sizes: formData.colors.length > 0 ? formData.colors : formData.sizes
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        fetchProducts();
        setShowModal(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', cost_price: '', image: '', category: '', sizes: [], colors: [], stock: 0, video: '' });
      } else {
        setError('Error al guardar producto');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    let parsedSizes = [];
    let parsedColors = [];
    
    if (product.sizes) {
      const sizesData = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
      // Detectar si es estructura nueva con colores o antigua solo con tallas
      if (Array.isArray(sizesData) && sizesData.length > 0 && sizesData[0].color) {
        parsedColors = sizesData;
      } else {
        parsedSizes = sizesData;
      }
    }
    
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      cost_price: product.cost_price || '',
      image: product.image,
      category: product.category,
      sizes: parsedSizes,
      colors: parsedColors,
      stock: product.stock || 0,
      video: product.video || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          fetchProducts();
        } else {
          setError('Error al eliminar producto');
        }
      } catch (err) {
        setError('Error de conexión');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  if (loading) return (
    <LuxuryBackground>
      <div className="min-h-screen text-white flex items-center justify-center relative z-20">
        <p className="font-light text-xl">Cargando...</p>
      </div>
    </LuxuryBackground>
  );

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white py-24 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-300 tracking-wide">Panel de Administración - Productos</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.href = '/admin/security'}
              className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-light transition-all duration-300 flex items-center transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              <FaShieldAlt className="mr-2" /> Panel de Seguridad
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({ name: '', description: '', price: '', cost_price: '', image: '', category: '', sizes: [], colors: [], stock: 0, video: '' });
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-rose-400/80 to-pink-300/80 hover:from-rose-300 hover:to-amber-200 text-black px-4 py-2 rounded-lg font-light transition-all duration-300 flex items-center transform hover:scale-105 shadow-lg shadow-rose-500/30"
            >
              <FaPlus className="mr-2" /> Agregar Producto
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-rose-500/20 hover:to-pink-400/20 border border-rose-400/30 hover:border-rose-300 text-rose-300 hover:text-rose-200 px-4 py-2 rounded-lg font-light transition-all duration-300 flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Cerrar Sesión
            </button>
          </div>
        </div>

          {error && (
            <div className="bg-red-600/80 backdrop-blur-sm text-white p-4 rounded-lg mb-4 border border-red-400/50">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-black/50 backdrop-blur-sm rounded-lg shadow-lg shadow-rose-400/20 overflow-hidden border border-rose-400/30 hover:shadow-rose-400/40 hover:border-rose-300/50 transition-all duration-300">
                <img src={formatImageUrl(product.image)} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-light text-white mb-2">{product.name}</h3>
                  <p className="text-gray-300 mb-2 font-light text-sm line-clamp-2">{product.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-rose-400/10 border border-rose-400/30 rounded-lg p-2">
                      <p className="text-xs text-rose-300 mb-1">Precio Venta</p>
                      <p className="text-lg font-bold text-rose-300">${product.price}</p>
                    </div>
                    <div className="bg-gray-800/50 border border-pink-400/20 rounded-lg p-2">
                      <p className="text-xs text-pink-200 mb-1">Costo Prod.</p>
                      <p className="text-lg font-light text-white">${product.cost_price || '0.00'}</p>
                    </div>
                  </div>

                  {product.cost_price && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 mb-4">
                      <p className="text-xs text-emerald-400 mb-1">Margen de Ganancia</p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-emerald-400">
                          ${(parseFloat(product.price) - parseFloat(product.cost_price)).toFixed(2)}
                        </p>
                        <p className="text-sm text-emerald-300">
                          {(((parseFloat(product.price) - parseFloat(product.cost_price)) / parseFloat(product.price)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-gradient-to-r from-rose-400/80 to-pink-300/80 hover:from-rose-300 hover:to-pink-200 text-black px-3 py-2 rounded-lg font-light transition-all duration-300 flex items-center shadow-md shadow-rose-400/30"
                    >
                      <FaEdit className="mr-1" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-rose-500/20 hover:to-pink-400/20 border border-rose-400/30 hover:border-rose-300 text-rose-300 hover:text-rose-200 px-3 py-2 rounded-lg font-light transition-all duration-300 flex items-center"
                    >
                      <FaTrash className="mr-1" /> Eliminar
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-black/90 backdrop-blur-md p-8 rounded-xl w-full max-w-6xl border border-rose-400/40 shadow-2xl shadow-rose-400/30 my-8">
                <h2 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-300 mb-6">
                {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
              </h2>
              <form onSubmit={handleSubmit} className="max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Grid de 2 columnas para campos básicos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-light">Nombre</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900/80 backdrop-blur-sm text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-300 font-light"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 font-light">💰 Costo de Producción</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.cost_price}
                        onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900/80 backdrop-blur-sm text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-300 font-light"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 mt-1">Cuánto te cuesta producir/obtener el producto</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-light">💵 Precio de Venta</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900/80 backdrop-blur-sm text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-300 font-light"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Precio final para el cliente</p>
                    </div>
                    <div className="flex items-center justify-center bg-gradient-to-br from-emerald-900/20 to-emerald-700/20 border border-emerald-500/30 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-xs text-emerald-400 mb-1">Margen de Ganancia</p>
                        <p className="text-2xl font-bold text-white">
                          {formData.price && formData.cost_price 
                            ? `$${(parseFloat(formData.price) - parseFloat(formData.cost_price)).toFixed(2)}`
                            : '$0.00'
                          }
                        </p>
                        <p className="text-xs text-emerald-300 mt-1">
                          {formData.price && formData.cost_price && parseFloat(formData.price) > 0
                            ? `${(((parseFloat(formData.price) - parseFloat(formData.cost_price)) / parseFloat(formData.price)) * 100).toFixed(1)}% margen`
                            : '0% margen'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2 font-light">Descripción</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-900/80 backdrop-blur-sm text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-300 font-light"
                      required
                    />
                  </div>

                  {/* Grid de 2 columnas para imagen, categoría y video */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-light">Imagen URL</label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900/80 backdrop-blur-sm text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-300 font-light"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 font-light">Categoría</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900/80 backdrop-blur-sm text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-300 font-light"
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="linea-intima">Línea Íntima</option>
                        <option value="smart-pleasure">Smart Pleasure</option>
                        <option value="lub-care">Lub & Care</option>
                        <option value="power-up">Power Up</option>
                        <option value="zona-fetish">Zona Fetish</option>
                      </select>
                    </div>
                  </div>

                  {formData.category === 'linea-intima' && (
                    <>
                      {/* Nueva estructura: Talla > Stock > Video > Colores */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-gray-300 font-light text-lg">Configuración: Tallas y Colores</label>
                          <button
                            type="button"
                            onClick={addSizeWithColors}
                            className="bg-gradient-to-r from-rose-400/80 to-pink-300/80 hover:from-rose-300 hover:to-pink-200 text-black px-4 py-2 rounded-lg font-light text-sm"
                          >
                            + Agregar Talla
                          </button>
                        </div>
                        
                        <div className="space-y-6">
                          {formData.sizes.map((sizeItem, sizeIndex) => (
                            <div key={sizeIndex} className="p-5 bg-gray-800/50 rounded-lg border border-rose-400/20">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-rose-300 font-light text-lg">Talla: {sizeItem.size || '(sin definir)'}</h4>
                                <button
                                  type="button"
                                  onClick={() => removeSizeWithColors(sizeIndex)}
                                  className="bg-red-600/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-light text-sm transition-all duration-300"
                                >
                                  Eliminar Talla
                                </button>
                              </div>

                              {/* Talla, Stock y Video */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 bg-gray-900/30 p-4 rounded-lg">
                                <div>
                                  <label className="block text-gray-400 text-sm mb-1 font-light">Talla *</label>
                                  <input
                                    type="text"
                                    placeholder="XS, S, M, L, XL"
                                    value={sizeItem.size}
                                    onChange={(e) => updateSizeField(sizeIndex, 'size', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-900/80 text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none font-light text-center text-lg"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-400 text-sm mb-1 font-light">Stock total *</label>
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={sizeItem.stock}
                                    onChange={(e) => updateSizeField(sizeIndex, 'stock', parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 bg-gray-900/80 text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none font-light"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-400 text-sm mb-1 font-light">Video URL (modelo)</label>
                                  <input
                                    type="url"
                                    placeholder="https://..."
                                    value={sizeItem.video}
                                    onChange={(e) => updateSizeField(sizeIndex, 'video', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-900/80 text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none font-light text-sm"
                                  />
                                </div>
                              </div>

                              {/* Colores disponibles para esta talla */}
                              <div className="mt-4 bg-gray-900/30 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                  <label className="block text-gray-400 text-sm font-light">Colores disponibles</label>
                                  <button
                                    type="button"
                                    onClick={() => addColorToSize(sizeIndex)}
                                    className="bg-gradient-to-r from-rose-400/60 to-pink-300/60 hover:from-rose-300 hover:to-pink-200 text-black px-3 py-1 rounded-lg font-light text-sm transition-all duration-300"
                                  >
                                    + Agregar Color
                                  </button>
                                </div>
                                
                                <div className="space-y-3">
                                  {sizeItem.colors && sizeItem.colors.map((colorItem, colorIndex) => (
                                    <div key={colorIndex} className="grid grid-cols-12 gap-2 items-center bg-gray-800/50 p-3 rounded-lg">
                                      <div className="col-span-3">
                                        <label className="block text-gray-500 text-xs mb-1 font-light">Nombre</label>
                                        <input
                                          type="text"
                                          placeholder="Rojo, Negro..."
                                          value={colorItem.color}
                                          onChange={(e) => updateSizeColor(sizeIndex, colorIndex, 'color', e.target.value)}
                                          className="w-full px-3 py-2 bg-gray-900/80 text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none font-light text-sm"
                                        />
                                      </div>
                                      <div className="col-span-2">
                                        <label className="block text-gray-500 text-xs mb-1 font-light">Código</label>
                                        <div className="flex items-center gap-1">
                                          <input
                                            type="color"
                                            value={colorItem.colorCode}
                                            onChange={(e) => updateSizeColor(sizeIndex, colorIndex, 'colorCode', e.target.value)}
                                            className="w-10 h-10 bg-gray-900/80 rounded-lg border border-rose-400/30 cursor-pointer"
                                          />
                                          <input
                                            type="text"
                                            value={colorItem.colorCode}
                                            onChange={(e) => updateSizeColor(sizeIndex, colorIndex, 'colorCode', e.target.value)}
                                            className="flex-1 px-2 py-2 bg-gray-900/80 text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none font-light text-xs"
                                            placeholder="#000"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-span-6">
                                        <label className="block text-gray-500 text-xs mb-1 font-light">Imagen del producto en este color</label>
                                        <input
                                          type="url"
                                          placeholder="URL de la imagen"
                                          value={colorItem.image}
                                          onChange={(e) => updateSizeColor(sizeIndex, colorIndex, 'image', e.target.value)}
                                          className="w-full px-3 py-2 bg-gray-900/80 text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none font-light text-sm"
                                        />
                                      </div>
                                      <div className="col-span-1">
                                        <label className="block text-gray-500 text-xs mb-1 font-light">&nbsp;</label>
                                        <button
                                          type="button"
                                          onClick={() => removeSizeColor(sizeIndex, colorIndex)}
                                          className="w-full bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-red-600/40 hover:to-red-400/40 border border-rose-400/30 text-rose-300 hover:text-red-400 px-2 py-2 rounded-lg font-light transition-all duration-300"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  {(!sizeItem.colors || sizeItem.colors.length === 0) && (
                                    <p className="text-gray-500 text-sm text-center py-2 font-light">Sin colores. Click en "Agregar Color"</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          {formData.sizes.length === 0 && (
                            <div className="text-center py-8 text-gray-500 font-light">
                              <p>No hay tallas configuradas.</p>
                              <p className="text-sm mt-2">Click en "+ Agregar Talla" para comenzar</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Stock y video para otras categorías */}
                  {formData.category !== 'linea-intima' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-300 mb-2 font-light">Stock</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-gray-900/80 backdrop-blur-sm text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-300 font-light"
                          placeholder="Cantidad en stock"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 font-light">Video URL (opcional)</label>
                        <input
                          type="url"
                          value={formData.video}
                          onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-900/80 backdrop-blur-sm text-white rounded-lg border border-rose-400/30 focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-300 font-light"
                          placeholder="URL del video del producto"
                        />
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-rose-400/20">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-rose-400/20 hover:to-pink-300/20 border border-rose-400/30 hover:border-rose-300 text-rose-300 hover:text-rose-200 px-8 py-3 rounded-lg font-light transition-all duration-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-rose-400/80 to-pink-300/80 hover:from-rose-300 hover:to-pink-200 text-black px-8 py-3 rounded-lg font-light transition-all duration-300 transform hover:scale-105"
                    >
                      {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </LuxuryBackground>
  );
}



