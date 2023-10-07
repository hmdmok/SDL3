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

const fs = require("fs");
const { DBFFile } = require("dbffile");
const {
  getAlphabet,
  getCivility,
  getGenderName,
} = require("../config/functions");
const ExcelJS = require("exceljs");

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

const uploadDossierEnq = asyncHandler(async (req, res) => {
  const { creator, remark } = req.body;

  const dossierEnq = req.file?.path;

  const dateRecu = new Date();
  const newDossierEnq = await DossierEnq.create({
    nomFichier: dossierEnq,
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
  var { dossierEnq } = req.body;

  let workbook = XLSX.readFile("CNL.xlsx", { cellStyles: true });
  let first_sheet_name = workbook.SheetNames[0];
  let worksheet = workbook.Sheets[first_sheet_name];

  const ss2 = {
    // set the style for target cell
    font: {
      name: "Times New Roman",
      sz: 24,
      bold: true,
      underline: true,
    },
  };

  const sh1 = {
    // set the style for target cell
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
  };

  const ss3 = {
    // set the style for target cell
    font: {
      name: "Times New Roman",
      sz: 24,
      bold: true,
    },
  };

  worksheet[`A2`].s = {
    // set the style for target cell
    font: {
      name: "Times New Roman",
      sz: 36,
      bold: true,
      underline: true,
    },
    alignment: { horizontal: "center" },
  };

  worksheet[`A3`].s = ss2;
  worksheet[`A4`].s = ss2;
  worksheet[`A5`].s = ss2;

  worksheet[`I6`].s = ss3;
  worksheet[`I7`].s = ss3;

  getAlphabet("fr").map((x) => {
    if (
      x.toUpperCase() !== "X" &&
      x.toUpperCase() !== "Y" &&
      x.toUpperCase() !== "Z"
    ) {
      worksheet[`${x.toUpperCase()}9`].s = sh1;
    }
  });

  var newData = dossierEnq.map(function (record, i) {
    // modify value in D4
    worksheet[`A${i + 11}`].v = record.num_dos;
    worksheet[`A${i + 11}`].s = {
      // set the style for target cell
      font: {
        name: "Times New Roman",
        sz: 14,
      },
    };
    // modify value if D4 is undefined / does not exists
    XLSX.utils.sheet_add_aoa(worksheet, [[record.num_dos]], {
      origin: `A${i + 10}`,
    });

    var newRecord = {
      Ordre: i + 1,
    };
    return newRecord;
  });

  // var newWB = XLSX.utils.book_new();
  // var newWS = XLSX.utils.json_to_sheet(newData);
  // XLSX.utils.book_append_sheet(newWB, newWS, "List");
  const newFileName = `newEnquetCNL_${new Date().toDateString()}.xlsx`;
  XLSX.writeFile(workbook, newFileName, {
    cellStyles: true,
  });
  const file = newFileName;
  res.download(file);
});

const getListBenefisiersFile = asyncHandler(async (req, res) => {
  var { dossiersList, type } = req.body;
  const workbook = new ExcelJS.Workbook();

  let worksheet;
  switch (type) {
    case "pa": {
      await workbook.xlsx.readFile("ListBenefisiers.xlsx");
      worksheet = workbook.worksheets[0];
    }
    case "ma": {
      await workbook.xlsx.readFile("ListBenefisiers.xlsx");
      worksheet = workbook.worksheets[1];
    }
    case "paa": {
      await workbook.xlsx.readFile("ListBenefisiers.xlsx");
      worksheet = workbook.worksheets[2];
    }
    case "maa": {
      await workbook.xlsx.readFile("ListBenefisiers.xlsx");
      worksheet = workbook.worksheets[3];
    }
    case "pf": {
      await workbook.xlsx.readFile("ListBenefisiersFr.xlsx");
      worksheet = workbook.worksheets[0];
    }
    case "mf": {
      await workbook.xlsx.readFile("ListBenefisiersFr.xlsx");
      worksheet = workbook.worksheets[1];
    }
    case "pfa": {
      await workbook.xlsx.readFile("ListBenefisiersFr.xlsx");
      worksheet = workbook.worksheets[2];
    }
    case "mfa": {
      await workbook.xlsx.readFile("ListBenefisiersFr.xlsx");
      worksheet = workbook.worksheets[3];
    }
  }

  const imageId1 = workbook.addImage({
    filename: "HMDMOK logo.PNG",
    extension: "png",
  });

  // insert an image over B2:D6
  worksheet.addImage(imageId1, "AA2:AB3");

  const newDoss = await dossiersList.map(
    asyncHandler(async function (record, i) {
      
      if (type.includes("f"))
        await worksheet.addRow(
          [
            i + 1,
            record.num_dos,
            record.date_depo,
            record.demandeur.nom_fr,
            record.demandeur.prenom_fr,
            getGenderName(record.demandeur.gender, "f"),
            record.demandeur.date_n,
            record.demandeur.num_act,
            record.demandeur.lieu_n_fr,
            getCivility(record.demandeur.stuation_f, "f"),
            record.demandeur.prenom_p_fr,
            record.demandeur.nom_m_fr,
            record.demandeur.prenom_m_fr,
            record.adress,
            record.conjoin?.nom_fr,
            record.conjoin?.prenom_fr,
            record.conjoin?.date_n,
            record.conjoin?.num_act,
            record.conjoin?.lieu_n_fr,
            record.conjoin?.prenom_p_fr,
            record.conjoin?.nom_m_fr,
            record.conjoin?.prenom_m_fr,
          ],
          "i+"
        );
      else
        await worksheet.insertRow(
          8 + i,
          [
            i + 1,
            record.num_dos,
            record.date_depo,
            record.demandeur.nom,
            record.demandeur.prenom,
          ],
          "i+"
        );
    })
  );
  // worksheet.spliceRows(7, 1);
  const newFileName = `List Benifisiers ${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  return Promise.all(newDoss).then(
    asyncHandler(async () => {
      await worksheet.spliceRows(7, 1);
      await workbook.xlsx.writeFile(newFileName);

      const file = newFileName;
      res.download(file);
    })
  );
});

const getEnquetCNLFileTest = asyncHandler(async (req, res) => {
  const { idDossierEnq, creator, remark } = req.body;

  const dossierEnqRecu = await DossierEnq.findById(idDossierEnq);

  const file = XLSX.readFile(dossierEnqRecu?.nomFichier, {
    dense: true,
    dateNF: "dd/mm/yyyy",
  });

  var excel_file;

  // var work_book = XLSX.read(file, { type: "array", dateNF: "dd/mm/yyyy" });
  var sheet_name = file.SheetNames;
  console.log(sheet_name);
  var stream = XLSX.stream.to_json(file.Sheets[sheet_name[0]], {
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
          console.log(dossierToEnquet);
          var demandeur = {};
          var conjoin = {};
          if (dossierToEnquet[0].id_demandeur) {
            // get demandeur
            demandeur = await Person.findById(dossierToEnquet[0].id_demandeur);
          }
          if (dossierToEnquet[0].id_conjoin) {
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
    return Promise.all(dossiersMaped).then(async () => {
      var newWB = XLSX.utils.book_new();
      var newWS = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(newWB, newWS, "List");
      XLSX.writeFile(newWB, "EnquetCNLnew.xlsx");
      const fileCNL = `EnquetCNLnew.xlsx`;
      const newEnquete = await Enquete.create({
        fichierEnq: fileCNL,
        typeEnq: "CNL",
        dateEnq: new Date(),
        creator,
        remark,
      });
      if (newEnquete) {
        res.download(fileCNL);
      } else {
        res.json("error creating EnqCNL!");
      }
    });
  });
});

const getEnquetCNASFile = asyncHandler(async (req, res) => {
  var { dossierEnq } = req.body;
  fs.copyFile("./sourceEnq/enqueteCNAS.mdb", "enqCNAS.mdb", (err) => {
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
  const { idDossierEnq, creator, remark } = req.body;

  const dossierEnqRecu = await DossierEnq.findById(idDossierEnq);

  fs.copyFile(
    "./sourceEnq/enqueteCNAS.mdb",
    `./generatedEnq/${idDossierEnq}_enqCNAS.mdb`,
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log("File copied succesfuly");
      }
    }
  );

  const connection = ADODB.open(
    `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=./generatedEnq/${idDossierEnq}_enqCNAS.mdb;`
  );

  const file = XLSX.readFile(dossierEnqRecu?.nomFichier, {
    dense: true,
    dateNF: "dd/mm/yyyy",
  });

  var excel_file;

  // var work_book = XLSX.read(file, { type: "array", dateNF: "dd/mm/yyyy" });
  var sheet_name = file.SheetNames;
  var stream = XLSX.stream.to_json(file.Sheets[sheet_name[0]], {
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

          const { "N°": numOrdre, "Ref demande": num_dos } = dossier;
          console.log(num_dos);
          // find dossier to update
          const dossierToEnquet = await Dossier.find({ num_dos: num_dos });
          if (dossierToEnquet.length > 0) {
            var demandeur = {};
            var conjoin = {};
            if (dossierToEnquet[0].id_demandeur) {
              // get demandeur
              demandeur = await Person.findById(
                dossierToEnquet[0].id_demandeur
              );
            }
            if (dossierToEnquet[0].id_conjoin) {
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
              const insert = `INSERT INTO  Table1 (NOM_P, PRENOM_P, DDN_P, NUM_ACT_P, PP, NPM, LIB_SEXE, NC, WILAYA)
        VALUES ("${demandeur?.nom_fr}", 
        "${demandeur?.prenom_fr}",
        "${demandeur?.date_n}",
        "${demandeur?.num_act}",
        "${demandeur?.prenom_p_fr}",
        "${demandeur?.nom_m_fr}",
        "${demandeur?.gender}",
        "${demandeur?.com_n}", 
        "${demandeur?.wil_n}");`;

              await connection.execute(insert);
            }
            if (conjoin?._id) {
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

              const sql = `INSERT INTO Table1 (NOM_P, PRENOM_P, DDN_P, NUM_ACT_P, PP, NPM, LIB_SEXE, NC, WILAYA) VALUES ("${conjoin?.nom_fr}", "${conjoin?.prenom_fr}",
              "${conjoin?.date_n}", 
              "${conjoin?.num_act}",
              "${conjoin?.prenom_p_fr}",
              "${conjoin?.nom_m_fr}",
              "${conjoin?.gender}",
              "${conjoin?.com_n}", 
              "${conjoin?.wil_n}");`;
              await connection.execute(sql);
            }

            var newWB = XLSX.utils.book_new();
            var newWS = XLSX.utils.json_to_sheet(newData);
            XLSX.utils.book_append_sheet(newWB, newWS, "Table1");
            XLSX.writeFile(newWB, "EnquetCNAS.xlsx");
          }
        })
      );

      return Promise.all(dossiersMaped)
        .then(async () => {
          const fileCNAS = `${idDossierEnq}_EnquetCNAS.xlsx`;
          const newEnquete = await Enquete.create({
            fichierEnq: fileCNAS,
            typeEnq: "CNAS",
            dateEnq: new Date(),
            creator,
            remark,
          });
          if (newEnquete) {
            // file download
            res.download(fileCNAS);
          } else {
            res.json("error creating enqCNAS");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
});

const getEnquetCASNOSFileTest = asyncHandler(async (req, res) => {
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

  const { idDossierEnq, creator, remark } = req.body;

  const dossierEnqRecu = await DossierEnq.findById(idDossierEnq);

  const file = XLSX.readFile(dossierEnqRecu?.nomFichier, {
    dense: true,
    dateNF: "dd/mm/yyyy",
  });

  var excel_file;

  // var work_book = XLSX.read(file, { type: "array", dateNF: "dd/mm/yyyy" });
  var sheet_name = file.SheetNames;
  console.log(sheet_name);
  var stream = XLSX.stream.to_json(file.Sheets[sheet_name[0]], {
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
            if (dossierToEnquet[0].id_demandeur) {
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
            if (dossierToEnquet[0].id_conjoin) {
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
            let fileCASNOS;
            try {
              fileCASNOS = await DBFFile.create(
                `./generatedEnq/${idDossierEnq}_CASNOSENQ.dbf`,
                fieldDescriptors
              );
              console.log("DBF file created.");
            } catch (error) {
              fileCASNOS = await DBFFile.open(
                "CASNOSENQ.dbf",
                fieldDescriptors
              );
              console.log("DBF file opend.");
            }
            try {
              await fileCASNOS.appendRecords(records);
              console.log(`${records.length} records added.`);
            } catch (error) {
              console.log(`Error adding records: ${error}`);
            }
            const newEnquete = await Enquete.create({
              fichierEnq: fileCASNOS,
              typeEnq: "CASNOS",
              dateEnq: new Date(),
              creator,
              remark,
            });
            if (newEnquete) {
              res.download("CASNOSENQ.dbf");
            } else {
              res.json("error creating enqCASNOS");
            }
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
  uploadDossierEnq,
  getListBenefisiersFile,
};
