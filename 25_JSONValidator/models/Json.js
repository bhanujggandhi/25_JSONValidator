const mongoose = require("mongoose");

const JsonSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    ownerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    data: {
      type: String,
      required: true,
    },
    grammarfor: {
      type: String,
      enum: ["scene", "action", "asset"],
      default: "scene",
    },
    private: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Json", JsonSchema);
