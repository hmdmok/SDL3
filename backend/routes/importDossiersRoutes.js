const express = require("express");
const importationDossiersControllers = require("../controllers/importationDossiersControllers");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(importationDossiersControllers.addDossiers);
router.route("/update").post(importationDossiersControllers.updateDossiers);
router
  .route("/updateFr")
  .post(importationDossiersControllers.updateDossiersFran);

module.exports = router;
