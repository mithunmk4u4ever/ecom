import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/cartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const { cartCount } = useCartContext();
  // const [isLoggedIn, setIsLoggedIn] = useState(
  //   !!localStorage.getItem("token")
  // );
    const { isLoggedIn, logout } = useAuth();


  // Update login status whenever localStorage changes
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setIsLoggedIn(!!localStorage.getItem("token"));
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          🛒 ShopCart
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-3">
            <li className="nav-item">
              <Link className="nav-link fs-6" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-6" to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-6 position-relative" to="/cart">
                Cart
                {cartCount > 0 && (
                  <span
                    className="badge bg-danger rounded-circle position-absolute"
                    style={{
                      fontSize: "0.7rem",
                      top: "-5px",
                      right: "-12px",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {!isLoggedIn ? (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                Login
              </Link>
              <Link to="/register" className="btn btn-warning btn-sm px-3">
                Register
              </Link>
            </div>
          ) : (
            <div className="dropdown">
              <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                My Account
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/orders">
                    My Orders
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      // setIsLoggedIn(false); // update state immediately
                      window.location.reload();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
