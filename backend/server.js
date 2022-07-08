const express = require("express");
const dossiers = require("./DataBase/dossiers");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const app = express();
dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.send("Server is running ...");
});

app.get("/api/dossiers", (req, res) => {
  res.json(dossiers);
});

app.get("/api/dossiers/:id", (req, res) => {
  const dossier = dossiers.find((d) => d.id === req.params.id);
  res.json(dossier);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server is listening at PORT: ${PORT}`));
