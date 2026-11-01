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
  getDossierBrothersByFilters,
  getDossierBrothersPaged,
  getDossierByNumDoss,
  getDossiersPaged,
} = require("../controllers/dossiersControllers");
const {
  getEnquetCNLFileTest,
  getEnquetCNASFileTest,
  getEnquetCASNOSFileTest,

  getDossierByDates,
} = require("../controllers/enquetsControllers");
const {
  getEnquetCNASFile,
  getEnquetCNLFile,
  getEnquetCASNOSFile,
  getListBenefisiersFile,
  getEnquetCadastreFile,
} = require("../controllers/enquetsControllersTest");
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

router.route("/").get(protect, getDossiers);
router.route("/filtred").get(protect, getDossierByFilters);
router.route("/paged").get(protect, getDossiersPaged);
router.route("/brothers/filtred").get(protect, getDossierBrothersByFilters);
router.route("/brothers/paged").get(protect, getDossierBrothersPaged);
router
  .route("/:id")
  .get(protect, getDossierById)
  .put(protect, updateDossier)
  .delete(protect, deleteDossier);
router
  .route("/num/:num_dos")
  .post(protect, uploadPersonPhoto.single("photo_link"), getDossierByNumDoss);
router.route("/create").post(protect, createDossier);
router.route("/enquetCNLs").post(protect, getDossierByDates);
router.route("/enqCNL").post(protect, getEnquetCNLFile);
router.route("/listBenefisiers").post(protect, getListBenefisiersFile);
router.route("/enqCNLtest").post(protect, getEnquetCNLFileTest);
router.route("/enqCNAS").post(protect, getEnquetCNASFile);
router.route("/enqCadastre").post(protect, getEnquetCadastreFile);
router.route("/enqCNAStest").post(protect, getEnquetCNASFileTest);
router.route("/enqCASNOS").post(protect, getEnquetCASNOSFile);
router.route("/enqCASNOStest").post(protect, getEnquetCASNOSFileTest);

module.exports = router;
