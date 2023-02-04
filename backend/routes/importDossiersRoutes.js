const express = require("express");
const importationDossiersControllers = require("../controllers/importationDossiersControllers");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const importationFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./importationFileUpload/`);
  },
  filename: function (req, file, cb) {
    cb(null, req.body.fileName);
  },
});
const uploadImportationFile = multer({
  storage: importationFileStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    uploadImportationFile.single("importation_File"),
    importationDossiersControllers.addDossiers
  );
router
  .route("/update")
  .post(
    protect,
    uploadImportationFile.single("importation_File"),
    importationDossiersControllers.updateDossiers
  );
router
  .route("/updateFr")
  .post(importationDossiersControllers.updateDossiersFran);

router.route("/correctionDB").post(importationDossiersControllers.correctionDB);

module.exports = router;
