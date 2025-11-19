import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Total number of items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Fetch Cart Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh cart count
  const loadCartCount = async () => {
    await fetchCart();  // updates cart state → cartCount recalculates
  };

  // Add item to cart
  const addToCart = async (productId, qty = 1) => {
    try {
      const res = await API.post("/cart", { productId, qty });
      await loadCartCount();  // refresh cart and count
      return { success: true };
    } catch (err) {
      console.error("Add Cart Error:", err);
      return { success: false };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const res = await API.delete(`/cart/${productId}`);
      await loadCartCount();
    } catch (err) {
      console.error("Remove Cart Error:", err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, loadCartCount, loading,fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
