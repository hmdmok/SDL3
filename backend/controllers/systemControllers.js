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

  if (!administrationType || !administrationName) {
    res.status(400);
    throw new Error("يجب ادخال كل المعلومات");
  }
  let installDate = new Date();
  let onlineCheckDate = new Date();
  let installType = "trailer";
  let machineCode = "";
  hddserial.first(function (err, serial) {
    machineCode = serial;
    console.log("machine code: " + machineCode);
  });
  await new Promise((res) => setTimeout(res, 15000));
  mongoose.connection.close().then();
  connectSystemDB().then(async (x) => {
    if (x) {
      const allOnlineSystem = await OnlineSystem.findOne({ machineCode });

      if (allOnlineSystem) {
        mongoose.connection.close().then();
        connectDB().then(async () => {
          console.log("alredy have an account !!!");
          //fixing update instead of create
          const systemToAdd = await System.create({
            installDate: allOnlineSystem.installDate,
            installType: allOnlineSystem.installType,
            administrationType: allOnlineSystem.administrationType,
            administrationName: allOnlineSystem.administrationName,
            machineCode: allOnlineSystem.machineCode,
            onlineID: allOnlineSystem._id,
            onlineCheckDate: allOnlineSystem.onlineCheckDate,
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
        });
      } else {
        const onlineSystemToAdd = await OnlineSystem.create({
          installDate,
          installType,
          administrationType,
          administrationName,
          machineCode,
          onlineCheckDate,
        });
        mongoose.connection.close();
        connectDB().then(async () => {
          let systemToAdd;
          if (machineCode)
            systemToAdd = await System.create({
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
        });
      }
    } else {
      console.log("not able to connect to the web server");
      connectDB().then(async () => {
        console.log("machine code: " + machineCode);
        try {
          const systemToAdd = await System.create({
            installDate,
            installType,
            administrationType,
            administrationName,
            machineCode: machineCode,
            onlineID: "not able to connect to the web server",
            onlineCheckDate,
          });
          if (systemToAdd) {
            res.status(201).json({
              _id: systemToAdd._id,
              installType: systemToAdd.installType,
              onlineID: systemToAdd.onlineID,
            });
          }
        } catch (error) {
          console.log("error add system:" + error);
          res.status(400);
        }
      });
    }
  });
});

const updateSystem = asyncHandler(async (req, res) => {
  const {
    installDate,
    installType,
    administrationType,
    administrationName,
    administrationCode,
    communeName,
    communeCode,
    quotaDate,
    quotaTitle,
    quotaQuant,
    machineCode,
    onlineID,
    onlineCheckDate,
  } = req.body;

  const id = req.params.id;
  const systemToUpdate = await System.findById(id);

  if (!systemToUpdate) {
    res.status(400);
    throw new Error("  غير موجود");
  } else {
    systemToUpdate.installDate = installDate || systemToUpdate.installDate;
    systemToUpdate.installType = installType || systemToUpdate.installType;
    systemToUpdate.administrationType =
      administrationType || systemToUpdate.administrationType;
    systemToUpdate.administrationName =
      administrationName || systemToUpdate.administrationName;
    systemToUpdate.administrationCode =
      administrationCode || systemToUpdate.administrationCode;
    systemToUpdate.communeName = communeName || systemToUpdate.communeName;
    systemToUpdate.communeCode = communeCode || systemToUpdate.communeCode;
    systemToUpdate.quotaDate = quotaDate || systemToUpdate.quotaDate;
    systemToUpdate.quotaTitle = quotaTitle || systemToUpdate.quotaTitle;
    systemToUpdate.quotaQuant = quotaQuant || systemToUpdate.quotaQuant;
    systemToUpdate.machineCode = machineCode || systemToUpdate.machineCode;
    systemToUpdate.onlineID = onlineID || systemToUpdate.onlineID;
    systemToUpdate.onlineCheckDate =
      onlineCheckDate || systemToUpdate.onlineCheckDate;

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
