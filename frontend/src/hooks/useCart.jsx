import { useCartContext } from "../context/cartContext";
import API from "../api/api";

export const useCart = () => {
  const { addToCart: contextAddToCart, loadCartCount } = useCartContext();

  const addToCart = async (productId, qty = 1) => {
    try {
      await API.post("/cart", { productId, qty });  // call backend
      await loadCartCount(); // refresh cart in context
      return { success: true };
    } catch (err) {
      console.error("Add to Cart Error:", err);
      return { success: false, message: err.response?.data?.msg || "Error" };
    }
  };

  return { addToCart };
};
