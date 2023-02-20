const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const systemSchema = mongoose.Schema(
  {
    // date of installation
    installDate: {
      type: String,
      required: true,
      unique: true,
    },

    // type of installation (trail, auth, ...)
    installType: {
      type: String,
    },

    // Type of administration
    administrationType: {
      type: String,
      default: "daira",
    },

    // name of administration
    administrationName: {
      type: String,
    },

    // Generated code for the machine
    machineCode: {
      type: String,
      required: true,
    },

    // last online check date
    onlineCheckDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

systemSchema.pre("save", async function (next) {
  if (!this.isModified("machineCode")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.machineCode = bcrypt.hash(this.machineCode, salt);
});

systemSchema.methods.matchPassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.machineCode);
};

const System = mongoose.model("System", systemSchema);

module.exports = System;
