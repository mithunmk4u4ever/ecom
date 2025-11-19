const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, qty } = req.body;
    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: qty || 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty || 1;
      } else {
        cart.items.push({ productId, quantity: qty || 1 });
      }
    }

    await cart.save();

    res.json({ msg: "Cart updated", cart });

  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ msg: "Server error while adding to cart" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    
    // console.log("Fetching cart for user:", cart);
    if (!cart) return res.json({ items: [] });

    res.json(cart);

  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ msg: "Server error fetching cart" });
  }
};

// ➤ Remove Single Item
const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({ msg: "Item removed", cart });

  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    res.status(500).json({ msg: "Server error removing item" });
  }
};

// ➤ Clear Entire Cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ msg: "Cart cleared", cart });

  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ msg: "Server error clearing cart" });
  }
};

module.exports = { addToCart, getCart, removeItem, clearCart };
