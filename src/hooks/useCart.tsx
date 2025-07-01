
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  storeName: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('plateaus-cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('plateaus-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Omit<CartItem, 'id' | 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.productId);
      
      if (existingItem) {
        toast.success('Quantity updated in cart');
        return prevItems.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: Date.now().toString(),
          ...product,
          quantity: 1
        };
        toast.success('Item added to cart');
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
