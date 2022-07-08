const bcrypt = require("bcryptjs/dist/bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const addNewUser = asyncHandler(async (req, res) => {
  const {
    firstname,
    username,
    lastname,
    usertype,
    password,
    birthday,
    creator,
    remark,
    email,
    phone,
    photo_link,
  } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("هذا المستخدم موجود من قبل");
  }

  const user = await User.create({
    firstname,
    username,
    lastname,
    usertype,
    password,
    birthday,
    creator,
    remark,
    email,
    phone,
    photo_link,
  });

  if (user) {
    res.status(201).json({ user });
  } else {
    res.status(400);
    throw new Error("Error Reating new user !");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      photo_link: user.photo_link,
    });
  } else {
    res.status(400);
    throw new Error("Error authontificating User !");
  }
});
module.exports = { addNewUser, authUser };
