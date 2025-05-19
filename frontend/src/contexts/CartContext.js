import React, { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../config/constants';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        // If there's an error parsing, reset the cart
        localStorage.removeItem(STORAGE_KEYS.CART);
      }
    }
  }, []);

  useEffect(() => {
    // Update totals when cart changes
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const amount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalAmount(amount);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (medicine, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === medicine.id);
      
      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, {
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
          image: medicine.image,
          quantity
        }];
      }
    });
  };

  const removeFromCart = (medicineId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== medicineId));
  };

  const updateQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEYS.CART);
  };

  // Cart management flow:
  // 1. Products can be added to cart from MedicineCard or MedicineDetail
  // 2. CartContext maintains cart state and provides methods:
  //    - addToCart(medicine, quantity)
  //    - removeFromCart(medicineId)
  //    - updateQuantity(medicineId, quantity)
  //    - clearCart()
  // 3. Cart data is persisted in localStorage
  // 4. CartContext calculates totalItems and totalAmount when cart changes

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        totalItems, 
        totalAmount, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
