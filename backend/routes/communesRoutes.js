const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getCommunes,
  getCommuneById,
  createCommune,
  updateCommune,
  deleteCommune,
  getCommuneByًWilya,
} = require("../controllers/communesControllers");

const router = express.Router();

router.route("/").get(getCommunes).post(getCommuneByًWilya);
router
  .route("/:id")
  .get(getCommuneById)
  .put(protect, updateCommune)
  .delete(protect, deleteCommune);
router.route("/create").post(protect, createCommune);

module.exports = router;
