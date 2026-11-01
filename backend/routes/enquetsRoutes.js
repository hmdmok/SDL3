const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const {
  getEnquetCNLFile,
  getEnquetCNASFile,

  getEnquetCNLFileTest,
  getEnquetCNASFileTest,
  getEnquetCASNOSFileTest,
  getDossierByDates,
  uploadDossierEnq,
} = require("../controllers/enquetsControllers");
const {
  getEnquetCASNOSFile,
} = require("../controllers/enquetsControllersTest");

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

router.route("/enquetCNLs").post(protect, getDossierByDates);
router
  .route("/uploadDossierEnq")
  .post(protect, uploadDossiersEnq.single("dossierEnq"), uploadDossierEnq);
router.route("/enqCNL").post(protect, getEnquetCNLFile);
router.route("/enqCNLtest").post(protect, getEnquetCNLFileTest);
router.route("/enqCNAS").post(protect, getEnquetCNASFile);
router.route("/enqCNAStest").post(protect, getEnquetCNASFileTest);
router.route("/enqCASNOS").post(protect, getEnquetCASNOSFile);
router.route("/enqCASNOStest").post(protect, getEnquetCASNOSFile);

module.exports = router;
