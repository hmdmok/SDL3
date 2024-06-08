const express = require("express");
const importationDossiersControllers = require("../controllers/importationDossiersControllers");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const importationFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./importationFileUpload/`);
  },
  filename: function (req, file, cb) {
    cb(null, `${file?.originalname}`);
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
  .route("/update")
  .post(
    uploadImportationFile.single("importation_File"),
    importationDossiersControllers.updateDossiers
  );


router.route("/correctionDB").post(importationDossiersControllers.correctionDB);

module.exports = router;
