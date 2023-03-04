const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const System = require("../models/systemModel");
const OnlineSystem = require("../models/onlineSystemModel");
var hddserial = require("hddserial");
const { connectDB, connectSystemDB } = require("../config/db");

const getSystem = asyncHandler(async (req, res) => {
  const system = await System.find();
  if (system) res.json(system);
  else {
    res.status(400);
    throw new Error("No system info found");
  }
});

const createSystem = asyncHandler(async (req, res) => {
  const { administrationType, administrationName } = req.body;

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!administrationType || !administrationName) {
    res.status(400);
    throw new Error("يجب ادخال كل المعلومات");
  }
  const installDate = new Date();
  const onlineCheckDate = new Date();
  const installType = "trailer";
  let machineCode = "";
  hddserial.first(function (err, serial) {
    machineCode = serial;
  });
  const checkSystemOnline = async (serial) => {
    mongoose.connection.close();
    connectSystemDB();
    const allOnlineSystem = await OnlineSystem.find();
    let foundSystemCheck = false;
    allOnlineSystem?.map(async (onlineSystem) => {
      if (await onlineSystem.matchPassword(serial)) {
        foundSystemCheck = true;
        mongoose.connection.close();
        connectDB();
        res.json("alredy have an account !!!");
      }
    });
    if (!foundSystemCheck) {
      const onlineSystemToAdd = await OnlineSystem.create({
        installDate,
        installType,
        administrationType,
        administrationName,
        machineCode,
        onlineCheckDate,
      });
      mongoose.connection.close();
      connectDB();
      const systemToAdd = await System.create({
        installDate,
        installType,
        administrationType,
        administrationName,
        machineCode,
        onlineID: onlineSystemToAdd._id,
        onlineCheckDate,
      });
      if (systemToAdd) {
        res.status(201).json({
          _id: systemToAdd._id,
          installType: systemToAdd.installType,
          onlineID: systemToAdd.onlineID,
        });
      } else {
        res.status(400);
        throw new Error("Error add System File");
      }
    }
  };
});

const updateSystem = asyncHandler(async (req, res) => {
  const { system, code, nom } = req.body;

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  const id = req.params.id;
  const systemToUpdate = await System.findById(id);

  if (!systemToUpdate) {
    res.status(400);
    throw new Error("هذا التنقيط غير موجود");
  } else {
    systemToUpdate.system = system || systemToUpdate.system;
    systemToUpdate.code = code || systemToUpdate.code;
    systemToUpdate.nom = nom || systemToUpdate.nom;

    const updatedSystem = await systemToUpdate.save();
    res.status(201).json(updatedSystem);
  }
});

const deleteSystem = asyncHandler(async (req, res) => {
  const systemId = req.params.id;
  const systemData = await System.findById(systemId);

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!systemData) {
    res.status(400);
    throw new Error("هذا التنقيط غير موجود");
  } else {
    //do somethink
    await systemData.remove();
    res.json({ message: "تم حذف التنقيط" });
  }
});

module.exports = {
  createSystem,
  getSystem,
  updateSystem,
  deleteSystem,
};
