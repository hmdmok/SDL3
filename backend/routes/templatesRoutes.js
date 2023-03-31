const express = require("express");

const {
  getImportationFichierTemplate,
} = require("../controllers/templatesControllers");

const router = express.Router();

router.route("/importationFichierTemplate").post(getImportationFichierTemplate);

module.exports = router;
