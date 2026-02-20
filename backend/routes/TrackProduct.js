const express = require("express");
const router = express.Router();
const UserActivity = require("../models/UserActivity");

router.post("/track-product", async (req, res) => {
    try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
        return res.status(400).json({ 
            message: "userId and productId are required"
        });
    }
    await UserActivity.findOneAndUpdate(
        { userId },
        {
            $addToSet: {
                viewedProducts: {
                    productId,
                    viewedAt: new Date(),
                }
            }
        },
        { upsert: true, new: true }
    );
    res.status(200).json({ success: true });
    } catch (error) {
    console.error("Error tracking product view:", error);
    res.status(500).json({ message: "Tracking failed" });
    }
});
module.exports = router;