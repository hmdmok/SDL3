const mongoose = require("mongoose");

const dossierSchema = mongoose.Schema(
  {
    creator: {
      type: String,
    },
    id_demandeur: {
      type: String,
    },
    id_conjoin: {
      type: [String],
    },
    date_depo: {
      type: String,
    },
    num_dos: {
      type: String,
    },
    adress: {
      type: String,
    },
    num_conj: {
      type: Number,
      default: 0,
    },
    note_revenue: {
      type: Number,
      default: 0,
    },
    note_habita: {
      type: Number,
      default: 0,
    },
    note_situation_familiale: {
      type: Number,
      default: 0,
    },
    note_anciennete: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
    },
    gender_conj: {
      type: String,
    },
    remark: {
      type: String,
    },
    saisi_conj: {
      type: String,
    },
    scan_dossier: {
      type: String,
    },
    notes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const dossier = mongoose.model("dossier", dossierSchema);

module.exports = dossier;
