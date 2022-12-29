const bcrypt = require("bcryptjs/dist/bcrypt");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

const addDossiers = asyncHandler(async (req, res) => {
    if (req.user.usertype !== "super") {
      res.status(400);
      throw new Error("المستخدم غير مرخص");
    }
      
    const photo_link = req.file?.path;
  
   
  });

  module.exports = {addDossiers};