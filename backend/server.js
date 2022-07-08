const express = require("express");
const dossiers = require("./DataBase/dossiers");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

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

app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server is listening at PORT: ${PORT}`));
