const Cart = require('../models/Cart');
const Order = require('../models/Order');

const makeOrder=async (req, res) => {
  try {
    const { deliveryAddress, paymentMode } = req.body;
    const userId = req.user.id;

    // Fetch user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ msg: "Cart is empty" });

    // Create order
    const order = new Order({
      userId,
      items: cart.items.map(i => ({ productId: i.productId._id, quantity: i.quantity })),
      deliveryAddress,
      paymentMode,
    });

    await order.save();

    console.log(`Order created: ${order._id} for user: ${userId}`);

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.json({ msg: "Order placed successfully", order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
}

const myOrders=async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId')
      .sort({ createdAt: -1 }); // latest first
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}

module.exports={makeOrder,myOrders};