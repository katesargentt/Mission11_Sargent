import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // Ensure cartItems is always an array
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // Step 1: Group items by bookId and calculate quantities
  const groupedItems = safeCartItems.reduce((acc, item) => {
    const existingItem = acc.find(i => i.bookId === item.bookId);
    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity if the item already exists
    } else {
      acc.push({ ...item, quantity: 1 }); // Add new item with quantity 1
    }
    return acc;
  }, [] as any[]);

  // Step 2: Calculate total price
  const total = groupedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const continueShopping = () => {
    const savedState = localStorage.getItem("continueShoppingState");

    if (savedState) {
      const { page, size, category } = JSON.parse(savedState);
      const query = new URLSearchParams();

      if (category) query.append("category", category);
      if (page) query.append("pageNum", page);
      if (size) query.append("pageSize", size);

      const url = `/books?${query.toString()}`;
      navigate(url);
    } else {
      navigate("/books");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">🛒 Shopping Cart</h2>
      {groupedItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {groupedItems.map((item) => (
                <tr key={`${item.bookId}-${item.title}`}>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Total: ${total.toFixed(2)}</h4>
          <button
            className="btn btn-secondary mt-3"
            onClick={continueShopping}
          >
            ← Continue Shopping
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
