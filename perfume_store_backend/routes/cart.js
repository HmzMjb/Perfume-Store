const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/cart
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/cart
router.post("/", auth, async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ product: productId, size, quantity: quantity || 1 });
    }

    await user.save();
    const populated = await user.populate("cart.product");
    res.json(populated.cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/cart/:itemId
router.put("/:itemId", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const item = user.cart.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = quantity;
    await user.save();
    const populated = await user.populate("cart.product");
    res.json(populated.cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/cart/:itemId
router.delete("/:itemId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
      (item) => item._id.toString() !== req.params.itemId
    );
    await user.save();
    const populated = await user.populate("cart.product");
    res.json(populated.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
