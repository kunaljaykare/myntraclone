const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const UserActivity = require("../models/UserActivity");
const Wishlist = require("../models/Wishlist");

router.get("/:productId", async (req, res) => {
  try {
    const userId = req.user?.id; // optional
    const currentProduct = await Product.findById(req.params.productId);

    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 1️⃣ Category similarity
    const categoryProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: currentProduct._id },
    }).limit(8);

    // 2️⃣ Browsing behavior
    let browsingProducts = [];
    if (userId) {
      const views = await UserActivity.find({
        userId,
        actionType: "VIEW",
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("productId");

      browsingProducts = views
        .map(v => v.productId)
        .filter(p => p.category === currentProduct.category);
    }

    // 3️⃣ Wishlist intent
    let wishlistProducts = [];
    if (userId) {
      const wishlist = await Wishlist.find({ userId }).populate("productId");
      wishlistProducts = wishlist
        .map(w => w.productId)
        .filter(p => p.category === currentProduct.category);
    }

    // 4️⃣ Merge + Deduplicate
    const combined = [
      ...categoryProducts,
      ...browsingProducts,
      ...wishlistProducts,
    ];

    const uniqueProducts = Array.from(
      new Map(combined.map(p => [p._id.toString(), p])).values()
    );

    res.json(uniqueProducts.slice(0, 12));
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;