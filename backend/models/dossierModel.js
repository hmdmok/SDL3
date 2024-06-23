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
      type: String,
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
    num_enf: {
      type: Number,
    },
    stuation_s_avec_d: {
      type: Number,
    },
    stuation_s_andicap: {
      type: String,
    },
    stuation_d: {
      type: Number,
    },
    numb_p: {
      type: Number,
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
    },
  },
  {
    timestamps: true,
  }
);

const dossier = mongoose.model("dossier", dossierSchema);

module.exports = dossier;
