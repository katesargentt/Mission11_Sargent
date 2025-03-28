import React, { createContext, useContext, useState } from 'react';

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC = ({ children }) => {
  console.log('CartProvider initialized');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Add or update an item in the cart
  const addToCart = (book: CartItem) => {
    setCartItems((prevCartItems) => {
      // Check if the book already exists in the cart
      const existingItemIndex = prevCartItems.findIndex(item => item.bookId === book.bookId);
      
      if (existingItemIndex !== -1) {
        // Update the quantity of the existing item
        const updatedCart = prevCartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        
        console.log('Updated Cart with Increased Quantity:', updatedCart); // Logs for debugging
        return updatedCart;
      } else {
        // If it's a new item, add it to the cart
        const newCart = [...prevCartItems, { ...book, quantity: 1 }];
        console.log('New Cart:', newCart); // Logs for debugging
        return newCart;
      }
    });
  };
  
  

  // Remove an item from the cart
  const removeFromCart = (bookId: string) => {
    setCartItems((prevItems) => prevItems.filter(item => item.bookId !== bookId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
