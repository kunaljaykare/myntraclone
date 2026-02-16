const mongoose = require("mongoose");

const bagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  size: String,
  savedForLater: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Bag", bagSchema);
