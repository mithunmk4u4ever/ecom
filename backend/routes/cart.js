const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const cartController = require("../controllers/cartController");

router.post("/", protect, cartController.addToCart);
router.get("/", protect, cartController.getCart);
router.delete("/:productId", protect,cartController.removeItem);
router.delete("/", protect, cartController.clearCart);

module.exports = router;
