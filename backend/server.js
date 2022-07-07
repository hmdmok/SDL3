const express = require("express");
const dossiers = require("./DataBase/dossiers");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const dossiersRoutes = require("./routes/dossiersRoutes");
const notesRoutes = require("./routes/notesRoutes");
const wilayasRoutes = require("./routes/wilayasRoutes");
const communesRoutes = require("./routes/communesRoutes");
const personsRoutes = require("./routes/personsRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running ...");
});

app.use("/api/users", userRoutes);
app.use("/api/dossiers", dossiersRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/wilayas", wilayasRoutes);
app.use("/api/communes", communesRoutes);
app.use("/api/persons", personsRoutes);

app.use("/usersPicUpload", express.static("usersPicUpload"));
app.use("/dossiersScanUpload", express.static("dossiersScanUpload"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server is listening at PORT: ${PORT}`));
