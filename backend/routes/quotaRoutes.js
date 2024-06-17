const express = require("express");
const quotaControllers = require("../controllers/quotaControllers");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const quotaPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./quotasPicUpload/`);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.quotanameFr}_Picture.png`);
  },
});
const uploadQuotaPhoto = multer({
  storage: quotaPhotoStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const router = express.Router();

router
  .route("/")
  .post(
    uploadQuotaPhoto.single("quotascan"),
    quotaControllers.addNewQuota
  );
router.route("/").get(quotaControllers.getQuotas);
router
  .route("/:id")
  .get(quotaControllers.getQuotaById)
  .put(uploadQuotaPhoto.single("quotascan"), quotaControllers.editQuota)
  .delete(quotaControllers.deleteQuota);

module.exports = router;
