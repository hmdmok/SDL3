const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getWilayas,
  getWilayaById,
  createWilaya,
  updateWilaya,
  deleteWilaya,
} = require("../controllers/wilayasControllers");

const router = express.Router();

router.route("/").get(getWilayas);
router
  .route("/:id")
  .get(getWilayaById)
  .put(protect, updateWilaya)
  .delete(protect, deleteWilaya);
router.route("/create").post(protect, createWilaya);

module.exports = router;
