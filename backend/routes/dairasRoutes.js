const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getDairas,
  getDairaByًWilya,
} = require("../controllers/dairasControllers");

const router = express.Router();

router.route("/").get(getDairas).post(getDairaByًWilya);

module.exports = router;
