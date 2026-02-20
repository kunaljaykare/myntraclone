const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: String,
    brand: String,
    price: Number,
    discount: String,
    description: String,
    sizes: [String],
    images: [String],
    ccategory:  {type: String, index: true},
    subbcategory: {type: String},
    tags: [String],
    popularityScore: { type: Number, default: 0 }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
