const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const User = require("./models/User");
const Product = require("./models/Product");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const products = [
  {
    name: "Noir Elegance",
    brand: "MAISON",
    gender: "men",
    category: "men",
    description:
      "A sophisticated blend of dark woods and aromatic spices, crafted for the modern gentleman.",
    price: new Map([["50ml", 89], ["100ml", 149]]),
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&h=600&fit=crop",
    ],
    notes: {
      top: ["Bergamot", "Black Pepper", "Lemon"],
      middle: ["Lavender", "Geranium", "Clary Sage"],
      base: ["Sandalwood", "Vetiver", "Amber"],
    },
    accords: ["Woody", "Aromatic", "Fresh Spicy"],
    rating: 4.5,
    reviews: 128,
    longevity: "Long Lasting",
    sillage: "Strong",
    season: ["Fall", "Winter"],
    occasion: ["Professional", "Night Out"],
    isNew: true,
    isFeatured: true,
  },
  {
    name: "Rose Velvet",
    brand: "MAISON",
    gender: "women",
    category: "women",
    description:
      "An enchanting floral masterpiece that captures the essence of a blooming garden at dawn.",
    price: new Map([["50ml", 95], ["100ml", 165]]),
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=600&fit=crop",
    ],
    notes: {
      top: ["Pink Pepper", "Lychee", "Bergamot"],
      middle: ["Rose", "Peony", "Jasmine"],
      base: ["Musk", "Cedarwood", "Ambroxan"],
    },
    accords: ["Floral", "Rose", "Powdery"],
    rating: 4.7,
    reviews: 256,
    longevity: "Moderate",
    sillage: "Moderate",
    season: ["Spring", "Summer"],
    occasion: ["Casual", "Date Night"],
    isNew: false,
    isFeatured: true,
  },
  {
    name: "Ocean Drift",
    brand: "MAISON",
    gender: "men",
    category: "men",
    description:
      "Inspired by the vastness of the ocean, this aquatic fragrance delivers a refreshing burst.",
    price: new Map([["50ml", 79], ["100ml", 129]]),
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=600&fit=crop",
    ],
    notes: {
      top: ["Sea Salt", "Grapefruit", "Lemon"],
      middle: ["Violet Leaf", "Iris", "Rosemary"],
      base: ["Amber", "Musk", "Driftwood"],
    },
    accords: ["Aquatic", "Fresh", "Citrus"],
    rating: 4.3,
    reviews: 89,
    longevity: "Moderate",
    sillage: "Light",
    season: ["Spring", "Summer"],
    occasion: ["Casual", "Beach"],
    isNew: true,
    isFeatured: false,
  },
  {
    name: "Golden Oud",
    brand: "MAISON",
    gender: "women",
    category: "women",
    description:
      "A luxurious oriental fragrance built around the precious oud wood.",
    price: new Map([["50ml", 120], ["100ml", 210]]),
    image: "https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=500&h=600&fit=crop",
    ],
    notes: {
      top: ["Saffron", "Honey", "Cardamom"],
      middle: ["Oud", "Damask Rose", "Incense"],
      base: ["Patchouli", "Sandalwood", "Vanilla"],
    },
    accords: ["Oriental", "Woody", "Sweet"],
    rating: 4.8,
    reviews: 312,
    longevity: "Very Long Lasting",
    sillage: "Strong",
    season: ["Fall", "Winter"],
    occasion: ["Night Out", "Special Events"],
    isNew: false,
    isFeatured: true,
  },
  {
    name: "Velvet Musk",
    brand: "MAISON",
    gender: "men",
    category: "men",
    description:
      "A seductive and warm fragrance that wraps you in a velvet embrace of creamy musk.",
    price: new Map([["50ml", 99], ["100ml", 169]]),
    image: "https://images.unsplash.com/photo-1617899778054-b2c49573cb9c?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617899778054-b2c49573cb9c?w=500&h=600&fit=crop",
    ],
    notes: {
      top: ["Black Pepper", "Nutmeg", "Bergamot"],
      middle: ["Leather", "Iris", "Violet"],
      base: ["Musk", "Tonka Bean", "Benzoin"],
    },
    accords: ["Musky", "Leather", "Warm Spicy"],
    rating: 4.6,
    reviews: 167,
    longevity: "Long Lasting",
    sillage: "Moderate",
    season: ["Fall", "Winter"],
    occasion: ["Night Out", "Date Night"],
    isNew: false,
    isFeatured: true,
  },
  {
    name: "Jasmine Moon",
    brand: "MAISON",
    gender: "women",
    category: "women",
    description:
      "A dreamy nocturnal floral that captures the magic of jasmine under moonlight.",
    price: new Map([["50ml", 105], ["100ml", 185]]),
    image: "https://images.unsplash.com/photo-1592945530025-2c9f4f05d0b5?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592945530025-2c9f4f05d0b5?w=500&h=600&fit=crop",
    ],
    notes: {
      top: ["Neroli", "Mandarin", "Pear"],
      middle: ["Jasmine", "Ylang Ylang", "Tuberose"],
      base: ["White Musk", "Vanilla", "Sandalwood"],
    },
    accords: ["Floral", "White Floral", "Sweet"],
    rating: 4.4,
    reviews: 198,
    longevity: "Moderate",
    sillage: "Moderate",
    season: ["Spring", "Summer"],
    occasion: ["Date Night", "Casual"],
    isNew: true,
    isFeatured: false,
  },
  {
    name: "Cedar Blaze",
    brand: "MAISON",
    gender: "men",
    category: "men",
    description:
      "A bold and rugged fragrance inspired by the wilderness.",
    price: new Map([["50ml", 85], ["100ml", 145]]),
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&h=600&fit=crop",
    ],
    notes: {
      top: ["Pine", "Juniper Berry", "Eucalyptus"],
      middle: ["Cedarwood", "Cypress", "Sage"],
      base: ["Moss", "Vetiver", "Smoky Leather"],
    },
    accords: ["Woody", "Aromatic", "Green"],
    rating: 4.2,
    reviews: 74,
    longevity: "Long Lasting",
    sillage: "Moderate",
    season: ["Fall", "Winter"],
    occasion: ["Casual", "Outdoor"],
    isNew: false,
    isFeatured: false,
  },
  {
    name: "Pear Blossom",
    brand: "MAISON",
    gender: "women",
    category: "women",
    description:
      "A fresh and fruity delight that celebrates the delicate beauty of pear blossoms in spring.",
    price: new Map([["50ml", 75], ["100ml", 125]]),
    image: "https://images.unsplash.com/photo-1615634260168-c5406b3955e2?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615634260168-c5406b3955e2?w=500&h=600&fit=crop",
    ],
    notes: {
      top: ["Pear", "Green Apple", "Lemon"],
      middle: ["Cherry Blossom", "Lily of the Valley", "Magnolia"],
      base: ["White Musk", "Blonde Wood", "Amber"],
    },
    accords: ["Fruity", "Floral", "Fresh"],
    rating: 4.1,
    reviews: 143,
    longevity: "Light",
    sillage: "Light",
    season: ["Spring", "Summer"],
    occasion: ["Casual", "Office"],
    isNew: true,
    isFeatured: false,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    // Seed admin
    const adminEmail = process.env.ADMIN_EMAIL || "hamzamujeeb196@gmail.com";

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: "Admin",
        email: adminEmail,
        googleId: "admin-placeholder",
        role: "admin",
      });
      console.log(`Admin created: ${adminEmail}`);
    } else {
      console.log(`Admin already exists: ${adminEmail}`);
    }

    // Seed products
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.insertMany(products);
      console.log(`${products.length} products seeded.`);
    } else {
      console.log(`${existingProducts} products already exist. Skipping.`);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDB();
