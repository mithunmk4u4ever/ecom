import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    try {
      const res = await API.get('/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
      console.log("Fetched orders:", res.data);
      setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/admin/orders/${orderId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchOrders(); // refresh
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Orders</h2>
      <div className="row">
        {orders.map(order => (
          <div className="col-md-6 mb-3" key={order._id}>
            <div className="card p-3 shadow-sm">
              <h6>Order ID: {order._id}</h6>
              <p>User: {order.userId?.name} ({order.userId?.email})</p>
              <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
              <p>Delivery Address: {order.deliveryAddress}</p>
              <p>Payment Mode: {order.paymentMode}</p>
              <p>Status: {order.status}</p>

              <div className="d-flex gap-2 mt-2">
                {['Pending', 'Shipped', 'Delivered'].map(s => (
                  <button
                    key={s}
                    className={`btn btn-sm ${s===order.status ? 'btn-success' : 'btn-outline-dark'}`}
                    onClick={() => updateStatus(order._id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <hr />
              <h6>Items:</h6>
              {order.items.map(item => (
                <p key={item.productId._id}>
                  {item.productId.name} x {item.quantity} → ₹ {item.productId.price*item.quantity}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
