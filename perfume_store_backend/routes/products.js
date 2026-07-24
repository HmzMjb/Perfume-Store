const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { gender, search, sort, minPrice, maxPrice, accord } = req.query;
    let query = {};

    if (gender && gender !== "all") {
      query.gender = gender;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (accord) {
      const accords = accord.split(",");
      query.accords = { $in: accords };
    }

    if (minPrice || maxPrice) {
      const allProducts = await Product.find(query).sort(sortOption);
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Infinity;
      const filtered = allProducts.filter((p) => {
        const prices = Object.values(p.price.toObject ? p.price.toObject() : p.price);
        const lowestPrice = Math.min(...prices);
        return lowestPrice >= min && lowestPrice <= max;
      });
      return res.json(filtered);
    }

    let sortOption = {};
    if (sort === "price-low") sortOption = { "price.50ml": 1 };
    else if (sort === "price-high") sortOption = { "price.50ml": -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };
    else sortOption = { isFeatured: -1, createdAt: -1 };

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products
router.post("/", auth, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
