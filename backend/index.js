const express = require("express");
const cookieParser = require("cookie-parser");


const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); 
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// Routes
app.get("/home", (req, res) => {
  res.send("Hi I am Gaurav");
});

// Auth routes
const authRoutes = require("./router/authRoutes");
app.use("/api/auth", authRoutes);

//uploadfile 

app.use("/uploads", express.static("uploads"));
app.use("/api/upload", require("./router/uploadRoutes"));

// History routes
const historyRoutes = require("./router/Hroutes");
app.use("/api/history", historyRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
