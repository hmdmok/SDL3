const asyncHandler = require("express-async-handler");
const Wilayas = require("../models/wilayasModel");

const getWilayas = asyncHandler(async (req, res) => {
  const wilayas = await Wilayas.find();
  if (wilayas) res.json(wilayas);
  else {
    res.status(400);
    throw new Error("لا يوجد ولايات في القاعدة");
  }
});

const getWilayaById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const wilayaById = await Wilayas.findById(id);
  if (wilayaById) res.json(wilayaById);
  else {
    res.status(400);
    throw new Error("الولاية غير موجود");
  }
});

const createWilaya = asyncHandler(async (req, res) => {
  const { code, nomAr, nomFr } = req.body;

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!code || !nomAr || !nomFr) {
    res.status(400);
    throw new Error("يجب ادخال كل معلومات الولاية");
  }
  const wilayaToAdd = await Wilayas.create({
    code,
    nomAr,
    nomFr,
  });

  if (wilayaToAdd) {
    res.status(201).json({
      _id: wilayaToAdd._id,
      nom: wilayaToAdd.nomAr,
    });
  } else {
    res.status(400);
    throw new Error("خطء في انشاء الولاية الجديد");
  }
});

const updateWilaya = asyncHandler(async (req, res) => {
  const { code, nomAr, nomFr } = req.body;

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  const id = req.params.id;
  const wilayaToUpdate = await Wilayas.findById(id);

  if (!wilayaToUpdate) {
    res.status(400);
    throw new Error("هذه الولاية غير موجودة");
  } else {
    wilayaToUpdate.code = code || wilayaToUpdate.code;
    wilayaToUpdate.nomAr = nomAr || wilayaToUpdate.nomAr;
    wilayaToUpdate.nomFr = nomFr || wilayaToUpdate.nomFr;

    const updatedWilaya = await wilayaToUpdate.save();
    res.status(201).json(updatedWilaya);
  }
});

const deleteWilaya = asyncHandler(async (req, res) => {
  const wilayaId = req.params.id;
  const wilayaData = await Wilayas.findById(wilayaId);

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!wilayaData) {
    res.status(400);
    throw new Error("هذه الولاية غير موجودة");
  } else {
    //do somethink
    await wilayaData.remove();
    res.json({ message: "تم حذف الولاية" });
  }
});

module.exports = {
  createWilaya,
  getWilayas,
  getWilayaById,
  updateWilaya,
  deleteWilaya,
};
