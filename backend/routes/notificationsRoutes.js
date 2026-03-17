const express = require("express");
const router = express.Router();
const { Expo } = require("expo-server-sdk");
const expo = new Expo();
const DeviceToken = require("../models/DeviceToken");
const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");
/*
REGISTER DEVICE TOKEN
*/
router.post("/register-device", authMiddleware, async (req, res) => {
  try {
    const { token, deviceType } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Push token required",
      });
    }

    const existingToken = await DeviceToken.findOne({ token });

    if (existingToken) {
      existingToken.userId = req.user._id;
      await existingToken.save();

      return res.json({
        success: true,
        message: "Token updated",
      });
    }

    const newToken = await DeviceToken.create({
      userId: req.user._id,
      token,
      deviceType,
    });

    res.json({
      success: true,
      message: "Token registered",
      data: newToken,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


/*
TEST NOTIFICATION ROUTE
Sends a test notification to the logged-in user's device
*/
router.post("/send-test", authMiddleware, async (req, res) => {
  try {
    const devices = await DeviceToken.find({ userId: req.user._id });

    if (!devices || devices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Device token not found",
      });
    }

    // Create messages for ALL devices
    const messages = devices
      .filter(device => Expo.isExpoPushToken(device.token))
      .map(device => ({
        to: device.token,
        sound: "default",
        title: "🔥 Myntra Clone",
        body: "Push notifications are working!",
        data: {
          screen: "product",
          productId: "12345",
        },
      }));

    // Send notifications
    const response = await expo.sendPushNotificationsAsync(messages);

    // Save notification in DB
    await Notification.create({
      userId: req.user._id,
      title: "🔥 Myntra Clone",
      body: "Push notifications are working!",
      type: "test",
    });

    res.json({
      success: true,
      message: "Notification sent",
      response,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
});
router.get("/my-notifications", authMiddleware, async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    notifications,
  });
});
router.delete("/remove-device", authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;

    await DeviceToken.deleteOne({
      token,
      userId: req.user._id,
    });

    res.json({
      success: true,
      message: "Token removed",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;