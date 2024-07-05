const asyncHandler = require("express-async-handler");
const Dossier = require("../models/dossierModel");
const Person = require("../models/personModel");
const Notes = require("../models/notesModel");
const DossierEnq = require("../models/dossierEnqModel");
const Enquete = require("../models/enqueteModel");
const generateToken = require("../utils/generateToken");
const { calculate } = require("./CalculeNotesDossier");
const XLSX = require("sheetjs-style");
const ADODB = require("node-adodb");
const {
  convertDateFormat,
  sanitizeInput,
  getCurrentDateTimeString,
  compressFolderToZip,
  getFullDossier,
  getAlphabet,
  getCivility,
  getGenderName,
} = require("../config/functions");
const fs = require("fs");
const { DBFFile } = require("dbffile");
const ExcelJS = require("exceljs");
const System = require("../models/systemModel");
const path = require("path");

const createRecord = (dossier, newData, type) => {
  const createNewRecord = (person, address, numAct, prefix) => ({
    CODE_P: newData.length + 1,
    NOM_P: sanitizeInput(person.nom_fr || ""),
    PRENOM_P: sanitizeInput(person.prenom_fr || ""),
    DDN_P: convertDateFormat(person.date_n, "S").date || "",
    ADR_P: sanitizeInput(address || ""),
    NUM_ACT_P: sanitizeInput(numAct || ""),
    PP: sanitizeInput(person.prenom_p_fr || ""),
    NPM: sanitizeInput(`${person.nom_m_fr || ""} ${person.prenom_m_fr || ""}`),
    LIB_SEXE: sanitizeInput(person.gender || ""),
    CC: "",
    NC: sanitizeInput(person.lieu_n_fr || ""),
    WILAYA: sanitizeInput(person.wil_n || ""),
  });

  const { demandeur, conjoin } = dossier;
  const address = dossier.adress || "";

  if (type === "CASNOS" || type === "CNAS") {
    if (demandeur) {
      newData.push(createNewRecord(demandeur, address, demandeur.num_act));
    }
    if (conjoin) {
      newData.push(createNewRecord(conjoin, address, conjoin.num_act));
    }
  }
};

const getDossierByDates = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.body;
  const dossiers = await getFullDossier();

  const dossierByDates = dossiers.filter(
    (dossier) =>
      new Date(dossier.date_depo) >= new Date(fromDate) &&
      new Date(dossier.date_depo) <= new Date(toDate)
  );

  if (dossierByDates.length) {
    res.json(dossierByDates);
  } else {
    res.status(400);
    throw new Error("لا توجد ملفات");
  }
});

const uploadDossierEnq = asyncHandler(async (req, res) => {
  const { creator, remark } = req.body;
  const dossierEnqPath = req.file?.path;
  const dateRecu = new Date();

  const newDossierEnq = await DossierEnq.create({
    nomFichier: dossierEnqPath,
    dateRecu,
    creator,
    remark,
  });

  if (newDossierEnq) {
    res.status(201).json({
      _id: newDossierEnq._id,
      nomFichier: newDossierEnq.nomFichier,
      dateRecu: newDossierEnq.dateRecu,
    });
  } else {
    res.status(400);
    throw new Error("Error Recieving File!");
  }
});

const getEnquetCNLFile = asyncHandler(async (req, res) => {
  const { dossierEnq: dossiersList } = req.body;
  const data = await getFullDossier();
  const selectedDossiers =
    dossiersList.length > 0
      ? dossiersList.map((e) => data.find((d) => d._id.toString() === e))
      : data;

  const workbook = XLSX.readFile("CNL.xlsx", { cellStyles: true });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const cellStyles = {
    header: {
      fill: { patternType: "solid" },
      font: {
        name: "Times New Roman",
        sz: 20,
        color: { rgb: "FFFFFF" },
      },
      border: {
        top: { style: "thin", color: { auto: 1 } },
        bottom: { style: "thin", color: { auto: 1 } },
        left: { style: "thin", color: { auto: 1 } },
        right: { style: "thin", color: { auto: 1 } },
      },
    },
    title: {
      font: {
        name: "Times New Roman",
        sz: 24,
        bold: true,
        underline: true,
      },
      alignment: { horizontal: "center" },
    },
    default: {
      font: {
        name: "Times New Roman",
        sz: 14,
      },
    },
  };

  worksheet["A2"].s = cellStyles.title;
  ["A3", "A4", "A5", "I6", "I7"].forEach((cell) => {
    worksheet[cell].s = cellStyles.title;
  });

  getAlphabet("fr").forEach((letter) => {
    if (!["X", "Y", "Z"].includes(letter.toUpperCase())) {
      worksheet[`${letter.toUpperCase()}9`].s = cellStyles.header;
    }
  });

  selectedDossiers.forEach((record, i) => {
    const rowIndex = i + 10;
    XLSX.utils.sheet_add_aoa(worksheet, [[i + 1]], { origin: `A${rowIndex}` });
    worksheet[`A${rowIndex + 1}`].s = cellStyles.default;

    const addPersonData = (person, prefix) => {
      [
        ["B", person.nom_fr],
        ["C", person.prenom_fr],
        ["D", person.gender],
        ["E", convertDateFormat(person.date_n, "S").date],
        ["F", person.type_date_n],
        ["G", person.lieu_n_fr],
        ["H", person.wil_n],
        ["I", person.num_act],
        ["J", person.stuation_f],
        ["K", person.prenom_p_fr],
        ["L", person.nom_m_fr],
        ["M", person.prenom_m_fr],
      ].forEach(([col, value]) => {
        XLSX.utils.sheet_add_aoa(worksheet, [[value]], {
          origin: `${col}${rowIndex}`,
        });
        worksheet[`${col}${rowIndex + 1}`].s = cellStyles.default;
      });
    };

    if (record.demandeur) {
      addPersonData(record.demandeur, "");
    }
    if (record.conjoin) {
      addPersonData(record.conjoin, "N");
    }
  });

  res.status(200).send("CNL file processed successfully");
});

module.exports = {
  getDossierByDates,
  uploadDossierEnq,
  getEnquetCNLFile,
};
