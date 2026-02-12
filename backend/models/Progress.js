const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    weight: {
      type: Number,
      default: null,
    },
    bodyFat: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "bad", "terrible"],
      default: "okay",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
