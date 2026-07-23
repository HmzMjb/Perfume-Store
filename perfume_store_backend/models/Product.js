const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      default: "MAISON",
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["men", "women"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["men", "women"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Map,
      of: Number,
      required: [true, "Price is required"],
    },
    image: {
      type: String,
      required: [true, "Main image is required"],
    },
    images: [String],
    notes: {
      top: [String],
      middle: [String],
      base: [String],
    },
    accords: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    longevity: {
      type: String,
      enum: ["Light", "Moderate", "Long Lasting", "Very Long Lasting"],
      default: "Moderate",
    },
    sillage: {
      type: String,
      enum: ["Light", "Moderate", "Strong"],
      default: "Moderate",
    },
    season: [String],
    occasion: [String],
    isNew: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

productSchema.index({ name: "text", brand: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
