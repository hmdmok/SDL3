const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
} = require("../controllers/personsControllers");

const router = express.Router();

router.route("/").get(getPersons);
router
  .route("/:id")
  .get(getPersonById)
  .put(updatePerson)
  .delete(protect, deletePerson);
router.route("/create").post(createPerson);

module.exports = router;
