const express = require("express");
const multer = require("multer");
const History = require("../models/History");
const authenticateUser = require("../middleware/authMiddleware"); // ✅ import middleware

const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file (only logged-in users)
router.post("/", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const newHistory = new History({
      fileName: req.file.originalname,
      fileData: req.file.buffer,
      contentType: req.file.mimetype,
      userId: req.user.id, // link file to logged-in user
      date: new Date(),
    });

    await newHistory.save();
    res.status(201).json({ message: "File uploaded successfully", history: newHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// Fetch only logged-in user's files
router.get("/", authenticateUser, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
