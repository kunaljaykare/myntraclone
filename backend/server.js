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
const notificationRoutes = require("./routes/NotificationRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.send("✅ Myntra backend is working");
});

// API Routes
app.use("/api/user", userrouter);
app.use("/api/category", categoryrouter);
app.use("/api/product", productrouter);
app.use("/api/bag", Bagroutes);
app.use("/api/wishlist", Wishlistroutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/track-product", TrackProductRoutes);
app.use("/api/recommendations", require("./routes/Recommendationroutes"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server is running on port ${PORT}`)
);