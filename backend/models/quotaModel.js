const mongoose = require("mongoose");

const quotaSchema = mongoose.Schema(
  {
    quotaname: {
      type: String,
      required: true,
    },
    quotadate: {
      type: String,
      required: true,
    },
    quotaquant: {
      type: String,
      required: true,
    },
    quotascan: {
      type: String,
    },
    creator: {
      type: String,
    },
    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Quota = mongoose.model("Quota", quotaSchema);

module.exports = Quota;
