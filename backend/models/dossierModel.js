const mongoose = require("mongoose");

const dossierSchema = mongoose.Schema(
  {
    creator: {
      type: String,
      required: true,
    },
    id_demandeur: {
      type: String,
      required: true,
      unique: true,
    },
    id_conjoin: {
      type: String,
    },
    date_depo: {
      type: String,
      required: true,
    },
    num_dos: {
      type: String,
      required: true,
      unique: true,
    },
    num_enf: {
      type: String,
    },
    stuation_s_avec_d: {
      type: String,
    },
    stuation_s_andicap: {
      type: String,
    },
    stuation_d: {
      type: String,
    },
    numb_p: {
      type: String,
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
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const dossier = mongoose.model("dossier", dossierSchema);

module.exports = dossier;
