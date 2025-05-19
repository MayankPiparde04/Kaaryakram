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
  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  // Cache the cart data to avoid unnecessary reloads
  const [cachedCart, setCachedCart] = useState<Cart | null>(null);

  // Optimized fetch cart function to avoid unnecessary reloads
  const fetchCart = async (force = false) => {
    // If we already have a cached cart and we're not forcing a refresh, return
    if (cachedCart && !force && !isLoading) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Add a timestamp parameter to prevent browser caching
      const response = await fetch('/api/cart?t=' + Date.now());
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      
      // Only update if data is different than current state
      if (JSON.stringify(data) !== JSON.stringify(cart)) {
        setCart(data);
        setCachedCart(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add item to cart with optimistic update
  const addItem = async (
    productId: string, 
    quantity: number, 
    price: number, 
    name?: string, 
    image?: string, 
    category?: string
  ) => {
    // Create the new item
    const newItem: CartItem = {
      product: productId,
      quantity,
      price,
      name: name || "Product",
      image,
      category
    };
    
    // Perform optimistic update to the local state
    if (cart) {
      // Check if the product already exists in the cart
      const existingItemIndex = cart.items.findIndex(item => item.product === productId);
      
      let updatedItems;
      let updatedSubtotal;
      
      if (existingItemIndex >= 0) {
        // Update quantity if the item exists
        updatedItems = [...cart.items];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedSubtotal = cart.subtotal + (price * quantity);
      } else {
        // Add new item if it doesn't exist
        updatedItems = [...cart.items, newItem];
        updatedSubtotal = cart.subtotal + (price * quantity);
      }
      
      // Update local state immediately
      setCart({
        ...cart,
        items: updatedItems,
        subtotal: updatedSubtotal
      });
    }
    
    // Then perform the server update in the background
    try {
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
      
      // Update with the server response to ensure consistency
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error adding item to cart:', err);
      
      // Refetch the cart to ensure state is consistent with server
      fetchCart();
    }
  };
  
  // Fix the removeItem function to better handle deletion
  const removeItem = async (productId: string) => {
    // Store original cart state for recovery if needed
    const originalCart = cart;
    
    // Optimistic update: remove the specific item locally first
    if (cart) {
      const itemToRemove = cart.items.find(item => item.product === productId);
      
      if (itemToRemove) {
        const priceReduction = itemToRemove.price * itemToRemove.quantity;
        const updatedItems = cart.items.filter(item => item.product !== productId);
        
        // Update local state immediately - only removing the specific item
        setCart({
          ...cart,
          items: updatedItems,
          subtotal: cart.subtotal - priceReduction
        });
      }
    }
    
    // Then perform the server update in the background WITHOUT setting loading state
    try {
      // Don't set isLoading - keep it in the background
      setError(null);
      
      // Use signal to allow aborting the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Detailed error logging
      if (!response.ok) {
        console.error('Response status:', response.status);
        let errorText;
        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
          console.error('Error response:', errorData);
        } catch (e) {
          errorText = await response.text();
          console.error('Error text:', errorText);
        }
        throw new Error(`Failed to remove item: ${errorText}`);
      }
      
      // Get the latest cart state from the server
      const data = await response.json();
      
      // Prevent state loss by merging server data with optimistic updates
      if (originalCart && cart) {
        // If items were manually added or modified during this API call, preserve those changes
        const currentItems = new Map(cart.items.map(item => [item.product, item]));
        
        // Update cart with server data but preserve local changes
        setCart({
          ...data,
          // Keep new items that might have been added locally during this operation
          items: data.items.map(serverItem => {
            const localItem = currentItems.get(serverItem.product);
            return localItem || serverItem;
          })
        });
      } else {
        // If no local changes happened, just use server data
        setCart(data);
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // If there was an error, fetch the cart to ensure consistency
      fetchCart();
    }
  };
  
  // Update item quantity in cart with true background operation
  const updateQuantity = async (productId: string, quantity: number) => {
    // Optimistic update: update the quantity locally first
    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.product === productId);
      
      if (itemIndex >= 0) {
        const updatedItems = [...cart.items];
        const oldQuantity = updatedItems[itemIndex].quantity;
        const price = updatedItems[itemIndex].price;
        
        // Calculate price difference
        const priceDifference = price * (quantity - oldQuantity);
        
        // Update quantity
        updatedItems[itemIndex].quantity = quantity;
        
        // Update local state immediately
        setCart({
          ...cart,
          items: updatedItems,
          subtotal: cart.subtotal + priceDifference
        });
      }
    }
    
    // Then perform the server update in the background WITHOUT setting loading state
    try {
      // Don't set isLoading - keep it in the background
      setError(null);
      
      const response = await fetch(`/api/cart/update/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Failed to update item quantity: ${errorData.error || 'Unknown error'}`);
      }
      
      // Update with the server response to ensure consistency, but don't trigger loading state
      const data = await response.json();
      
      // Use functional updates to avoid race conditions
      setCart(prevCart => ({
        ...data,
        // Keep any optimistic updates that happened during this request
        items: data.items.map(serverItem => {
          // Check if we have a more recent local version of this item
          const localItem = prevCart?.items.find(item => item.product === serverItem.product);
          if (localItem && localItem.quantity !== serverItem.quantity) {
            // If local version differs, prefer the local version (more recent changes)
            return localItem;
          }
          return serverItem;
        })
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating item quantity:', err);
      
      // Don't refetch - just log the error, the UI already reflects the user's intent
    }
  };
  
  // Clear cart with optimistic update
  const clearCart = async () => {
    // Optimistic update: clear the cart locally first
    if (cart) {
      setCart({
        ...cart,
        items: [],
        subtotal: 0,
        discount: 0,
        promoCode: undefined
      });
    }
    
    // Then perform the server update in the background
    try {
      setError(null);
      
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      // Update with the server response to ensure consistency
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error clearing cart:', err);
      
      // Refetch the cart to ensure state is consistent with server
      fetchCart();
    }
  };
  
  // Apply promo code with optimistic update
  const applyPromoCode = async (code: string) => {
    // Optimistic update: apply discount locally first
    if (cart) {
      // Estimate a 10% discount (will be replaced with actual from server)
      const estimatedDiscount = Math.round(cart.subtotal * 0.1);
      
      // Update local state immediately
      setCart({
        ...cart,
        promoCode: code,
        discount: estimatedDiscount
      });
    }
    
    // Then perform the server update in the background
    try {
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
      
      // Update with the server response to ensure consistency
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error applying promo code:', err);
      
      // Reset promo code and discount on error
      if (cart) {
        setCart({
          ...cart,
          promoCode: undefined,
          discount: 0
        });
      }
      
      // Re-throw the error so the calling component can handle it
      throw err;
    }
  };
  
  // Remove promo code with optimistic update
  const removePromoCode = async () => {
    // Optimistic update: remove discount locally first
    if (cart) {
      setCart({
        ...cart,
        promoCode: undefined,
        discount: 0
      });
    }
    
    // Then perform the server update in the background
    try {
      setError(null);
      
      const response = await fetch('/api/cart/promo', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove promo code');
      }
      
      // Update with the server response to ensure consistency
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error removing promo code:', err);
      
      // Refetch the cart to ensure state is consistent with server
      fetchCart();
    }
  };
  
  // Auto-refresh cart when auth status changes, but with throttling
  useEffect(() => {
    let isFirstRender = true;

    const refreshCart = () => {
      if (isFirstRender) {
        // On first render, always fetch
        fetchCart(true);
        isFirstRender = false;
      } else {
        // On subsequent renders, check if we need to re-fetch
        fetchCart();
      }
    };

    refreshCart();
    
    // Debounced auth change handler
    let authChangeTimeout: NodeJS.Timeout;
    const handleAuthChange = () => {
      clearTimeout(authChangeTimeout);
      authChangeTimeout = setTimeout(() => {
        console.log("Auth change detected, refreshing cart");
        fetchCart(true); // Force refresh on auth change
      }, 300); // Debounce for 300ms
    };
    
    // Listen for storage events for auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        console.log("Auth token changed, refreshing cart");
        fetchCart();
      }
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);
    
    // Check if token exists on mount and fetch cart
    const checkToken = async () => {
      const token = document.cookie.includes('token=');
      if (token) {
        console.log("Token found on load, fetching cart");
        fetchCart();
      }
    };
    
    checkToken();
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(authChangeTimeout);
    };
  }, []);
  
  // Don't refetch on every render, only when needed
  useEffect(() => {
    // Only fetch if we don't have a cart
    if (!cart && !isLoading) {
      fetchCart();
    }
  }, [cart, isLoading]);
  
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
