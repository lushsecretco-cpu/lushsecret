import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from './Toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showNotification = (message) => {
    setNotification(message);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const addItem = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        showNotification(`${product.name} actualizado en el carrito`);
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        showNotification(`${product.name} añadido al carrito exitosamente ✨`);
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const updateItemDetails = (id, updates) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          
          // Si se cambió el color, actualizar la imagen
          if (updates.selectedColor && item.colors) {
            const colorObj = item.colors.find(c => c.color === updates.selectedColor);
            if (colorObj && colorObj.image) {
              updatedItem.image = colorObj.image;
              updatedItem.selectedColorCode = colorObj.colorCode;
            }
          }
          
          return updatedItem;
        }
        return item;
      })
    );
    showNotification('Producto actualizado exitosamente ✨');
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addItem, 
      addToCart: addItem, // Alias para compatibilidad
      removeItem, 
      updateQuantity,
      updateItemDetails, 
      getTotal, 
      getItemCount, 
      clearCart 
    }}>
      {children}
      {notification && (
        <Toast 
          message={notification} 
          onClose={hideNotification}
          duration={3000}
        />
      )}
    </CartContext.Provider>
  );
};