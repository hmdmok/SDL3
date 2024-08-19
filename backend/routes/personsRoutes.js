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

router.route("/").get(getPersons);
router
  .route("/:id")
  .get(getPersonById)
  .put(updatePerson)
  .delete(deletePerson);
router.route("/create").post(createPerson);

module.exports = router;
