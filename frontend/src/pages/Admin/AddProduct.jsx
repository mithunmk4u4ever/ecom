import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/admin/addproduct",
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Product added successfully!");
      setForm({ name: "", description: "", price: "", image: "" });

    } catch (error) {
      console.log(error);
      alert("Error adding product");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            name="image"
            className="form-control"
            value={form.image}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          Add Product
        </button>

      </form>
    </div>
  );
};

export default AddProduct;
