const asyncHandler = require("express-async-handler");
const Quota = require("../models/quotaModel");
const System = require("../models/systemModel");
const generateToken = require("../utils/generateToken");
const { initiateDB } = require("../config/db");

const addNewQuota = asyncHandler(async (req, res) => {
  const { quotaname, quotanameFr, quotadate, quotaquant, creator, remark } =
    req.body;

    console.log(req.file?.path)
  const quotascan = req.file?.path;

  const quotaExists = await Quota.findOne({ quotadate });

  if (quotaExists) {
    res.status(400);
    throw new Error("هذه الحصة مسجلة من قبل");
  }

  const quota = await Quota.create({
    quotaname,
    quotanameFr,
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
      quotanameFr: quota.quotanameFr,
      quotadate: quota.quotadate,
      quotaquant: quota.quotaquant,
      quotascan: quota.quotascan,
      token: generateToken(quota._id),
    });
  } else {
    res.status(400);
    throw new Error("Error Reating new quota !");
  }
});

const getQuotas = asyncHandler(async (req, res) => {
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

  const { quotaname, quotanameFr, quotadate, quotaquant, creator, remark } =
    req.body;

  let quotascan = req.file?.path || req.body.quotascan;

  const quotaData = await Quota.findById(quotaId);
  if (!quotaData) {
    res.status(400);
    throw new Error("هذا المستخدم غير موجود");
  } else {
   
    if (quotaname) quotaData.quotaname = quotaname;
    if (quotanameFr) quotaData.quotanameFr = quotanameFr;
    if (quotadate) quotaData.quotadate = quotadate;
    if (quotadate) quotaData.quotadate = quotadate;
    if (quotaquant) quotaData.quotaquant = quotaquant;
    quotaData.creator = creator;
    quotaData.remark = remark;
    if (quotascan) quotaData.quotascan = quotascan;
    const updatedQuota = await quotaData.save();
    res.status(201).json(updatedQuota);
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
  getQuotas,
  getQuotaById,
  editQuota,
  deleteQuota,
};
