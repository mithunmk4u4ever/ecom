import React, { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const navigate = useNavigate();

  // Email Validation Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password Rules
  const rules = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allValid =
    rules.length &&
    rules.upper &&
    rules.lower &&
    rules.number &&
    rules.special &&
    emailRegex.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!allValid) {
      setError("Please satisfy all validation rules");
      return;
    }

    try {
      const res = await API.post("admin/register", { name, email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/admin/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  const getColor = (isValid) => (isValid ? "text-success" : "text-danger");

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "380px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4 fw-bold">Create Account</h3>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleRegister}>
          {/* NAME */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control rounded-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
            {email.length > 0 && (
              <p className={`mt-1 small ${getColor(emailRegex.test(email))}`}>
                {emailRegex.test(email)
                  ? "✔ Valid Email"
                  : "✘ Enter a valid email format"}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-1">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control rounded-3"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setTouched(true);
              }}
              placeholder="Create password"
              required
            />
          </div>

          {touched && (
            <div className="mt-2">
              <p className={`small mb-1 ${getColor(rules.length)}`}>
                {rules.length ? "✔" : "✘"} At least 6 characters
              </p>
              <p className={`small mb-1 ${getColor(rules.upper)}`}>
                {rules.upper ? "✔" : "✘"} One uppercase letter (A–Z)
              </p>
              <p className={`small mb-1 ${getColor(rules.lower)}`}>
                {rules.lower ? "✔" : "✘"} One lowercase letter (a–z)
              </p>
              <p className={`small mb-1 ${getColor(rules.number)}`}>
                {rules.number ? "✔" : "✘"} One digit (0–9)
              </p>
              <p className={`small mb-1 ${getColor(rules.special)}`}>
                {rules.special ? "✔" : "✘"} One special character (!@#$%)
              </p>
            </div>
          )}

          {/* SUBMIT */}
          <button
            className="btn btn-success w-100 rounded-3 mt-3"
            disabled={!allValid}
          >
            Register
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
