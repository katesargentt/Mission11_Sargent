import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CartPage from './CartPage';
import BookList from './BookList';
import { CartProvider } from './CartContext';// Import CartProvider
import AdminBooksPage from './AdminBooksPage';

const App: React.FC = () => {
  return (
    <CartProvider> {/* Wrap your component tree with CartProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
