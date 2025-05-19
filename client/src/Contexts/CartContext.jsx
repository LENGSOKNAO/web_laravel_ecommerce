import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      console.log('Loaded cart from localStorage:', savedCart);
      if (!savedCart) return [];
      const parsedCart = JSON.parse(savedCart);
      // Filter valid items
      const validCart = parsedCart.filter(item => 
        item.id &&
        typeof item.product_price === 'number' && 
        !isNaN(item.product_price) &&
        item.quantity > 0 &&
        item.name
      );
      console.log('Validated cart items:', validCart);
      return validCart;
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      console.log('Saved cart to localStorage:', cartItems);
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product, selectedSize) => {
    console.log('Adding to cart:', { product, selectedSize });
    if (!product.id || typeof product.product_price !== 'number' || isNaN(product.product_price) || !product.name) {
      console.warn('Invalid product data, skipping add to cart:', product);
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, selectedSize, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, selectedSize) => {
    console.log('Removing from cart:', { productId, selectedSize });
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === productId && item.selectedSize === selectedSize)
      )
    );
  };

  const updateQuantity = (productId, selectedSize, quantity) => {
    console.log('Updating quantity:', { productId, selectedSize, quantity });
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartCount = () => {
    console.log('cartItems in getCartCount:', cartItems);
    return Array.isArray(cartItems)
      ? cartItems.reduce((total, item) => total + item.quantity, 0)
      : 0;
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  console.log('CartProvider rendering with cartItems:', cartItems);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartCount, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};