const express = require("express");
const systemControllers = require("../controllers/systemControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(systemControllers.createSystem);
router.route("/").get(protect, systemControllers.getSystem);
router.route("/:id").put(protect, systemControllers.updateSystem);

module.exports = router;
