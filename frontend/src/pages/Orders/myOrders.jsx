import React, { useEffect, useState } from "react";
import API from "../../api/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Fetch Orders Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) return <h4 className="text-center mt-4">Loading Orders...</h4>;
  if (!orders.length) return <h3 className="text-center mt-5">No Orders Found 🛒</h3>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">My Orders</h2>
      <div className="row">
        {orders.map((order) => (
          <div className="col-md-6 mb-4" key={order._id}>
            <div className="card shadow-sm p-3">
              <h5>Order ID: {order._id}</h5>
              <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
              <p>Delivery Address: {order.deliveryAddress}</p>
              <p>Payment Mode: {order.paymentMode}</p>
              <p>
                Delivery Status:{" "}
                <span className={`fw-bold ${
                  order.status === "Delivered"
                    ? "text-success"
                    : order.status === "Shipped"
                    ? "text-warning"
                    : "text-danger"
                }`}>
                  {order.status}
                </span>
              </p>

              <div className="border-top pt-2 mt-2">
                <h6>Items:</h6>
                {order.items.map((item) => (
                  <div
                    key={item.productId._id}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span>{item.productId.name} (x{item.quantity})</span>
                    <span>₹ {item.productId.price * item.quantity}</span>
                  </div>
                ))}
                <h6 className="text-end mt-2">
                  Total: ₹{" "}
                  {order.items.reduce(
                    (sum, item) => sum + item.productId.price * item.quantity,
                    0
                  )}
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
