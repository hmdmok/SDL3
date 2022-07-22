const asyncHandler = require("express-async-handler");
const ScanDossier = require("../models/scanDossierModel");

const getScanDossierByNum = asyncHandler(async (req, res) => {
  const num = req.params.num;
  const scanDossierByNum = await ScanDossier.find({ num_dossier: num });
  if (scanDossierByNum) res.json(scanDossierByNum);
  else {
    res.status(400);
    throw new Error("الملف الممسوح غير موجود");
  }
});

const createScanDossier = asyncHandler(async (req, res) => {
  const { num_dossier, nom, creator } = req.body;

  if (!num_dossier || !creator || !nom || !req.file) {
    res.status(400);
    throw new Error("يجب ادخال كل معلومات النقاط");
  }
  const path = req.file?.path;

  const scanDossierToAdd = await ScanDossier.create({
    num_dossier,
    nom,
    creator,
    path,
  });

  if (scanDossierToAdd) {
    res.status(201).json({
      _id: scanDossierToAdd._id,
      nom: scanDossierToAdd.nom,
      path: scanDossierToAdd.path,
    });
  } else {
    res.status(400);
    throw new Error("خطء في انشاء الملف الممسوح");
  }
});

const updateScanDossier = asyncHandler(async (req, res) => {
  const { num_dossier, nom, creator } = req.body;

  const num = req.params.num;
  const scanDossierToUpdate = await ScanDossier.find({ num_dossier: num });

  if (!scanDossierToUpdate) {
    res.status(400);
    throw new Error("هذا الملف الممسوح غير موجود");
  } else {
    const path = req.file?.path;
    scanDossierToUpdate.num_dossier =
      num_dossier || scanDossierToUpdate.num_dossier;
    scanDossierToUpdate.nom = nom || scanDossierToUpdate.nom;
    scanDossierToUpdate.creator = creator || scanDossierToUpdate.creator;
    scanDossierToUpdate.path = path || scanDossierToUpdate.path;

    const updatedScanDossier = await scanDossierToUpdate.save();
    res.status(201).json(updatedScanDossier);
  }
});

const deleteScanDossier = asyncHandler(async (req, res) => {
  const scanDossierId = req.params.id;
  const scanDossierData = await ScanDossier.findById(scanDossierId);

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!scanDossierData) {
    res.status(400);
    throw new Error("هذا التنقيط غير موجود");
  } else {
    //do somethink
    await scanDossierData.remove();
    res.json({ message: "تم حذف التنقيط" });
  }
});

module.exports = {
  createScanDossier,
  getScanDossierByNum,
  updateScanDossier,
  deleteScanDossier,
};
