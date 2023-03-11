const express = require("express");
const dossiers = require("./DataBase/dossiers");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const enquetsRoutes = require("./routes/enquetsRoutes");
const systemRoutes = require("./routes/systemRoutes");
const dossiersRoutes = require("./routes/dossiersRoutes");
const scanDossiersRoutes = require("./routes/scanDossiersRoutes");
const notesRoutes = require("./routes/notesRoutes");
const wilayasRoutes = require("./routes/wilayasRoutes");
const communesRoutes = require("./routes/communesRoutes");
const dairasRoutes = require("./routes/dairasRoutes");
const personsRoutes = require("./routes/personsRoutes");
const importDossiersRoutes = require("./routes/importDossiersRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cors = require("cors");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running ...");
});

app.use("/api/users", userRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/dossiers", dossiersRoutes);
app.use("/api/scandossiers", scanDossiersRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/wilayas", wilayasRoutes);
app.use("/api/communes", communesRoutes);
app.use("/api/dairas", dairasRoutes);
app.use("/api/persons", personsRoutes);
app.use("/api/importationData", importDossiersRoutes);
app.use("/api/enquets", enquetsRoutes);

app.use("/usersPicUpload", express.static("usersPicUpload"));
app.use("/dossiersScanUpload", express.static("dossiersScanUpload"));
app.use("/dossiersEnqUpload", express.static("dossiersEnqUpload"));
app.use("/importationFileUpload", express.static("importationFileUpload"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server is listening at PORT: ${PORT}`));
