import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: string) => void;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC = ({ children }) => {
  console.log('CartProvider initialized');

  const getStoredCart = () => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  };

  const [cartItems, setCartItems] = useState<CartItem[]>(getStoredCart);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Ensure totalQuantity sums up all book quantities in the cart
  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const addToCart = (book: CartItem) => {
    setCartItems((prevCartItems) => {
      const existingItemIndex = prevCartItems.findIndex(item => item.bookId === book.bookId);

      if (existingItemIndex !== -1) {
        return prevCartItems.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCartItems, { ...book, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (bookId: string) => {
    setCartItems((prevItems) => prevItems.filter(item => item.bookId !== bookId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
