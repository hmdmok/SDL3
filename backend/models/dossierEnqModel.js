const mongoose = require("mongoose");

const dossierEnqSchema = mongoose.Schema(
  {
    nomFichier: {
      type: String,
      required: true,
      unique: true,
    },
    dateRecu: {
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

const dossierEnq = mongoose.model("dossierEnq", dossierEnqSchema);

module.exports = dossierEnq;
