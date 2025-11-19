// const express = require('express');
// const router = express.Router();
// const { protect, adminOnly } = require('../middleware/auth');
// const Order = require('../models/Order');

// // POST /api/orders  (place order)
// router.post('/', protect, async (req, res) => {
//   const { products, total } = req.body;
//   try {
//     const order = new Order({
//       user: req.user._id,
//       products,
//       total
//     });
//     await order.save();
//     res.json(order);
//   } catch (err) { res.status(500).json({ msg:'Server error' }); }
// });

// // GET /api/admin/orders  (admin only) -> also available as /api/orders with role check
// router.get('/admin/orders', protect, adminOnly, async (req, res) => {
//   const orders = await Order.find({}).populate('user', 'name email').populate('products.product', 'name price');
//   res.json(orders);
// });

// // PATCH /api/admin/orders/:id  update status (admin only)
// router.patch('/admin/orders/:id', protect, adminOnly, async (req, res) => {
//   const { status } = req.body;
//   const order = await Order.findById(req.params.id);
//   if (!order) return res.status(404).json({ msg:'Order not found' });
//   order.status = status || order.status;
//   await order.save();
//   res.json(order);
// });

// // For convenience allow users to GET their orders
// router.get('/', protect, async (req, res) => {
//   const orders = await Order.find({ user: req.user._id }).populate('products.product');
//   res.json(orders);
// });

// module.exports = router;

const router=require('express').Router();
const orderController=require("../controllers/orderController")
const {protect,adminOnly}=require("../middleware/auth")
router.post('/',protect, orderController.makeOrder);
router.get('/',protect, orderController.myOrders);
module.exports=router;
