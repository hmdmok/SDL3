const mongoose = require("mongoose");

const personSchema = mongoose.Schema(
  {
    type: {
      type: String,
    },
    prenom: {
      type: String,
    },
    prenom_fr: {
      type: String,
    },
    nom: {
      type: String,
    },
    nom_fr: {
      type: String,
    },
    gender: {
      type: String,
    },
    num_act: {
      type: String,
    },
    type_date_n: {
      type: String,
    },
    date_n: {
      type: String,
    },
    lieu_n: {
      type: String,
    },
    lieu_n_fr: {
      type: String,
    },
    wil_n: {
      type: String,
    },
    com_n: {
      type: String,
    },
    prenom_p: {
      type: String,
    },
    prenom_p_fr: {
      type: String,
    },
    prenom_m: {
      type: String,
    },
    prenom_m_fr: {
      type: String,
    },
    nom_m: {
      type: String,
    },
    nom_m_fr: {
      type: String,
    },
    num_i_n: {
      type: String,
    },
    stuation_f: {
      type: String,
    },
    situation_p: {
      type: String,
    },
    profession: {
      type: String,
    },
    salaire: {
      type: String,
    },
    creator: {
      type: String,
    },
    photo_link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const person = mongoose.model("person", personSchema);

module.exports = person;
