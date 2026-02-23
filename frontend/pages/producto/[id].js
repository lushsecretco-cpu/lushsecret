import { API_URL } from '../../config/api';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import LuxuryBackground from '../../components/LuxuryBackground';
import { useCart } from '../../components/CartContext';
import { FaShoppingCart, FaShoppingBag, FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useProductTracking, trackAddToCart } from '../../hooks/useAnalytics';

export default function ProductoDetalle() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideos, setShowVideos] = useState(false);
  const videoRef = useRef(null);

  // Tracking de vista de producto
  useProductTracking(producto);

  // Función helper para formatear rutas de imagen
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/cat1.jpg';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
    return `/images/${imageUrl}`;
  };

  useEffect(() => {
    if (id) {
      fetchProducto();
    }
  }, [id]);

  // Efecto para establecer el primer video cuando el producto se carga
  useEffect(() => {
    if (producto && !selectedVideo) {
      // Si tiene colores, buscar video en el color seleccionado
      if (producto.hasColors && selectedColor) {
        if (selectedColor.sizes && selectedColor.sizes.length > 0) {
          const firstVideoSize = selectedColor.sizes.find(s => s.video && s.video.trim() !== '');
          if (firstVideoSize) {
            setSelectedVideo({ 
              size: firstVideoSize.size, 
              url: firstVideoSize.video, 
              label: `${selectedColor.color} - Talla ${firstVideoSize.size}`,
              color: selectedColor.color
            });
            return;
          }
        }
      } 
      // Si no tiene colores, buscar en las tallas individuales
      else if (producto.sizes && producto.sizes.length > 0 && typeof producto.sizes[0] === 'object') {
        const firstVideoSize = producto.sizes.find(s => s.video && s.video.trim() !== '');
        if (firstVideoSize) {
          setSelectedVideo({ 
            size: firstVideoSize.size, 
            url: firstVideoSize.video, 
            label: `Talla ${firstVideoSize.size}` 
          });
          return;
        }
      }
      
      // Si no hay videos en las tallas pero existe producto.video, usar ese
      if (producto.video && producto.video.trim() !== '') {
        if (producto.sizes && producto.sizes.length > 0) {
          const firstSizeValue = typeof producto.sizes[0] === 'object' ? producto.sizes[0].size : producto.sizes[0];
          setSelectedVideo({ 
            size: firstSizeValue, 
            url: producto.video, 
            label: `Talla ${firstSizeValue}` 
          });
        } else {
          setSelectedVideo({ 
            size: 'S', 
            url: producto.video, 
            label: 'Talla S' 
          });
        }
      }
    }
  }, [producto, selectedColor]);

  // Debug: Log cuando cambia el color seleccionado
  useEffect(() => {
    if (selectedColor) {
      console.log('Color seleccionado:', selectedColor);
      console.log('Imagen del color:', selectedColor.image);
    }
  }, [selectedColor]);

  // Efecto para manejar el autoplay del video
  useEffect(() => {
    if (!videoRef.current || !selectedVideo) return;

    const video = videoRef.current;
    
    // Intentar reproducir el video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Autoplay bloqueado, intentando con muted:', error);
        // Si falla el autoplay, intentar con muted
        video.muted = true;
        video.play().catch(e => {
          console.error('Error al reproducir video:', e);
        });
      });
    }
  }, [selectedVideo]);

  // Función para convertir URL de iframe de Bunny.net a URL directa de video
  const convertBunnyUrlToDirectVideo = (url) => {
    // Si ya es una URL directa de video, retornarla
    if (url.includes('.mp4') || url.includes('.webm') || url.includes('b-cdn.net/')) {
      return url;
    }
    
    // Extraer el video ID de URLs de Bunny.net
    // Formatos: 
    // https://iframe.mediadelivery.net/play/603660/b452262c-4890-473c-b7e1-8950b3185b67
    // https://iframe.mediadelivery.net/embed/603660/b452262c-4890-473c-b7e1-8950b3185b67
    const match = url.match(/\/(?:play|embed)\/(\d+)\/([a-f0-9\-]+)/i);
    
    if (match && match[1] && match[2]) {
      const libraryId = match[1];
      const videoId = match[2];
      // Retornar URL directa al video MP4 (resolución '720p' por defecto)
      return `https://vz-0d601d84-104.b-cdn.net/${videoId}/play_720p.mp4`;
    }
    
    return url;
  };

  const fetchProducto = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`);
      const data = await response.json();
      
      // Procesar tallas/colores si son un string JSON
      if (data.sizes && typeof data.sizes === 'string') {
        try {
          data.sizes = JSON.parse(data.sizes);
        } catch (e) {
          data.sizes = [];
        }
      } else if (!data.sizes) {
        data.sizes = [];
      }

      // Detectar si tiene estructura de colores
      if (data.sizes && data.sizes.length > 0) {
        const firstItem = data.sizes[0];
        
        // CASO 1: Estructura color-first - cada elemento tiene color directamente
        if (firstItem && typeof firstItem === 'object' && (firstItem.color || firstItem.colorCode)) {
          data.hasColors = true;
          data.colors = data.sizes;
          // Seleccionar primer color por defecto
          setSelectedColor(data.colors[0]);
          if (data.colors[0].sizes && data.colors[0].sizes.length > 0) {
            setSelectedSize(data.colors[0].sizes[0].size);
          }
        } 
        // CASO 2: Estructura size-first con colores - cada talla tiene array de colores
        else if (firstItem && typeof firstItem === 'object' && firstItem.colors && Array.isArray(firstItem.colors) && firstItem.colors.length > 0) {
          data.hasColors = true;
          
          // Transformar estructura: agrupar por color en lugar de por talla
          const colorMap = new Map();
          
          data.sizes.forEach(sizeItem => {
            if (sizeItem.colors && Array.isArray(sizeItem.colors)) {
              sizeItem.colors.forEach(colorItem => {
                const colorKey = colorItem.color || 'default';
                
                if (!colorMap.has(colorKey)) {
                  colorMap.set(colorKey, {
                    color: colorItem.color,
                    colorCode: colorItem.colorCode,
                    image: colorItem.image,
                    sizes: []
                  });
                }
                
                // Agregar esta talla al color
                colorMap.get(colorKey).sizes.push({
                  size: sizeItem.size,
                  stock: sizeItem.stock,
                  video: sizeItem.video
                });
              });
            }
          });
          
          // Convertir Map a array
          data.colors = Array.from(colorMap.values());
          
          // Seleccionar primer color por defecto
          if (data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
            if (data.colors[0].sizes && data.colors[0].sizes.length > 0) {
              setSelectedSize(data.colors[0].sizes[0].size);
            }
          }
        } 
        // CASO 3: Estructura simple con tallas (sin colores)
        else {
          data.hasColors = false;
          const firstSize = typeof firstItem === 'object' ? firstItem.size : firstItem;
          setSelectedSize(firstSize);
        }
      } else {
        data.hasColors = false;
      }
      
      setProducto(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!producto) return;
    
    // Validar que se haya seleccionado talla si es necesario
    if (!selectedSize) {
      return; // El botón ya muestra el mensaje
    }
    
    if (producto.hasColors && !selectedColor) {
      return; // El botón ya muestra el mensaje
    }
    
    const productToAdd = {
      ...producto,
      quantity: quantity,
      selectedSize: selectedSize,
      selectedColor: selectedColor ? selectedColor.color : null,
      selectedColorCode: selectedColor ? selectedColor.colorCode : null,
      // Usar la imagen del color seleccionado si existe
      image: selectedColor && selectedColor.image ? selectedColor.image : producto.image,
      // IMPORTANTE: Asegurar que sizes, colors y hasColors estén presentes para edición posterior
      sizes: producto.sizes || [],
      colors: producto.colors || [],
      hasColors: producto.hasColors || false
    };
    
    console.log('🛒 Agregando al carrito:', {
      id: productToAdd.id,
      name: productToAdd.name,
      hasColors: productToAdd.hasColors,
      sizesCount: productToAdd.sizes?.length || 0,
      colorsCount: productToAdd.colors?.length || 0,
      selectedSize: productToAdd.selectedSize,
      selectedColor: productToAdd.selectedColor
    });
    
    // Tracking de agregado al carrito
    trackAddToCart({
      id: producto.id,
      name: producto.name,
      category: producto.category,
      price: producto.price,
      quantity: quantity,
      selectedSize: selectedSize,
      selectedColor: selectedColor ? selectedColor.color : null
    });
    
    addToCart(productToAdd);
  };

  const handleBuyNow = () => {
    if (!producto) return;
    
    // Validar que se haya seleccionado talla si es necesario
    if (!selectedSize) {
      return; // El botón ya muestra el mensaje
    }
    
    if (producto.hasColors && !selectedColor) {
      return; // El botón ya muestra el mensaje
    }
    
    const productToAdd = {
      ...producto,
      quantity: quantity,
      selectedSize: selectedSize,
      selectedColor: selectedColor ? selectedColor.color : null,
      selectedColorCode: selectedColor ? selectedColor.colorCode : null,
      // Usar la imagen del color seleccionado si existe
      image: selectedColor && selectedColor.image ? selectedColor.image : producto.image,
      // IMPORTANTE: Asegurar que sizes, colors y hasColors estén presentes para edición posterior
      sizes: producto.sizes || [],
      colors: producto.colors || [],
      hasColors: producto.hasColors || false
    };
    
    addToCart(productToAdd);
    router.push('/carrito');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= producto.stock) {
      setQuantity(newQuantity);
    }
  };

  if (!router.isReady || loading) {
    return (
      <LuxuryBackground>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-300">Cargando producto...</p>
        </div>
      </LuxuryBackground>
    );
  }

  if (!producto) {
    return (
      <LuxuryBackground>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-300">Producto no encontrado</p>
        </div>
      </LuxuryBackground>
    );
  }

  // Videos de modelos por talla
  let videosModelos = [];
  let hasVideos = false;
  
  // Si tiene colores, construir videos del color seleccionado
  if (producto.hasColors && selectedColor) {
    if (selectedColor.sizes && selectedColor.sizes.length > 0) {
      videosModelos = selectedColor.sizes
        .filter(s => s.video && s.video.trim() !== '')
        .map(s => ({ 
          size: s.size, 
          url: s.video, 
          label: `${selectedColor.color} - ${s.size}`,
          color: selectedColor.color
        }));
      
      if (videosModelos.length > 0) {
        hasVideos = true;
      }
    }
  }
  // Si no tiene colores, verificar si hay videos en las tallas individuales
  else if (producto.sizes && producto.sizes.length > 0 && typeof producto.sizes[0] === 'object') {
    videosModelos = producto.sizes
      .filter(s => s.video && s.video.trim() !== '')
      .map(s => ({ size: s.size, url: s.video, label: `Talla ${s.size}` }));
    
    if (videosModelos.length > 0) {
      hasVideos = true;
    }
  }
  
  // Si no hay videos en las tallas pero existe producto.video, usar ese para todas las tallas
  if (videosModelos.length === 0 && producto.video && producto.video.trim() !== '') {
    hasVideos = true;
    const sizesToUse = producto.hasColors && selectedColor ? selectedColor.sizes : producto.sizes;
    
    if (sizesToUse && sizesToUse.length > 0) {
      videosModelos = sizesToUse.map(sizeItem => {
        const sizeValue = typeof sizeItem === 'object' ? sizeItem.size : sizeItem;
        const label = producto.hasColors && selectedColor 
          ? `${selectedColor.color} - ${sizeValue}`
          : `Talla ${sizeValue}`;
        return { 
          size: sizeValue, 
          url: producto.video, 
          label,
          color: selectedColor?.color 
        };
      });
    } else {
      // Si no hay tallas definidas, usar tallas por defecto
      videosModelos = [
        { size: 'S', url: producto.video, label: 'Talla S' },
        { size: 'M', url: producto.video, label: 'Talla M' },
        { size: 'L', url: producto.video, label: 'Talla L' },
      ];
    }
  }

  return (
    <LuxuryBackground>
      <div className="container mx-auto px-4 py-12">
        {/* Botón volver */}
        <button
          onClick={() => router.back()}
          className="mb-8 text-rose-400 hover:text-rose-300 font-light flex items-center transition-colors duration-300"
        >
          ← Volver a categoría
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna izquierda - Imagen y Videos */}
          <div className="space-y-6">
            {/* Imagen principal */}
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20">
              <img
                key={selectedColor ? selectedColor.color : 'default'}
                src={formatImageUrl(
                  producto.hasColors && selectedColor && selectedColor.image
                    ? selectedColor.image
                    : producto.image
                )}
                alt={selectedColor ? `${producto.name} - ${selectedColor.color}` : producto.name}
                className="w-full h-[600px] object-contain rounded-lg transition-all duration-300"
                onError={(e) => {
                  console.error('Error cargando imagen:', e.target.src);
                  e.target.src = '/images/cat1.jpg';
                }}
              />
              {producto.hasColors && selectedColor && (
                <div className="absolute top-8 right-8 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-rose-500/30">
                  <span className="text-rose-400 font-light">{selectedColor.color}</span>
                </div>
              )}
            </div>

            {/* Botón para mostrar/ocultar videos */}
            {hasVideos && (
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20">
                <button
                  onClick={() => setShowVideos(!showVideos)}
                  className="w-full flex items-center justify-between text-xl font-light text-rose-400 mb-4 hover:text-rose-300 transition-colors duration-300"
                >
                  <span>Videos - Modelos por talla</span>
                  {showVideos ? <FaChevronUp className="text-lg" /> : <FaChevronDown className="text-lg" />}
                </button>
                
                {/* Contenido desplegable de videos */}
                {showVideos && (
                  <div className="space-y-4">
                    {/* Selector de talla para videos */}
                    <div className="flex gap-2 mb-4">
                  {videosModelos.map((video) => (
                    <button
                      key={video.size}
                      onClick={() => setSelectedVideo(video)}
                      className={`px-4 py-2 rounded-lg font-light transition-all duration-300 ${
                        selectedVideo?.size === video.size
                          ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {video.label}
                    </button>
                  ))}
                </div>

                {/* Video player */}
                {selectedVideo && (
                  <div 
                    className="relative rounded-lg overflow-hidden bg-black mx-auto" 
                    style={{ 
                      width: '100%',
                      maxWidth: '500px',
                      height: '710px'
                    }}
                  >
                    <video
                      ref={videoRef}
                      key={selectedVideo.url}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                      autoPlay
                      loop
                      muted={false}
                      playsInline
                      controls={false}
                      poster={formatImageUrl(producto.image)}
                    >
                      <source src={convertBunnyUrlToDirectVideo(selectedVideo.url)} type="video/mp4" />
                      Tu navegador no soporta el elemento de video.
                    </video>
                    <style jsx>{`
                      video::-webkit-media-controls {
                        display: none !important;
                      }
                      video::-webkit-media-controls-enclosure {
                        display: none !important;
                      }
                      video::-webkit-media-controls-panel {
                        display: none !important;
                      }
                    `}</style>
                  </div>
                )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Columna derecha - Información del producto */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-8 border border-rose-600/20">
              {/* Nombre */}
              <h1 className="text-4xl font-light text-white mb-4 tracking-wide">{producto.name}</h1>

              {/* Precio */}
              <div className="mb-6">
                <span className="text-5xl font-light text-rose-400">
                  ${parseFloat(producto.price).toLocaleString('es-CO')}
                </span>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h3 className="text-lg font-light text-rose-400 mb-2">Descripción</h3>
                <p className="text-gray-300 font-light leading-relaxed">{producto.description}</p>
              </div>

              {/* Stock disponible */}
              <div className="mb-6 flex items-center">
                {producto.stock > 0 ? (
                  <>
                    <FaCheck className="text-green-400 mr-2" />
                    <span className="text-green-400 font-light">
                      {producto.stock} unidades disponibles
                    </span>
                  </>
                ) : (
                  <>
                    <FaTimes className="text-red-400 mr-2" />
                    <span className="text-red-400 font-light">Agotado</span>
                  </>
                )}
              </div>

              {/* Selector de color (si tiene colores) */}
              {producto.hasColors && producto.colors && producto.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-light text-rose-400 mb-3">Selecciona tu color</h3>
                  <div className="flex gap-3 flex-wrap">
                    {producto.colors.map((colorItem, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedColor(colorItem);
                          // Seleccionar primera talla del nuevo color
                          if (colorItem.sizes && colorItem.sizes.length > 0) {
                            setSelectedSize(colorItem.sizes[0].size);
                          }
                          // Actualizar video si existe
                          const firstVideoSize = colorItem.sizes?.find(s => s.video && s.video.trim() !== '');
                          if (firstVideoSize) {
                            setSelectedVideo({
                              size: firstVideoSize.size,
                              url: firstVideoSize.video,
                              label: `${colorItem.color} - Talla ${firstVideoSize.size}`,
                              color: colorItem.color
                            });
                          }
                        }}
                        className={`relative px-6 py-3 rounded-lg font-light transition-all duration-300 border-2 ${
                          selectedColor?.color === colorItem.color
                            ? 'border-rose-400 shadow-lg shadow-rose-500/30'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${colorItem.colorCode}dd 0%, ${colorItem.colorCode}aa 100%)`
                        }}
                      >
                        <span className="relative z-10 text-white drop-shadow-lg font-medium">
                          {colorItem.color}
                        </span>
                        {selectedColor?.color === colorItem.color && (
                          <div className="absolute inset-0 bg-rose-400/20 rounded-lg"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de talla */}
              {((producto.hasColors && selectedColor?.sizes && selectedColor.sizes.length > 0) || 
                (!producto.hasColors && producto.sizes && producto.sizes.length > 0)) && (
                <div className="mb-6">
                  <h3 className="text-lg font-light text-rose-400 mb-3">Selecciona tu talla</h3>
                  <div className="flex gap-2 flex-wrap">
                    {(producto.hasColors ? selectedColor.sizes : producto.sizes).map((sizeItem, index) => {
                      // Extraer el valor de talla (puede ser string u objeto)
                      const sizeValue = typeof sizeItem === 'object' ? sizeItem.size : sizeItem;
                      const sizeStock = typeof sizeItem === 'object' ? sizeItem.stock : producto.stock;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(sizeValue)}
                          disabled={sizeStock === 0}
                          className={`px-6 py-3 rounded-lg font-light transition-all duration-300 ${
                            selectedSize === sizeValue
                              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/30'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                        >
                          {sizeValue}
                          {typeof sizeItem === 'object' && sizeStock > 0 && (
                            <span className="ml-2 text-xs">({sizeStock})</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selector de cantidad */}
              <div className="mb-6">
                <h3 className="text-lg font-light text-rose-400 mb-3">Cantidad</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-12 h-12 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    -
                  </button>
                  <span className="text-2xl font-light text-white w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= producto.stock}
                    className="w-12 h-12 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || (producto.hasColors && !selectedColor)}
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:from-gray-600 disabled:to-gray-500 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-400/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  <FaShoppingCart />
                  {!selectedSize ? 'Selecciona una talla' : (producto.hasColors && !selectedColor) ? 'Selecciona un color' : 'Agregar al Carrito'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!selectedSize || (producto.hasColors && !selectedColor)}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-400 hover:to-rose-300 disabled:from-gray-500 disabled:to-gray-400 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-lg shadow-lg shadow-rose-400/30 hover:shadow-rose-300/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  <FaShoppingBag />
                  {!selectedSize ? 'Selecciona una talla' : (producto.hasColors && !selectedColor) ? 'Selecciona un color' : 'Comprar Ahora'}
                </button>
              </div>

              {/* Información adicional */}
              {producto.brand && (
                <div className="mt-6 pt-6 border-t border-rose-600/20">
                  <p className="text-gray-400 font-light">
                    <span className="text-rose-400">Marca:</span> {producto.brand}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LuxuryBackground>
  );
}

