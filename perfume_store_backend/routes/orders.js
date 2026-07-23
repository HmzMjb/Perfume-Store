const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// POST /api/orders
router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 150 ? 0 : 10;
    const total = subtotal + shipping;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      subtotal,
      shipping,
      total,
    });

    // Clear user cart after order
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    const populated = await order.populate("items.product");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/orders/my
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders
router.get("/", auth, admin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== "all") {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
