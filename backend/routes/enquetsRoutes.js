const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const {
  getEnquetCNLFile,
  getEnquetCNASFile,
  getEnquetCASNOSFile,
  getEnquetCNLFileTest,
  getEnquetCNASFileTest,
  getEnquetCASNOSFileTest,
  getDossierByDates,
  uploadDossierEnq,
} = require("../controllers/enquetsControllers");

const dossiersEnqStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./dossiersEnqUpload/`);
  },
  filename: function (req, file, cb) {
    cb(null, `${file?.originalname}`);
  },
});
const uploadDossiersEnq = multer({
  storage: dossiersEnqStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const router = express.Router();

router.route("/enquetCNLs").post(getDossierByDates);
router
  .route("/uploadDossierEnq")
  .post(uploadDossiersEnq.single("dossierEnq"), uploadDossierEnq);
router.route("/enqCNL").post(getEnquetCNLFile);
router.route("/enqCNLtest").post(getEnquetCNLFileTest);
router.route("/enqCNAS").post(getEnquetCNASFile);
router.route("/enqCNAStest").post(getEnquetCNASFileTest);
router.route("/enqCASNOS").post(getEnquetCASNOSFile);
router.route("/enqCASNOStest").post(getEnquetCASNOSFileTest);

module.exports = router;
