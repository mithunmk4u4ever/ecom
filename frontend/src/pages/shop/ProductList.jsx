import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { useCart } from "../../hooks/useCart";



export default function ProductList(){
  const [products, setProducts] = useState([]);

    const { addToCart } = useCart();

  useEffect(()=>{
    API.get('/products').then(res => setProducts(res.data)).catch(console.error);
  },[]);

const handleAddToCart = async (id) => {
    const result = await addToCart(id, 1);
    if (result.success) {
      alert("Product added to cart!");
    } else {
      alert("Please login to make purchases.");
    }
  };
  return (
    <div className="container mt-4">
      <div className="row">
        {products.map(p => (
          <div key={p._id} className="col-md-4 mb-3">
            <div className="card">
              <img src={p.image} className="card-img-top product-img" alt={p.name}/>
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description}</p>
                <p className="fw-bold">₹{p.price}</p>
                <button className="btn btn-primary" onClick={() => handleAddToCart(p._id)}>Add to cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
