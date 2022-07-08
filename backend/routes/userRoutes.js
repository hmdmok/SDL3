const express = require("express");
const userControllers = require("../controllers/userControllers");

const router = express.Router();

router.route("/").post(userControllers.addNewUser);
router.route("/login").post(userControllers.authUser);

module.exports = router;
