import { useEffect, useRef } from 'react';

// Generar un ID de sesión único
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Función para rastrear eventos
export const trackEvent = async (eventData) => {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = getSessionId();
    
    const payload = {
      ...eventData,
      session_id: sessionId,
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      referrer: document.referrer || null,
      timestamp: new Date().toISOString()
    };

    await fetch('http://localhost:4000/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Error al rastrear evento:', error);
  }
};

// Hook para rastrear visitas a páginas
export const usePageTracking = (pageName = null) => {
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    // Rastrear visita a la página
    trackEvent({
      event_type: 'page_view',
      metadata: {
        page_name: pageName || document.title,
        path: window.location.pathname
      }
    });

    // Rastrear tiempo en la página al salir
    return () => {
      if (startTimeRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        trackEvent({
          event_type: 'page_exit',
          duration,
          metadata: {
            page_name: pageName || document.title,
            path: window.location.pathname
          }
        });
      }
    };
  }, [pageName]);
};

// Hook para rastrear vistas de productos
export const useProductTracking = (product) => {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (product && !trackedRef.current) {
      trackEvent({
        event_type: 'product_view',
        product_id: product.id,
        product_name: product.name,
        category: product.category,
        metadata: {
          price: product.price,
          stock: product.stock
        }
      });
      trackedRef.current = true;
    }
  }, [product]);
};

// Función para rastrear agregado al carrito
export const trackAddToCart = (product) => {
  trackEvent({
    event_type: 'add_to_cart',
    product_id: product.id,
    product_name: product.name,
    category: product.category,
    metadata: {
      price: product.price,
      quantity: product.quantity || 1,
      selectedSize: product.selectedSize,
      selectedColor: product.selectedColor
    }
  });
};

// Función para rastrear compra
export const trackPurchase = (orderData) => {
  trackEvent({
    event_type: 'purchase',
    metadata: {
      order_id: orderData.id,
      total: orderData.total,
      items: orderData.items,
      payment_method: orderData.payment_method
    }
  });
};

// Función para rastrear búsquedas
export const trackSearch = (searchTerm, resultsCount) => {
  trackEvent({
    event_type: 'search',
    metadata: {
      search_term: searchTerm,
      results_count: resultsCount
    }
  });
};

export default {
  trackEvent,
  usePageTracking,
  useProductTracking,
  trackAddToCart,
  trackPurchase,
  trackSearch
};
