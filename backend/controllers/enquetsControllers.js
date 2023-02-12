const asyncHandler = require("express-async-handler");
const Dossier = require("../models/dossierModel");
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
  const dossierByDates = await Dossier.aggregate([
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

const getEnquetCNLFileTest = asyncHandler(async (req, res) => {
  var {} = req.body;

  const file = XLSX.readFile("../Taibet Moins 35 (11-02-2023).xlsx", {
    dense: true,
    dateNF: "dd/mm/yyyy",
  });

  var excel_file;

  // var work_book = XLSX.read(file, { type: "array", dateNF: "dd/mm/yyyy" });
  var sheet_name = file.SheetNames;
  console.log(sheet_name);
  var stream = XLSX.stream.to_json(file.Sheets[sheet_name[2]], {
    raw: false,
  });

  var excel_file = [];
  stream.on("data", function (data) {
    excel_file.push(data);
  });

  stream.on("end", function () {
    var newData = [];
    const dossiersMaped = excel_file?.map(
      asyncHandler(async (dossier) => {
        // // extract demandeur

        const {
          "N°": numOrdre,
          Type: typeDateNDem,
          Typeproduit: typeDateNCon,
          "Ref demande": num_dos,
          "Nom DE CONJOINT": nom_fr_conj,
          Nom: nom_fr_dema,
        } = dossier;

        // find dossier to update
        const dossierToEnquet = await Dossier.find({ num_dos: num_dos });
        if (dossierToEnquet.length > 0) {
          var demandeur = {};
          var conjoin = {};
          if (
            dossierToEnquet[0].id_demandeur &&
            !(nom_fr_dema === "") &&
            !(nom_fr_dema === "/") &&
            !(nom_fr_dema == null)
          ) {
            // get demandeur
            demandeur = await Person.findById(dossierToEnquet[0].id_demandeur);
          }
          if (
            dossierToEnquet[0].id_conjoin &&
            !(nom_fr_conj === "") &&
            !(nom_fr_conj === "/") &&
            !(nom_fr_conj == null)
          ) {
            // get conjoin
            conjoin = await Person.findById(dossierToEnquet[0].id_conjoin);
          }
          var newRecord = {
            Ordre: numOrdre,
            Nom: demandeur?.nom_fr || "",
            Prénom: demandeur?.prenom_fr || "",
            Sexe: demandeur?.gender || "",
            "Date de Naissance": demandeur?.date_n || "",
            "Type Date de Naissance": typeDateNDem || "",
            "Commune de Naissance": demandeur?.lieu_n_fr || "",
            "WILAYA DE NAISSANCE": demandeur?.wil_n || "",
            "N°EXTR DE NAISSANCE": demandeur?.num_act || "",
            "Sit. Fam": demandeur?.stuation_f || "",
            "Prénom du Pére": demandeur?.prenom_p_fr || "",
            "Nom de la Mére": demandeur?.nom_m_fr || "",
            "Prénom de la Mére": demandeur?.prenom_m_fr || "",
            "Nom Conj": conjoin?.nom_fr || "",
            "Prénom conj": conjoin?.prenom_fr || "",
            "Date de Naissance conj": conjoin?.date_n || "",
            "Type Date de Naissance conj": typeDateNCon || "",
            "Commune de Naissance conj": conjoin?.lieu_n_fr || "",
            "WILAYA DE NAISSANCE conj": conjoin?.wil_n || "",
            "N°EXTR DE NAISSANCE conj": conjoin?.num_act || "",
            "Prénom du Pére conj": conjoin?.prenom_p_fr || "",
            "Nom de la Mére conj": conjoin?.nom_m_fr || "",
            "Prénom de la Mére conj": conjoin?.prenom_m_fr || "",
          };
          newData.push(newRecord);
        }
      })
    );
    console.log(newData);
    return Promise.all(dossiersMaped).then(() => {
      var newWB = XLSX.utils.book_new();
      var newWS = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(newWB, newWS, "List");
      XLSX.writeFile(newWB, "EnquetCNLnew.xlsx");
      const fileCNL = `EnquetCNLnew.xlsx`;
      res.download(fileCNL);
    });
  });
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

const getEnquetCNASFileTest = asyncHandler(async (req, res) => {
  var {} = req.body;
  fs.copyFile("enqueteCNAS.mdb", "enqCNAS.mdb", (err) => {
    if (err) {
      console.log("Error Found:", err);
    } else {
      console.log("File copied succesfuly");
    }
  });

  const file = XLSX.readFile("../Taibet Moins 35 (11-02-2023).xlsx", {
    dense: true,
    dateNF: "dd/mm/yyyy",
  });

  var excel_file;

  // var work_book = XLSX.read(file, { type: "array", dateNF: "dd/mm/yyyy" });
  var sheet_name = file.SheetNames;
  var stream = XLSX.stream.to_json(file.Sheets[sheet_name[2]], {
    raw: false,
  });

  var excel_file = [];
  stream.on("data", function (data) {
    excel_file.push(data);
  });

  stream.on(
    "end",
    asyncHandler(async function () {
      var newData = [];
      const dossiersMaped = excel_file?.map(
        asyncHandler(async (dossier) => {
          // // extract demandeur

          const {
            "N°": numOrdre,
            "Ref demande": num_dos,
            "Nom DE CONJOINT": nom_fr_conj,
            Nom: nom_fr_dema,
          } = dossier;
          console.log(num_dos);
          // find dossier to update
          const dossierToEnquet = await Dossier.find({ num_dos: num_dos });
          if (dossierToEnquet.length > 0) {
            var demandeur = {};
            var conjoin = {};
            if (
              dossierToEnquet[0].id_demandeur &&
              !(nom_fr_dema === "") &&
              !(nom_fr_dema === "/") &&
              !(nom_fr_dema == null)
            ) {
              // get demandeur
              demandeur = await Person.findById(
                dossierToEnquet[0].id_demandeur
              );
            }
            if (
              dossierToEnquet[0].id_conjoin &&
              !(nom_fr_conj === "") &&
              !(nom_fr_conj === "/") &&
              !(nom_fr_conj == null)
            ) {
              // get conjoin
              conjoin = await Person.findById(dossierToEnquet[0].id_conjoin);
            }
            if (demandeur._id) {
              var newRecord = {
                "N°": numOrdre,
                NUM_DOSS: num_dos,
                CODE_P: "",
                NOM_P: demandeur?.nom_fr || "",
                PRENOM_P: demandeur?.prenom_fr || "",
                DDN_P: demandeur?.date_n || "",
                ADR_P: "",
                NUM_ACT_P: demandeur?.num_act || "",
                PP: demandeur?.prenom_p_fr || "",
                NPM: `${demandeur?.nom_m_fr} ${demandeur?.prenom_m_fr}` || "",
                LIB_SEXE: demandeur?.gender || "",
                CC: "",
                NC: demandeur?.lieu_n_fr || "",
                WILAYA: demandeur?.wil_n || "",
              };
              newData.push(newRecord);
            }
            if (conjoin._id) {
              var newRecord2 = {
                "N°": "",
                NUM_DOSS: num_dos,
                CODE_P: "",
                NOM_P: conjoin?.nom_fr || "",
                PRENOM_P: conjoin?.prenom_fr || "",
                DDN_P: conjoin?.date_n || "",
                ADR_P: "",
                NUM_ACT_P: conjoin?.num_act || "",
                PP: conjoin?.prenom_p_fr || "",
                NPM: `${conjoin?.nom_m_fr} ${conjoin?.prenom_m_fr}` || "",
                LIB_SEXE: conjoin?.gender || "",
                CC: "",
                NC: conjoin?.lieu_n_fr || "",
                WILAYA: conjoin?.wil_n || "",
              };
              newData.push(newRecord2);
            }

            var newWB = XLSX.utils.book_new();
            var newWS = XLSX.utils.json_to_sheet(newData);
            XLSX.utils.book_append_sheet(newWB, newWS, "Table1");
            XLSX.writeFile(newWB, "EnquetCNAS.xlsx");
          }
        })
      );

      return Promise.all(dossiersMaped)
        .then(() => {
          const fileCNL = `EnquetCNAS.xlsx`;
          // file download
          res.download(fileCNL);
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
});

const getEnquetCASNOSFileTest = asyncHandler(async (req, res) => {
  var {} = req.body;
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

  const file = XLSX.readFile("../Taibet Moins 35 (11-02-2023).xlsx", {
    dense: true,
    dateNF: "dd/mm/yyyy",
  });

  var excel_file;

  // var work_book = XLSX.read(file, { type: "array", dateNF: "dd/mm/yyyy" });
  var sheet_name = file.SheetNames;
  console.log(sheet_name);
  var stream = XLSX.stream.to_json(file.Sheets[sheet_name[2]], {
    raw: false,
  });

  var excel_file = [];
  stream.on("data", function (data) {
    excel_file.push(data);
  });

  stream.on(
    "end",
    asyncHandler(async function () {
      var newData = [];
      const dossiersMaped = excel_file?.map(
        asyncHandler(async (dossier) => {
          // // extract demandeur

          const {
            "N°": numOrdre,
            "Ref demande": num_dos,
            "Nom DE CONJOINT": nom_fr_conj,
            Nom: nom_fr_dema,
          } = dossier;

          // find dossier to update
          const dossierToEnquet = await Dossier.find({ num_dos: num_dos });
          if (dossierToEnquet.length > 0) {
            var demandeur = {};
            var conjoin = {};
            if (
              dossierToEnquet[0].id_demandeur &&
              !(nom_fr_dema === "") &&
              !(nom_fr_dema === "/") &&
              !(nom_fr_dema == null)
            ) {
              // get demandeur
              demandeur = await Person.findById(
                dossierToEnquet[0].id_demandeur
              );

              var demandeurF = {
                CODE_P: numOrdre,
                NOM_P: demandeur.nom_fr || "",
                PRENOM_P: demandeur.prenom_fr || "",
                DNN_P: demandeur.date_n || "1800-01-01",
                ADR_P: "",
                NUM_ACT_P: demandeur.num_act || "",
                PRENP: demandeur.prenom_p_fr || "",
                NPM: `${demandeur.nom_m_fr || ""} ${
                  demandeur.prenom_m_fr || ""
                }`,
                LIB_SEXE: demandeur.gender || "",
                CC: "",
                NC: demandeur.lieu_n_fr || "",
                WILAYA: demandeur.wil_n || "",
              };
              records.push(demandeurF);
            }
            if (
              dossierToEnquet[0].id_conjoin &&
              !(nom_fr_conj === "") &&
              !(nom_fr_conj === "/") &&
              !(nom_fr_conj == null)
            ) {
              // get conjoin
              conjoin = await Person.findById(dossierToEnquet[0].id_conjoin);
              var conjoinF = {
                CODE_P: `${parseInt(numOrdre) + excel_file.length}`,
                NOM_P: conjoin.nom_fr || "",
                PRENOM_P: conjoin.prenom_fr || "",
                DNN_P: conjoin.date_n || "1800-01-01",
                ADR_P: "",
                NUM_ACT_P: conjoin.num_act || "",
                PRENP: conjoin.prenom_p_fr || "",
                NPM: `${conjoin.nom_m_fr || ""} ${conjoin.prenom_m_fr || ""}`,
                LIB_SEXE: conjoin.gender || "",
                CC: "",
                NC: conjoin.lieu_n_fr || "",
                WILAYA: conjoin.wil_n || "",
              };
              records.push(conjoinF);
            }

            console.log("dossier added");
          }
        })
      );

      return Promise.all(dossiersMaped)
        .then(
          asyncHandler(async () => {
            // file download
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
          })
        )
        .catch((err) => {
          console.log(err);
        });
    })
  );
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
  getEnquetCNLFileTest,
  getEnquetCNASFileTest,
  getEnquetCASNOSFileTest,
};
