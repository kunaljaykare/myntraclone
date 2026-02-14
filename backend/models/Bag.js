const mongoose = require("mongoose");

const BagItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    size: String,
    quantity: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["active", "saved"],
      default: "active"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bag", BagItemSchema);
