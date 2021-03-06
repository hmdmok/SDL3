const express = require("express");
const userControllers = require("../controllers/userControllers");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const userPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./usersPicUpload/`);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.username}_Profile_Picture.png`);
  },
});
const uploadUserPhoto = multer({
  storage: userPhotoStorage,
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
    userControllers.addNewUser
  );
router.route("/").get(protect, userControllers.getUsers);
router.route("/login").post(userControllers.authUser);
router
  .route("/:id")
  .get(userControllers.getUserById)
  .put(protect, uploadUserPhoto.single("photo_link"), userControllers.editUser)
  .delete(protect, userControllers.deleteUser);

module.exports = router;
