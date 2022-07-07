const mongoose = require("mongoose");

const communesSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    nomAr: {
      type: String,
      required: true,
    },
    nomFr: {
      type: String,
      required: true,
    },
    codeWilaya: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const communes = mongoose.model("communes", communesSchema);

module.exports = communes;
