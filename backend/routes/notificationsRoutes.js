const express = require("express");
const router = express.Router();
const { Expo } = require("expo-server-sdk");
const expo = new Expo();
const DeviceToken = require("../models/DeviceToken");
const authMiddleware = require("../middleware/authMiddleware");

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

    const device = await DeviceToken.findOne({ userId: req.user._id });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device token not found",
      });
    }

    if (!Expo.isExpoPushToken(device.token)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Expo push token",
      });
    }

    const message = {
      to: device.token,
      sound: "default",
      title: "🔥 Myntra Clone",
      body: "Push notifications are working!",
      data: { screen: "Home" },
    };

    const response = await expo.sendPushNotificationsAsync([message]);

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