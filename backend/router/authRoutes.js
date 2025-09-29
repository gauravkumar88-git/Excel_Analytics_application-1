const express = require("express");
const { signup, login, logout } = require("../controller/authController");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Signup & Login routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token; // or from headers
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now req.user.id is available
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get logged-in user's info
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
module.exports.authenticateUser = authenticateUser;
