import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";          // bootstrap styles
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login"
// Shop Pages
import ProductList from "./pages/shop/ProductList";
import Cart from "./pages/Cart/CartPage";
import MyOrders from "./pages/Orders/myOrders";
import PrivateRoute from "./components/PrivateRoute";
// import Checkout from "./pages/shop/Checkout";

// Admin Pages
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminRoute from "./components/AdminRoute";


// Shared Components
import Navbar from "./components/Navbar";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminRegister from "./pages/Admin/AdminRegister";

// localStorage.clear()

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />

        <Route path="/products" element={<ProductList />} />

        <Route path="/" element={<ProductList />} />
        <Route path="/adminregister" element={<AdminRegister />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />


      </Routes>
    </>
  );
}

export default App;
