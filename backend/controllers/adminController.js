const User=require("../models/User")
const Product=require("../models/Product")
const Order=require("../models/Order")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminRegistration=async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hash, role: 'admin' });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

const adminLogin=async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') return res.status(400).json({ msg: 'Invalid credentials' });
console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

const adminAddProduct= async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });

  } catch (error) {
    // res.status(500).json({ message: "Error adding product", error });
    console.log(error)
  }
};

const adminViewOrders=async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}

const updateOrderStatus=async (req, res) => {
  const { status } = req.body; 
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}

module.exports={adminRegistration,adminLogin,adminViewOrders,updateOrderStatus,adminAddProduct};