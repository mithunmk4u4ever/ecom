import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { useCartContext } from "../../context/cartContext";

const Cart = () => {
  const { cart, fetchCart, loading } = useCartContext();
  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  const token = localStorage.getItem("token");

  // Increment / Decrement quantity
  const updateQty = async (productId, qtyChange) => {
    try {
      await API.post(
        "/cart",
        { productId, qty: qtyChange },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // updates cart globally
    } catch (error) {
      console.error("Quantity Update Error:", error);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart(); // updates cart globally
    } catch (error) {
      console.error("Remove Item Error:", error);
    }
  };

  // Place order
  const placeOrder = async () => {
    if (!address) return alert("Please enter delivery address");
    setPlacingOrder(true);

    try {
      await API.post(
        "/orders",
        { deliveryAddress: address, paymentMode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully!");
      fetchCart(); // clear cart after order
      setAddress("");
      setPaymentMode("COD");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };


  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

     
      const lastOrder = res.data.find(order => order.deliveryAddress);
      if (lastOrder) {
        setAddress(lastOrder.deliveryAddress);
      }

    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  };
  fetchOrders();
}, [token]);
  if (loading) return <h4 className="text-center mt-4">Loading Cart...</h4>;
  if (!cart || cart.length === 0)
    return <h3 className="text-center mt-5">Your Cart is Empty 🛒</h3>;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">Your Cart</h2>

      <div className="row">
        {cart.map((item) => (
          <div key={item.productId._id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img
                src={item.productId.image}
                className="card-img-top"
                alt={item.productId.name}
                style={{ height: "230px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5 className="card-title">{item.productId.name}</h5>
                <p className="text-muted">₹ {item.productId.price}</p>

                {/* Quantity Controls */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => updateQty(item.productId._id, -1)}
                    disabled={item.quantity === 1}
                  >
                    −
                  </button>
                  <span className="fw-bold">{item.quantity}</span>
                  <button
                    className="btn btn-dark"
                    onClick={() => updateQty(item.productId._id, 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-danger w-100"
                  onClick={() => removeItem(item.productId._id)}
                >
                  Remove from Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Section */}
      <div className="border-top pt-3 mt-3">
        <h4 className="text-end">
          Total: <span className="fw-bold text-success">₹ {totalAmount}</span>
        </h4>

        <div className="mb-3 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={placeOrder}
          disabled={placingOrder}
        >
          {placingOrder ? "Placing Order..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
