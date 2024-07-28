const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getCommunes,
  getCommuneById,
  createCommune,
  updateCommune,
  deleteCommune,
  getCommuneByًWilya,
  getCommuneByًDaira,
} = require("../controllers/communesControllers");

const router = express.Router();

router.route("/").get(getCommunes).post(getCommuneByًWilya);
router.route("/daira").get(getCommunes).post(getCommuneByًDaira);
router
  .route("/:id")
  .get(getCommuneById)
  .put(protect, updateCommune)
  .delete(protect, deleteCommune);
router.route("/create").post(protect, createCommune);

module.exports = router;
