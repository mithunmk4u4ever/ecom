const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.post("/register", adminController.adminRegistration);
router.post("/login", adminController.adminLogin);
router.get('/orders', protect, adminOnly, adminController.adminViewOrders);
router.patch('/orders/:id', protect, adminOnly, adminController.updateOrderStatus);
router.post('/addproduct', protect, adminOnly, adminController.adminAddProduct);


module.exports = router;