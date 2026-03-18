import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaWhatsapp } from 'react-icons/fa';
import { CartProvider } from '../components/CartContext';
import { ProductsProvider } from '../components/ProductsContext';

export default function App({ Component, pageProps }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lushsecret.co';
  const defaultTitle = 'LushSecret - Explora placer, estilo y discreción';
  const defaultDescription = 'Productos seleccionados, envíos discretos y pagos seguros. Vive la experiencia LushSecret.';
  const defaultImage = `${baseUrl}/images/og-image.jpg`;

  return (
    <CartProvider>
      <ProductsProvider>
        <Head>
          <title>{defaultTitle}</title>
          <meta name="description" content={defaultDescription} />
          <link rel="canonical" href={baseUrl} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#000000" />
          <meta property="og:title" content={defaultTitle} />
          <meta property="og:description" content={defaultDescription} />
          <meta property="og:image" content={defaultImage} />
          <meta property="og:url" content={baseUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        </Head>
        <Navbar />
        <div className="pt-16">
          <Component {...pageProps} />
        </div>
        <Footer />
        {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/573005951133"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white p-4 rounded-full shadow-2xl shadow-rose-500/40 hover:shadow-rose-400/60 transition-all duration-300 transform hover:scale-110 z-50"
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>
      </ProductsProvider>
    </CartProvider>
  );
}
