const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const System = require("../models/systemModel");
const generateToken = require("../utils/generateToken");
const { initiateDB } = require("../config/db");

const addNewUser = asyncHandler(async (req, res) => {
  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }
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
  } = req.body;

  const photo_link = req.file?.path;

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
    res.status(201).json({
      _id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      birthday: user.birthday,
      usertype: user.usertype,
      photo_link: user.photo_link,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Error Reating new user !");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  var noUsers = false;
  const usersList = await User.find();
  const systemsList = await System.find();

  if (systemsList.length > 0) {
    if (usersList.length > 0) {
      const user = await User.findOne({ username });
      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          usertype: user.usertype,
          photo_link: user.photo_link,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("Error authontificating User !");
      }
    } else {
      initiateDB();
      res.status(400);
      throw new Error("No user found please try test connection!");
    }
  } else {
    initiateDB();
    res.status(400);
    throw new Error("Initiate system file!!!");
  }
});

const getUsers = asyncHandler(async (req, res) => {
  if (req.user.usertype !== "super" && req.user.usertype !== "admin") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }
  const allUser = await User.find();
  res.json(allUser);
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const userData = await User.findById(userId);
  if (userData) res.json(userData);
  else {
    res.status(400);
    throw new Error("المستخدم غير موجود");
  }
});

const editUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (req.user.usertype !== "super" && req.user._id.toString() !== userId) {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }
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
  } = req.body;

  let photo_link = req.file?.path || req.body.photo_link;

  const userData = await User.findById(userId);
  if (!userData) {
    res.status(400);
    throw new Error("هذا المستخدم غير موجود");
  } else {
    userData.firstname = firstname;
    if (username) userData.username = username;
    userData.lastname = lastname;
    userData.usertype = usertype;
    if (password) userData.password = password;
    userData.birthday = birthday;
    userData.creator = creator;
    userData.remark = remark;
    if (email) userData.email = email;
    userData.phone = phone;
    userData.photo_link = photo_link;
    const updatedUser = await userData.save();
    res.status(201).json(updatedUser);
  }

  const editorId = req.user._id;
  if (userId !== editorId) {
    res.status(400);
    throw new Error("عملية غير مرخصة");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const userData = await User.findById(userId);

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!userData) {
    res.status(400);
    throw new Error("هذا المستخدم غير موجود");
  } else {
    //do somethink
    await userData.remove();
    res.json({ message: "تم حذف المستخدم" });
  }
});

module.exports = {
  addNewUser,
  authUser,
  getUsers,
  getUserById,
  editUser,
  deleteUser,
};
