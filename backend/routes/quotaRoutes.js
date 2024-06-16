const express = require("express");
const quotaControllers = require("../controllers/quotaControllers");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const quotaPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./quotasPicUpload/`);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.quotaname}_Profile_Picture.png`);
  },
});
const uploadUserPhoto = multer({
  storage: quotaPhotoStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    uploadUserPhoto.single("photo_link"),
    quotaControllers.addNewQuota
  );
router.route("/").get(protect, quotaControllers.getQuotas);
router.route("/login").post(quotaControllers.authQuota);
router
  .route("/:id")
  .get(quotaControllers.getQuotaById)
  .put(protect, uploadUserPhoto.single("photo_link"), quotaControllers.editQuota)
  .delete(protect, quotaControllers.deleteQuota);

module.exports = router;
