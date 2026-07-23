const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/wishlist
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/wishlist/:productId (toggle)
router.post("/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const populated = await user.populate("wishlist");
    res.json(populated.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
