import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css"; 

const CartIcon = () => {
  const { totalQuantity } = useCart();  // Use totalQuantity from context
  const navigate = useNavigate();

  return (
    <div className="cart-icon-container" onClick={() => navigate("/cart")}>
      <FaShoppingCart size={30} />
      {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
    </div>
  );
};

export default CartIcon;
