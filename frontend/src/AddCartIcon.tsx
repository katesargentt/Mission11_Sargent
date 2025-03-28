import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const AddCartIcon: React.FC = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((count: number, item) => count + item.quantity, 0);

  return (
    <div
      onClick={() => navigate('/cart')}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span>🛒</span>
      {cartItemCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '5px',
            fontSize: '12px',
          }}
        >
          {cartItemCount}
        </span>
      )}
    </div>
  );
};

export default AddCartIcon;
