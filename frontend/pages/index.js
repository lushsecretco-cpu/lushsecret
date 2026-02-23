import { API_URL } from '../../config/api';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Slider from '../components/Slider';
import LuxuryBackground from '../components/LuxuryBackground';
import { FaShieldAlt, FaCreditCard, FaHeadset } from 'react-icons/fa';
import { useCart } from '../components/CartContext';
import { usePageTracking } from '../hooks/useAnalytics';

export default function Home() {
  const { addItem } = useCart();
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState({});
  const [loading, setLoading] = useState(true);

  // Tracking de página de inicio
  usePageTracking('Página de Inicio');

  // Función helper para formatear rutas de imagen
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/200x200?text=Producto';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
    return `/images/${imageUrl}`;
  };

  const categorias = [
    { name: 'Línea Íntima', slug: 'linea-intima', link: '/categoria/linea-intima', image: '/images/cat1.jpg' },
    { name: 'Smart Pleasure', slug: 'smart-pleasure', link: '/categoria/smart-pleasure', image: '/images/cat2.jpg' },
    { name: 'Lub & Care', slug: 'lub-care', link: '/categoria/lub-care', image: '/images/cat3.jpg' },
    { name: 'Power Up', slug: 'power-up', link: '/categoria/power-up', image: '/images/cat4.jpg' },
    { name: 'Zona Fetish', slug: 'zona-fetish', link: '/categoria/zona-fetish', image: '/images/cat5.jpg' },
  ];

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      // Cargar productos destacados (3 más vistos globalmente)
      const destacadosResponse = await fetch(`${API_URL}/api/analytics/most-viewed?limit=3`);
      const destacadosData = await destacadosResponse.json();
      setProductosDestacados(destacadosData);
      
      // Cargar productos más vistos por categoría
      const porCategoria = {};
      await Promise.all(
        categorias.map(async (cat) => {
          const response = await fetch(`${API_URL}/api/analytics/most-viewed?category=${cat.slug}&limit=3`);
          const data = await response.json();
          porCategoria[cat.slug] = data;
        })
      );
      setProductosPorCategoria(porCategoria);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setLoading(false);
    }
  };

  return (
    <LuxuryBackground>
      <main className="min-h-screen text-white relative">
        {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <video
                className="w-full max-w-3xl mx-auto rounded-xl shadow-2xl shadow-rose-500/10 border border-rose-600/20"
                autoPlay
                muted
                loop
                poster="https://via.placeholder.com/800x400?text=Presentacion"
              >
                <source src="/videos/presentacion.mp4" type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-6 animate-fade-in tracking-wider drop-shadow-[0_0_30px_rgba(251,113,133,0.5)] hover:drop-shadow-[0_0_50px_rgba(251,113,133,0.8)] transition-all duration-700">
                Explora Placer, Estilo y Discreción
              </h1>
              <p className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-rose-300/90 via-rose-400/90 to-rose-300/90 font-light mb-8 tracking-wide italic animate-pulse">
                en un solo lugar de lujo.
              </p>
              <p className="text-xl text-gray-200 font-light mb-8 tracking-wide leading-relaxed">
                Productos exclusivos, envíos discretos y pagos seguros. <span className="text-rose-300 font-semibold drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]">Vive la experiencia LushSecret.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compra Segura */}
      <section className="py-16 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-block p-6 rounded-full bg-gradient-to-br from-rose-500/10 to-rose-600/10 mb-4 group-hover:from-rose-500/20 group-hover:to-rose-600/20 transition-all duration-300">
                <FaShieldAlt className="text-6xl text-rose-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]" />
              </div>
              <h3 className="text-2xl font-light mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 group-hover:drop-shadow-[0_0_20px_rgba(251,113,133,0.8)] transition-all duration-300">Paquetes sin logos ni etiquetas visibles</h3>
              <p className="text-gray-300 text-sm tracking-wide">Discreción absoluta en cada entrega</p>
            </div>
            <div className="text-center group">
              <div className="inline-block p-6 rounded-full bg-gradient-to-br from-rose-500/10 to-rose-600/10 mb-4 group-hover:from-rose-500/20 group-hover:to-rose-600/20 transition-all duration-300">
                <FaCreditCard className="text-6xl text-rose-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]" />
              </div>
              <h3 className="text-2xl font-light mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 group-hover:drop-shadow-[0_0_20px_rgba(251,113,133,0.8)] transition-all duration-300">Métodos de pago flexibles</h3>
              <p className="text-gray-300 text-sm tracking-wide">Seguridad total en tus transacciones</p>
            </div>
            <div className="text-center group">
              <div className="inline-block p-6 rounded-full bg-gradient-to-br from-rose-500/10 to-rose-600/10 mb-4 group-hover:from-rose-500/20 group-hover:to-rose-600/20 transition-all duration-300">
                <FaHeadset className="text-6xl text-rose-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]" />
              </div>
              <h3 className="text-2xl font-light mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 group-hover:drop-shadow-[0_0_20px_rgba(251,113,133,0.8)] transition-all duration-300">Atención personalizada</h3>
              <p className="text-gray-300 text-sm tracking-wide">Soporte exclusivo para ti</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extralight text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-12 tracking-wider drop-shadow-[0_0_25px_rgba(251,113,133,0.6)] hover:scale-105 transition-all duration-500 cursor-default">Explora Nuestras Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categorias.map((cat, index) => (
              <a 
                key={index} 
                href={cat.link} 
                className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-4 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/20 hover:scale-105 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform duration-300" />
                  <h3 className="text-lg font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 group-hover:from-rose-200 group-hover:via-rose-400 group-hover:to-rose-200 transition-all duration-300 drop-shadow-[0_0_10px_rgba(251,113,133,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(251,113,133,0.8)]">{cat.name}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Slider de Publicidades */}
      <Slider />

      {/* Productos Destacados */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extralight text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mb-6 tracking-wider drop-shadow-[0_0_25px_rgba(251,113,133,0.6)] hover:scale-105 transition-all duration-500 cursor-default">Productos Más Vistos</h2>
          <div className="flex justify-center mb-8">
            <a href="/productos-destacados" className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-rose-400 hover:from-rose-300 hover:via-rose-500 hover:to-rose-300 underline decoration-rose-400/50 hover:decoration-rose-400 font-light tracking-wide transition-all duration-300 drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]">Ver todos →</a>
          </div>
          {loading ? (
            <div className="text-center text-gray-300 py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto"></div>
              <p className="mt-4">Cargando productos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productosDestacados.map((prod) => (
                <div 
                  key={prod.id} 
                  className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/20 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <Link href={`/producto/${prod.id}`}>
                      <div className="overflow-hidden rounded-lg mb-4 cursor-pointer">
                        <img 
                          src={formatImageUrl(prod.image_url || prod.image)} 
                          alt={prod.name} 
                          className="w-full h-48 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    </Link>
                    <Link href={`/producto/${prod.id}`}>
                      <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-white group-hover:from-rose-200 group-hover:via-rose-400 group-hover:to-rose-200 transition-all duration-300 cursor-pointer drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{prod.name}</h3>
                    </Link>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-rose-400 font-bold text-3xl mb-4 drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]">${parseFloat(prod.price).toLocaleString('es-CO')}</p>
                    <Link href={`/producto/${prod.id}`}>
                      <button className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-400/50 transition-all duration-300 transform hover:-translate-y-0.5">
                        Ver Producto
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categorías con Productos */}
      {!loading && categorias.map((categoria) => {
        const productos = productosPorCategoria[categoria.slug] || [];
        if (productos.length === 0) return null;
        
        return (
          <section key={categoria.slug} className="py-16 bg-black/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl md:text-4xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 tracking-wider drop-shadow-[0_0_20px_rgba(251,113,133,0.5)] hover:scale-105 transition-all duration-500">{categoria.name}</h2>
                <a href={categoria.link} className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-rose-400 hover:from-rose-300 hover:via-rose-500 hover:to-rose-300 underline decoration-rose-400/50 hover:decoration-rose-400 font-light tracking-wide transition-all duration-300 drop-shadow-[0_0_12px_rgba(251,113,133,0.5)]">
                  Ver todos →
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {productos.map((prod) => (
                  <div 
                    key={prod.id} 
                    className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/20 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <Link href={`/producto/${prod.id}`}>
                        <div className="overflow-hidden rounded-lg mb-4 cursor-pointer">
                          <img 
                            src={formatImageUrl(prod.image_url || prod.image)} 
                            alt={prod.name} 
                            className="w-full h-48 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300" 
                          />
                        </div>
                      </Link>
                      <Link href={`/producto/${prod.id}`}>
                        <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-white group-hover:from-rose-200 group-hover:via-rose-400 group-hover:to-rose-200 transition-all duration-300 cursor-pointer drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{prod.name}</h3>
                      </Link>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{prod.description}</p>
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-rose-400 font-bold text-3xl mb-4 drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]">${parseFloat(prod.price).toLocaleString('es-CO')}</p>
                      <Link href={`/producto/${prod.id}`}>
                        <button className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-400/50 transition-all duration-300 transform hover:-translate-y-0.5">
                          Ver Producto
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
      </main>
    </LuxuryBackground>
  );
}

