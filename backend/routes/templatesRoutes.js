const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const {
  getImportationFichierTemplate,
} = require("../controllers/templatesControllers");

const router = express.Router();

router.route("/importationFichierTemplate").post(protect, getImportationFichierTemplate);

module.exports = router;
