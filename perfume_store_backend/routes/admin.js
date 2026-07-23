const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", auth, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
