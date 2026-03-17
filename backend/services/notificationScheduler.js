const cron = require("node-cron");
const DeviceToken = require("../models/DeviceToken");
const { Expo } = require("expo-server-sdk");

const expo = new Expo();

const startNotificationScheduler = () => {

    // Runs every day at 10 AM
    cron.schedule("0 10 * * *", async () => {
        try {
            console.log("🔥 Running promotional notification job...");

            const devices = await DeviceToken.find();

            const messages = devices
                .filter(device => Expo.isExpoPushToken(device.token))
                .map(device => ({
                    to: device.token,
                    sound: "default",
                    title: "🔥 Myntra Sale",
                    body: "Flat 50% OFF today!",
                }));

            console.log(`📢 Sending to ${messages.length} users`);

            if (messages.length > 0) {
                const response = await expo.sendPushNotificationsAsync(messages);
                console.log("✅ Notifications sent:", response);
            }

        } catch (error) {
            console.error("❌ Notification cron error:", error);
        }
    });

};

module.exports = startNotificationScheduler;