const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileData: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to user
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);
