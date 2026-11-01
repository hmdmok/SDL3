const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
} = require("../controllers/PersonsControllers");

const router = express.Router();

router.route("/").get(protect, getPersons);
router
  .route("/:id")
  .get(protect, getPersonById)
  .put(protect, updatePerson)
  .delete(protect, deletePerson);
router.route("/create").post(protect, createPerson);

module.exports = router;
