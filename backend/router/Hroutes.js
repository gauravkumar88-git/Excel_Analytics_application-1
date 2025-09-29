const express = require("express");
const multer = require("multer");
const router = express.Router();
const History = require("../models/History");

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const newHistory = new History({
      fileName: req.file.originalname,
      fileData: req.file.buffer,
      contentType: req.file.mimetype,
      date: new Date(),
    });

    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// Get all history
router.get("/", async (req, res) => {
  try {
    const history = await History.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Download file by ID
router.get("/download/:id", async (req, res) => {
  try {
    const file = await History.findById(req.params.id);
    if (!file) return res.status(404).send("File not found");

    res.set({
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.fileName}"`,
    });

    res.send(file.fileData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
