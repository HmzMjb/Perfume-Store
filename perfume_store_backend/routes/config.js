const express = require("express");
const router = express.Router();

// GET /api/config/google - serves Google Client ID
router.get("/google", (req, res) => {
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
});

module.exports = router;
