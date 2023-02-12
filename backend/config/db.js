const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

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
    //read JSON file
    const communesDATA = require("./algeria_cities.json");

    //populate the Wilayat collection
    for (var i = 1; i < 59; i++) {
      for (var j = 0; j < communesDATA.length; j++) {
        if (communesDATA[j].wilaya_code === i) {
          console.log(
            `NomFR Wilaya: ${communesDATA[j].wilaya_name_ascii}, NomAR Wilaya: ${communesDATA[j].wilaya_name}.`
          );
          continue;
        }
      }
    }

    //populate the Dairat collection
    //populate the Commune collection
  } catch (error) {
    console.log(`Error initating Database: ${error}`);
    process.exit();
  }
});

module.exports = { connectDB, initiateDB };
