"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Cart } from '../lib/schemas/cartSchema';

// Extend CartContextType interface to include all required operations based on our schema
export interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  // Cart operations
  addItem: (productId: string, quantity: number, price: number, name?: string, image?: string, category?: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Promotions/discounts
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: () => Promise<void>;
  
  // Summary data
  itemCount: number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log(cart)
  
  // Calculate the number of items in the cart
  const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  // Fetch cart data when component mounts
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add item to cart
  const addItem = async (
    productId: string, 
    quantity: number, 
    price: number, 
    name?: string, 
    image?: string, 
    category?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: productId,
          quantity,
          price,
          name,
          image,
          category
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error adding item to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove item from cart
  const removeItem = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error removing item from cart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update item quantity in cart
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/cart/update/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update item quantity');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating item quantity:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear cart
  const clearCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error clearing cart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply promo code
  const applyPromoCode = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart/promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promoCode: code }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to apply promo code');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error applying promo code:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove promo code
  const removePromoCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart/promo', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove promo code');
      }
      
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error removing promo code:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect to fetch cart on mount and when auth changes
  useEffect(() => {
    fetchCart();
    
    // Listen for login/logout events
    const handleAuthChange = () => {
      fetchCart();
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);
  
  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
