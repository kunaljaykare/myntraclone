const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      enum: ["VIEW", "WISHLIST", "ADD_TO_BAG"],
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);