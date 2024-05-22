const asyncHandler = require("express-async-handler");
const dossier = require("../models/dossierModel");
const Person = require("../models/personModel");
const Notes = require("../models/notesModel");
const generateToken = require("../utils/generateToken");
const { calculate } = require("./CalculeNotesDossier");
const XLSX = require("xlsx");
const ADODB = require("node-adodb");
const connection = ADODB.open(
  "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=enqCNAS.mdb;"
);
const fs = require("fs");
const { DBFFile } = require("dbffile");

const getDossierByDates = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.body;
  const persons = await Person.aggregate([
    {
      $addFields: { personId: { $toString: "$_id" } },
    },
  ]);
  const dossierByDates = await dossier.aggregate([
    {
      $match: {
        date_depo: {
          $gte: fromDate,
          $lt: toDate,
        },
      },
    },
    {
      $lookup: {
        localField: "id_demandeur",
        foreignField: "personId",
        as: "demandeur",
        pipeline: [{ $documents: persons }],
      },
    },
    {
      $lookup: {
        localField: "id_conjoin",
        foreignField: "personId",
        as: "conjoin",
        pipeline: [{ $documents: persons }],
      },
    },
  ]);

  if (dossierByDates) {
    res.json(dossierByDates);
  } else {
    res.status(400);
    throw new Error("لا توجد ملفات");
  }
});

const getEnquetCNLFile = asyncHandler(async (req, res) => {
  var { dossierEnq } = req.body;
  var newData = dossierEnq.map(function (record, i) {
    var newRecord = {
      Ordre: i + 1,
      Nom: record.dossier.demandeur[0]?.nom_fr || "" || "",
      Prénom: record.dossier.demandeur[0]?.prenom_fr || "",
      Sexe: record.dossier.demandeur[0]?.gender || "",
      "Date de Naissance": record.dossier.demandeur[0]?.date_n || "",
      "Type Date de Naissance": "" || "",
      "Commune de Naissance": record.dossier.demandeur[0]?.com_n || "",
      "WILAYA DE NAISSANCE": record.dossier.demandeur[0]?.wil_n || "",
      "N°EXTR DE NAISSANCE": record.dossier.demandeur[0]?.num_act || "",
      "Sit. Fam": record.dossier.demandeur[0]?.stuation_f || "",
      "Prénom du Pére": record.dossier.demandeur[0]?.prenom_p_fr || "",
      "Nom de la Mére": record.dossier.demandeur[0]?.nom_m_fr || "",
      "Prénom de la Mére": record.dossier.demandeur[0]?.prenom_m_fr || "",
      "Nom Conj": record.dossier.conjoin[0]?.nom_fr || "",
      "Prénom conj": record.dossier.conjoin[0]?.prenom_fr || "",
      "Date de Naissance conj": record.dossier.conjoin[0]?.date_n || "",
      "Type Date de Naissance conj": "" || "",
      "Commune de Naissance conj": record.dossier.conjoin[0]?.com_n || "",
      "WILAYA DE NAISSANCE conj": record.dossier.conjoin[0]?.wil_n || "",
      "N°EXTR DE NAISSANCE conj": record.dossier.conjoin[0]?.num_act || "",
      "Prénom du Pére conj": record.dossier.conjoin[0]?.prenom_p_fr || "",
      "Nom de la Mére conj": record.dossier.conjoin[0]?.nom_m_fr || "",
      "Prénom de la Mére conj": record.dossier.conjoin[0]?.prenom_m_fr || "",
    };
    return newRecord;
  });

  var newWB = XLSX.utils.book_new();
  var newWS = XLSX.utils.json_to_sheet(newData);
  XLSX.utils.book_append_sheet(newWB, newWS, "List");
  XLSX.writeFile(newWB, "EnquetCNLnew.xlsx");
  const file = `EnquetCNLnew.xlsx`;
  res.download(file);
});

const getEnquetCNASFile = asyncHandler(async (req, res) => {
  var { dossierEnq } = req.body;
  fs.copyFile("enqueteCNAS.mdb", "enqCNAS.mdb", (err) => {
    if (err) {
      console.log("Error Found:", err);
    } else {
      console.log("File copied succesfuly");
    }
  });

  var newData = await dossierEnq.map(
    asyncHandler(async function (record) {
      if (record.dossier.demandeur.length > 0) {
        const insert = `INSERT INTO  Table1 (NOM_P, PRENOM_P, DDN_P, NUM_ACT_P, PP, NPM, LIB_SEXE, NC, WILAYA)
        VALUES ("${record.dossier.demandeur[0]?.nom_fr || "a"}", 
        "${record.dossier.demandeur[0]?.prenom_fr || "s"}",
        "${record.dossier.demandeur[0]?.date_n || "2000-01-01"}",
        "${record.dossier.demandeur[0]?.num_act || "f"}",
        "${record.dossier.demandeur[0]?.prenom_p_fr || "g"}",
        "${record.dossier.demandeur[0]?.nom_m_fr || "h"}",
        "${record.dossier.demandeur[0]?.gender || "j"}",
        "${record.dossier.demandeur[0]?.com_n || "k"}", 
        "${record.dossier.demandeur[0]?.wil_n || "l"}");`;

        await connection.execute(insert);
      }

      if (record.dossier.conjoin.length > 0) {
        const sql = `INSERT INTO Table1 (NOM_P, PRENOM_P, DDN_P, NUM_ACT_P, PP, NPM, LIB_SEXE, NC, WILAYA) VALUES ("${
          record.dossier.conjoin[0]?.nom_fr || "q"
        }", "${record.dossier.conjoin[0]?.prenom_fr || "w"}",
        "${record.dossier.conjoin[0]?.date_n || "2000-01-01"}", 
        "${record.dossier.conjoin[0]?.num_act || "r"}",
        "${record.dossier.conjoin[0]?.prenom_p_fr || "t"}",
        "${record.dossier.conjoin[0]?.nom_m_fr || "y"}",
        "${record.dossier.conjoin[0]?.gender || "u"}",
        "${record.dossier.conjoin[0]?.com_n || "i"}", 
        "${record.dossier.conjoin[0]?.wil_n || "20"}");`;
        await connection.execute(sql);
      }
      return record;
    })
  );
  const select = `SELECT * FROM Table1;`;
  let selection = await connection.query(select);
  let selection2 = await connection.query(select);
  res.download("enqCNAS.mdb");
});

const getEnquetCASNOSFile = asyncHandler(async (req, res) => {
  var { dossierEnq } = req.body;
  fs.unlink("CASNOSENQ.dbf", (err) => {
    if (err) {
      console.log("Error Found:", err);
    } else {
      console.log("File deleted succesfuly");
    }
  });
  let fieldDescriptors = [
    { name: "CODE_P", type: "C", size: 15 },
    { name: "NOM_P", type: "C", size: 30 },
    { name: "PRENOM_P", type: "C", size: 30 },
    { name: "DNN_P", type: "C", size: 10 },
    { name: "ADR_P", type: "C", size: 80 },
    { name: "NUM_ACT_P", type: "C", size: 6 },
    { name: "PRENP", type: "C", size: 20 },
    { name: "NPM", type: "C", size: 30 },
    { name: "LIB_SEXE", type: "C", size: 12 },
    { name: "CC", type: "C", size: 4 },
    { name: "NC", type: "C", size: 30 },
    { name: "WILAYA", type: "C", size: 20 },
  ];

  let records = [];

  var newData = await dossierEnq.map(
    asyncHandler(async function (record) {
      if (record.dossier.demandeur.length > 0) {
        var demandeur = {
          CODE_P: "",
          NOM_P: record.dossier.demandeur[0]?.nom_fr || "",
          PRENOM_P: record.dossier.demandeur[0]?.prenom_fr || "",
          DNN_P: record.dossier.demandeur[0]?.date_n || "1800-01-01",
          ADR_P: "",
          NUM_ACT_P: record.dossier.demandeur[0]?.num_act || "",
          PRENP: record.dossier.demandeur[0]?.prenom_p_fr || "",
          NPM: `${record.dossier.demandeur[0]?.nom_m_fr || ""} ${
            record.dossier.demandeur[0]?.prenom_m_fr || ""
          }`,
          LIB_SEXE: record.dossier.demandeur[0]?.gender || "",
          CC: "",
          NC: record.dossier.demandeur[0]?.com_n || "",
          WILAYA: record.dossier.demandeur[0]?.wil_n || "",
        };
        records.push(demandeur);
      }
      if (record.dossier.conjoin.length > 0) {
        var conjoin = {
          CODE_P: "",
          NOM_P: record.dossier.conjoin[0]?.nom_fr || "",
          PRENOM_P: record.dossier.conjoin[0]?.prenom_fr || "",
          DNN_P: record.dossier.conjoin[0]?.date_n || "1800-01-01",
          ADR_P: "",
          NUM_ACT_P: record.dossier.conjoin[0]?.num_act || "",
          PRENP: record.dossier.conjoin[0]?.prenom_p_fr || "",
          NPM: `${record.dossier.conjoin[0]?.nom_m_fr || ""} ${
            record.dossier.conjoin[0]?.prenom_m_fr || ""
          }`,
          LIB_SEXE: record.dossier.conjoin[0]?.gender || "",
          CC: "",
          NC: record.dossier.conjoin[0]?.com_n || "",
          WILAYA: record.dossier.conjoin[0]?.wil_n || "",
        };
        records.push(conjoin);
      }
      return record;
    })
  );

  let dbf;
  try {
    dbf = await DBFFile.create("CASNOSENQ.dbf", fieldDescriptors);
    console.log("DBF file created.");
  } catch (error) {
    dbf = await DBFFile.open("CASNOSENQ.dbf", fieldDescriptors);
    console.log("DBF file opend.");
  }
  try {
    await dbf.appendRecords(records);
    console.log(`${records.length} records added.`);
  } catch (error) {
    console.log(`Error adding records: ${error}`);
  }

  res.download("CASNOSENQ.dbf");
});

module.exports = {
  getDossierByDates,
  getEnquetCNLFile,
  getEnquetCNASFile,
  getEnquetCASNOSFile,
};
