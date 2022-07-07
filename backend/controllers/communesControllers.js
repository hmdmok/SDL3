const asyncHandler = require("express-async-handler");
const Communes = require("../models/communesModel");

const getCommunes = asyncHandler(async (req, res) => {
  const communes = await Communes.find();
  if (communes) res.json(communes);
  else {
    res.status(400);
    throw new Error("لا يوجد بلديات في القاعدة");
  }
});

const getCommuneById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const communeById = await Communes.findById(id);
  if (communeById) res.json(communeById);
  else {
    res.status(400);
    throw new Error("البلدية غير موجودة");
  }
});

const getCommuneByًWilya = asyncHandler(async (req, res) => {
  const codeWilaya = req.body.codeWilaya;
  const communeByWilaya = await Communes.find({ codeWilaya: codeWilaya });
  if (communeByWilaya) res.json(communeByWilaya);
  else {
    res.status(400);
    throw new Error("البلدية غير موجودة");
  }
});

const createCommune = asyncHandler(async (req, res) => {
  const { code, nomAr, nomFr, codeWilaya } = req.body;

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!code || !nomAr || !nomFr || !codeWilaya) {
    res.status(400);
    throw new Error("يجب ادخال كل معلومات البلدية");
  }
  const communeToAdd = await Communes.create({
    code,
    nomAr,
    nomFr,
    codeWilaya,
  });

  if (communeToAdd) {
    res.status(201).json({
      _id: communeToAdd._id,
      nomAr: communeToAdd.nomAr,
    });
  } else {
    res.status(400);
    throw new Error("خطء في انشاء البلدية الجديد");
  }
});

const updateCommune = asyncHandler(async (req, res) => {
  const { code, nomAr, nomFr, codeWilaya } = req.body;

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  const id = req.params.id;
  const communeToUpdate = await Communes.findById(id);

  if (!communeToUpdate) {
    res.status(400);
    throw new Error("هذه البلدية غير موجودة");
  } else {
    communeToUpdate.code = code || communeToUpdate.code;
    communeToUpdate.nomAr = nomAr || communeToUpdate.nomAr;
    communeToUpdate.nomFr = nomFr || communeToUpdate.nomFr;
    communeToUpdate.codeWilaya = codeWilaya || communeToUpdate.codeWilaya;

    const updatedCommune = await communeToUpdate.save();
    res.status(201).json(updatedCommune);
  }
});

const deleteCommune = asyncHandler(async (req, res) => {
  const communeId = req.params.id;
  const communeData = await Communes.findById(communeId);

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!communeData) {
    res.status(400);
    throw new Error("هذه البلدية غير موجودة");
  } else {
    //do somethink
    await communeData.remove();
    res.json({ message: "تم حذف البلدية" });
  }
});

module.exports = {
  createCommune,
  getCommunes,
  getCommuneById,
  getCommuneByًWilya,
  updateCommune,
  deleteCommune,
};
