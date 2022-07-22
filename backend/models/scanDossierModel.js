const mongoose = require("mongoose");

const scanDossierSchema = mongoose.Schema(
  {
    num_dossier: {
      type: String,
      required: true,
    },
    nom: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const scanDossier = mongoose.model("scanDossier", scanDossierSchema);

module.exports = scanDossier;
