const mongoose = require("mongoose");

const enqueteSchema = mongoose.Schema(
  {
    fichierEnq: {
      type: String,
      required: true,
      unique: true,
    },
    typeEnq: {
      type: String,
      required: true,
    },
    dateEnq: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const enquete = mongoose.model("enquete", enqueteSchema);

module.exports = enquete;
