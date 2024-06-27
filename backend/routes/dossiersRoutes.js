const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const {
  getDossiers,
  getDossierById,

  createDossier,
  updateDossier,
  deleteDossier,
  getDossierByFilters,
  getDossierByNumDoss,
} = require("../controllers/dossiersControllers");
const {
  getEnquetCNLFile,
  getEnquetCNASFile,
  getEnquetCASNOSFile,
  getEnquetCNLFileTest,
  getEnquetCNASFileTest,
  getEnquetCASNOSFileTest,
  getListBenefisiersFile,
  getDossierByDates,
} = require("../controllers/enquetsControllers");
const personPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./personsPicUpload/`);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.params.num_dos}_Demandeur_Picture.png`);
  },
});
const dossierScanStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./dossiersScanUpload/`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `dossier_${req.body.numdossier}_${req.body.nomdocument}_Picture.jpg`
    );
  },
});
const uploadDossierPhoto = multer({
  storage: dossierScanStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});
const uploadPersonPhoto = multer({
  storage: personPhotoStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const router = express.Router();

router.route("/").get(getDossiers);
router.route("/filtred").get(getDossierByFilters);
router
  .route("/:id")
  .get(getDossierById)
  .put(updateDossier)
  .delete(protect, deleteDossier);
router
  .route("/num/:num_dos")
  .post(uploadPersonPhoto.single("photo_link"), getDossierByNumDoss);
router.route("/create").post(createDossier);
router.route("/enquetCNLs").post(getDossierByDates);
router.route("/enqCNL").post(getEnquetCNLFile);
router.route("/listBenefisiers").post(getListBenefisiersFile);
router.route("/enqCNLtest").post(getEnquetCNLFileTest);
router.route("/enqCNAS").post(getEnquetCNASFile);
router.route("/enqCNAStest").post(getEnquetCNASFileTest);
router.route("/enqCASNOS").post(getEnquetCASNOSFile);
router.route("/enqCASNOStest").post(getEnquetCASNOSFileTest);

module.exports = router;
