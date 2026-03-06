const mongoose = require("mongoose");

const deviceTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    deviceType: {
      type: String,
      enum: ["android", "ios", "web"],
      default: "android",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DeviceToken", deviceTokenSchema);