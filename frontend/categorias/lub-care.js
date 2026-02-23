import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProducts } from '../components/ProductsContext';
import { useCart } from '../components/CartContext';

export default function LubCare() {
  const router = useRouter();
  const { products, fetchProducts } = useProducts();
  const { addToCart } = useCart();
  const filteredProducts = products.filter(product => product.category === 'lub-care');

  useEffect(() => {
    const handleFocus = () => fetchProducts();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProducts.map((product) => (
        <div 
          key={product.id} 
          onClick={() => router.push(`/producto/${product.id}`)}
          className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-rose-600/20 hover:border-rose-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/20 hover:scale-105 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="overflow-hidden rounded-lg mb-4">
              <img 
                src={product.image.startsWith('http') ? product.image : `/images/${product.image}`} 
                alt={product.name} 
                className="w-full h-48 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300" 
                onError={(e) => e.target.src = '/images/cat1.jpg'} 
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-white group-hover:from-rose-200 group-hover:via-rose-400 group-hover:to-rose-200 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{product.name}</h3>
            <p className="text-gray-300 mb-4 line-clamp-2">{product.description}</p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-rose-400 font-bold text-3xl mb-4 drop-shadow-[0_0_15px_rgba(251,113,133,0.6)] animate-pulse">${parseFloat(product.price).toLocaleString('es-CO')}</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }} 
              className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-rose-500/30 hover:shadow-rose-400/50 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
