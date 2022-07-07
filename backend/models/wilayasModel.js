const mongoose = require("mongoose");

const wilayasSchema = mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const wilayas = mongoose.model("wilayas", wilayasSchema);

module.exports = wilayas;
