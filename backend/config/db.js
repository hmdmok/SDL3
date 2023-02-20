const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Wilaya = require("../models/wilayasModel");
const Commune = require("../models/communesModel");
const User = require("../models/userModel");

const connectDB = asyncHandler(async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/test");

    // const conn = await mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting MongoDB: ${error}`);
    process.exit();
  }
});

const initiateDB = asyncHandler(async () => {
  try {
    //check the wilayas count
    const listUsers = await User.find();
    if (listUsers.length < 1) {
      //populate the User collection
      const newUser = await User.create({
        username: "Admin",
        firstname: "Admin",
        lastname: "Admin",
        usertype: "super",
        password: "Admin",
        birthday: "1985-02-11",
        creator: "Admin",
        remark: "Admin",
        email: "hmd.moknine@gmail.com",
        phone: "0660071445",
        photo_link: "usersPicUpload/default.png",
      });
    }
    //read JSON file
    const communesDATA = require("./algeria_cities.json");

    //check the wilayas count
    const listWilayas = await Wilaya.find();
    if (listWilayas.length < 58) {
      //populate the Wilayat collection
      for (var i = 1; i < 59; i++) {
        for (var j = 0; j < communesDATA.length; j++) {
          if (communesDATA[j].wilaya_code == i) {
            const newWilaya = await Wilaya.create({
              code: communesDATA[j].wilaya_code,
              nomAr: communesDATA[j].wilaya_name,
              nomFr: communesDATA[j].wilaya_name_ascii,
            });

            break;
          }
        }
      }
    }

    //check the Communes count
    const listCommunes = await Commune.find();
    if (listCommunes.length < 1541) {
      //populate the Commune collection
      for (var j = 0; j < communesDATA.length; j++) {
        const newCommune = await Commune.create({
          code: communesDATA[j].id,
          nomAr: communesDATA[j].commune_name,
          nomFr: communesDATA[j].commune_name_ascii,
          codeWilaya: communesDATA[j].wilaya_code,
        });
      }
    }
  } catch (error) {
    console.log(`Error initating Database: ${error}`);
    process.exit();
  }
});

module.exports = { connectDB, initiateDB };
