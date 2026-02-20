const mongoose = require("mongoose");
const UserActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    viewedProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        }
        }
    ],
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      }
    ]
    }, { timestamps: true }
    );
  module.exports = mongoose.model("UserActivity", UserActivitySchema);
