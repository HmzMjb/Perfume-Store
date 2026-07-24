const express = require("express");
const Newsletter = require("../models/Newsletter");

const router = express.Router();

// POST /api/newsletter
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
