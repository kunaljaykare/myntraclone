const Device = require("../models/DeviceToken");
const { Expo } = require("expo-server-sdk");

let expo = new Expo();

// Register device token
exports.registerDevice = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user._id;

    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }

    const device = await Device.findOneAndUpdate(
      { userId },
      { token },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Device registered successfully",
      device,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Send instant notification
exports.sendNotification = async (req, res) => {
  try {

    const { title, body, userId } = req.body;

    const device = await Device.findOne({ userId });

    if (!device) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    // ✅ Validate Expo token
    if (!Expo.isExpoPushToken(device.token)) {
      return res.status(400).json({
        message: "Invalid Expo push token",
      });
    }

    const message = {
      to: device.token,
      sound: "default",
      title,
      body,
      data: { type: "general" },
    };

    const tickets = await expo.sendPushNotificationsAsync([message]);

    res.status(200).json({
      success: true,
      tickets,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};