const cron = require("node-cron");
const DeviceToken = require("../models/DeviceToken");
const Bag = require("../models/Bag"); // your cart model
const { Expo } = require("expo-server-sdk");

const expo = new Expo();

// Run every 30 minutes
cron.schedule("*/30 * * * *", async () => {
    console.log("🔁 Running cart abandonment check...");

    try {
        // Find carts not updated in last 30 mins
        const inactiveCarts = await Bag.find({
            updatedAt: {
                $lt: new Date(Date.now() - 30 * 60 * 1000),
            },
        });

        for (let cart of inactiveCarts) {
            const device = await DeviceToken.findOne({
                userId: cart.userId,
            });

            if (!device) continue;

            if (!Expo.isExpoPushToken(device.token)) continue;

            await expo.sendPushNotificationsAsync([
                {
                    to: device.token,
                    sound: "default",
                    title: "🛒 Complete Your Purchase",
                    body: "Items are waiting in your cart!",
                },
            ]);
        }

    } catch (error) {
        console.error("Cart cron error:", error);
    }
});