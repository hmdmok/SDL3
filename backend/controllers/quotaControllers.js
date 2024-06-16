const asyncHandler = require("express-async-handler");
const Quota = require("../models/quotaModel");
const System = require("../models/systemModel");
const generateToken = require("../utils/generateToken");
const { initiateDB } = require("../config/db");

const addNewQuota = asyncHandler(async (req, res) => {
  const { quotaname, quotadate, quotaquant, creator, remark } = req.body;

  const quotascan = req.file?.path;

  const quotaExists = await Quota.findOne({ quotadate });

  if (quotaExists) {
    res.status(400);
    throw new Error("هذه الحصة مسجلة من قبل");
  }

  const quota = await Quota.create({
    quotaname,
    quotadate,
    quotaquant,
    quotascan,
    creator,
    remark,
  });

  if (quota) {
    res.status(201).json({
      _id: quota._id,
      quotaname: quota.quotaname,
      firstname: quota.firstname,
      lastname: quota.lastname,
      birthday: quota.birthday,
      quotatype: quota.quotatype,
      photo_link: quota.photo_link,
      token: generateToken(quota._id),
    });
  } else {
    res.status(400);
    throw new Error("Error Reating new quota !");
  }
});

const authQuota = asyncHandler(async (req, res) => {
  const { quotaname, password } = req.body;
  var noQuotas = false;
  const quotasList = await Quota.find();
  const systemsList = await System.find();

  if (systemsList.length > 0) {
    if (quotasList.length > 0) {
      const quota = await Quota.findOne({ quotaname });
      if (quota && (await quota.matchPassword(password))) {
        res.json({
          _id: quota._id,
          quotaname: quota.quotaname,
          firstname: quota.firstname,
          lastname: quota.lastname,
          quotatype: quota.quotatype,
          photo_link: quota.photo_link,
          token: generateToken(quota._id),
        });
      } else {
        res.status(400);
        throw new Error("Error authontificating Quota !");
      }
    } else {
      initiateDB();
      res.status(400);
      throw new Error("No quota found please try test connection!");
    }
  } else {
    initiateDB();
    res.status(400);
    throw new Error("Initiate system file!!!");
  }
});

const getQuotas = asyncHandler(async (req, res) => {
  if (req.quota.quotatype !== "super" && req.quota.quotatype !== "admin") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }
  const allQuota = await Quota.find();
  res.json(allQuota);
});

const getQuotaById = asyncHandler(async (req, res) => {
  const quotaId = req.params.id;
  const quotaData = await Quota.findById(quotaId);
  if (quotaData) res.json(quotaData);
  else {
    res.status(400);
    throw new Error("المستخدم غير موجود");
  }
});

const editQuota = asyncHandler(async (req, res) => {
  const quotaId = req.params.id;
  if (req.quota.quotatype !== "super" && req.quota._id.toString() !== quotaId) {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }
  const {
    firstname,
    quotaname,
    lastname,
    quotatype,
    password,
    birthday,
    creator,
    remark,
    email,
    phone,
  } = req.body;

  let photo_link = req.file?.path || req.body.photo_link;

  const quotaData = await Quota.findById(quotaId);
  if (!quotaData) {
    res.status(400);
    throw new Error("هذا المستخدم غير موجود");
  } else {
    quotaData.firstname = firstname;
    if (quotaname) quotaData.quotaname = quotaname;
    quotaData.lastname = lastname;
    quotaData.quotatype = quotatype;
    if (password) quotaData.password = password;
    quotaData.birthday = birthday;
    quotaData.creator = creator;
    quotaData.remark = remark;
    if (email) quotaData.email = email;
    quotaData.phone = phone;
    quotaData.photo_link = photo_link;
    const updatedQuota = await quotaData.save();
    res.status(201).json(updatedQuota);
  }

  const editorId = req.quota._id;
  if (quotaId !== editorId) {
    res.status(400);
    throw new Error("عملية غير مرخصة");
  }
});

const deleteQuota = asyncHandler(async (req, res) => {
  const quotaId = req.params.id;
  const quotaData = await Quota.findById(quotaId);

  if (req.quota.quotatype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!quotaData) {
    res.status(400);
    throw new Error("هذا المستخدم غير موجود");
  } else {
    //do somethink
    await quotaData.remove();
    res.json({ message: "تم حذف المستخدم" });
  }
});

module.exports = {
  addNewQuota,
  authQuota,
  getQuotas,
  getQuotaById,
  editQuota,
  deleteQuota,
};
