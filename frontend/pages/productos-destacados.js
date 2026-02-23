import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProductosDestacados() {
  const router = useRouter();
  const productos = [
    { id: 1, name: 'Producto Destacado 1', price: 29.99, image: '/images/prod1.jpg' },
    { id: 2, name: 'Producto Destacado 2', price: 39.99, image: '/images/prod2.jpg' },
    { id: 3, name: 'Producto Destacado 3', price: 49.99, image: '/images/prod3.jpg' },
    { id: 4, name: 'Producto Destacado 4', price: 19.99, image: '/images/prod1.jpg' },
    { id: 5, name: 'Producto Destacado 5', price: 59.99, image: '/images/prod2.jpg' },
    { id: 6, name: 'Producto Destacado 6', price: 24.99, image: '/images/prod3.jpg' },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-pink-400 mb-8">Productos Destacados</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((prod) => (
            <div 
              key={prod.id} 
              onClick={() => router.push(`/producto/${prod.id}`)}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-500 transform hover:scale-105 cursor-pointer"
            >
              <img src={prod.image} alt={prod.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{prod.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-pink-400">${prod.price}</span>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gradient-to-r from-pink-400 to-pink-300 hover:from-pink-500 hover:to-pink-400 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-110"
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}