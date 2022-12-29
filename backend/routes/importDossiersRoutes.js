const express = require("express");
const importationDossiersControllers = require("../controllers/importationDossiersControllers");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const dossiersFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./dossiersFileUpload/`);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.date}_Dossiers_File.xlsx`);
  },
});

const uploadDossiersFile = multer({
  storage: dossiersFile,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    uploadDossiersFile.single("DossiersFile_link"),
    importationDossiersControllers.addDossiers
  );


module.exports = router;
