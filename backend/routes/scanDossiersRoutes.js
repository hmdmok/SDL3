const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const {
  getScanDossierByNum,
  createScanDossier,
  updateScanDossier,
  deleteScanDossier,
} = require("../controllers/scanDossiersControllers");
const dossierScanStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./dossiersScanUpload/`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `dossier_${req.params.num}_${req.body.nom}_Picture.jpg`
    );
  },
});
const uploadDossierPhoto = multer({
  storage: dossierScanStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const router = express.Router();

router
  .route("/:num")
  .get(getScanDossierByNum)
  .post(uploadDossierPhoto.single("scanedFile"), createScanDossier)
  .put(uploadDossierPhoto.single("scanedFile"), updateScanDossier)
  .delete(protect, deleteScanDossier);

module.exports = router;
