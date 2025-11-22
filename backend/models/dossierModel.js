const mongoose = require("mongoose");

const dossierSchema = mongoose.Schema(
  {
    creator: {
      type: String,
    },
    id_commune: {
      type: String,
    },
    id_demandeur: {
      type: String,
    },
    id_conjoin: {
      type: [String],
    },
    id_demandeur_obj: {
      type: mongoose.Schema.Types.ObjectId,
    },
    id_conjoin_obj: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    date_depo: {
      type: String,
    },
    date_depo_dt: {
      type: Date,
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
    adress_fr: {
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

// Indexes to speed up common queries
dossierSchema.index({ num_dos: 1 });
dossierSchema.index({ id_commune: 1 });
dossierSchema.index({ notes: -1 });
// Add index for objectId fields (useful after one-time migration)
dossierSchema.index({ id_demandeur_obj: 1 });

const dossier = mongoose.model("dossier", dossierSchema);

module.exports = dossier;
