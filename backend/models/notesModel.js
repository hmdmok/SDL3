const mongoose = require("mongoose");

const notesSchema = mongoose.Schema(
  {
    notes: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    nom: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const notes = mongoose.model("notes", notesSchema);

module.exports = notes;
