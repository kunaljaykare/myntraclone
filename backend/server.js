process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const userrouter = require("./routes/Userroutes");
const categoryrouter = require("./routes/Categoryroutes");
const productrouter = require("./routes/Productroutes");
const Bagroutes = require("./routes/Bagroutes");
const Wishlistroutes = require("./routes/Wishlistroutes");
const OrderRoutes = require("./routes/OrderRoutes");
const TrackProductRoutes = require("./routes/TrackProduct");
const notificationRoutes = require("./routes/notificationsRoutes");
const startNotificationScheduler = require("./services/notificationScheduler");
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});
// Test route
app.get("/", (req, res) => {
  res.send("✅ Myntra backend is working");
});

// API Routes
app.use("/user", userrouter);
app.use("/category", categoryrouter);
app.use("/product", productrouter);
app.use("/bag", Bagroutes);
app.use("/wishlist", Wishlistroutes);
app.use("/orders", OrderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/track-product", TrackProductRoutes);
app.use("/api/recommendations", require("./routes/Recommendationroutes"));


console.log("🔌 Connecting to MongoDB...");
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    startNotificationScheduler();
  })
  .catch(err => console.error(err));

// ✅ ALWAYS START SERVER (even if DB fails)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("📡 Starting server listen...");
  console.log(`🚀 Server is running on port ${PORT}`);
});
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});