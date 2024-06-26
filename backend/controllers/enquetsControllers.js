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
} = require("../config/functions");
const dossier = require("../models/dossierModel");
const person = require("../models/personModel");

const fs = require("fs");
const { DBFFile } = require("dbffile");
const {
  getAlphabet,
  getCivility,
  getGenderName,
} = require("../config/functions");
const ExcelJS = require("exceljs");
const System = require("../models/systemModel");
const path = require("path");

function createRecord(dossier, newData, type) {
  const demandeur = dossier.demandeur || null;
  const conjoin = dossier.conjoin || null;

  switch (type) {
    case "CASNOS": {
      if (demandeur) {
        const newRecord = {
          CODE_P: newData.length + 1,
          NOM_P: sanitizeInput(demandeur.nom_fr || ""),
          PRENOM_P: sanitizeInput(demandeur.prenom_fr || ""),
          DDN_P: convertDateFormat(demandeur.date_n, "S").date || "",
          ADR_P: sanitizeInput(dossier.adress || ""),
          NUM_ACT_P: sanitizeInput(demandeur.num_act || ""),
          PP: sanitizeInput(demandeur.prenom_p_fr || ""),
          NPM: sanitizeInput(
            `${demandeur.nom_m_fr || ""} ${demandeur.prenom_m_fr || ""}`
          ),
          LIB_SEXE: sanitizeInput(demandeur.gender || ""),
          CC: "",
          NC: sanitizeInput(demandeur.lieu_n_fr || ""),
          WILAYA: sanitizeInput(demandeur.wil_n || ""),
        };

        newData.push(newRecord);
      }
      if (conjoin) {
        const newRecord = {
          CODE_P: newData.length + 1,
          NOM_P: sanitizeInput(conjoin.nom_fr || ""),
          PRENOM_P: sanitizeInput(conjoin.prenom_fr || ""),
          DDN_P: convertDateFormat(conjoin.date_n, "S").date || "",
          ADR_P: sanitizeInput(dossier.adress || ""),
          NUM_ACT_P: sanitizeInput(conjoin.num_act || ""),
          PP: sanitizeInput(conjoin.prenom_p_fr || ""),
          NPM: sanitizeInput(
            `${conjoin.nom_m_fr || ""} ${conjoin.prenom_m_fr || ""}`
          ),
          LIB_SEXE: sanitizeInput(conjoin.gender || ""),
          CC: "",
          NC: sanitizeInput(conjoin.lieu_n_fr || ""),
          WILAYA: sanitizeInput(conjoin.wil_n || ""),
        };

        newData.push(newRecord);
      }
      break;
    }

    case "CNAS": {
      if (demandeur) {
        const newRecord = {
          "N°": newData.length + 1,
          NUM_DOSS: dossier.num_dos,
          CODE_P: "",
          NOM_P: sanitizeInput(demandeur.nom_fr || ""),
          PRENOM_P: sanitizeInput(demandeur.prenom_fr || ""),
          DDN_P: convertDateFormat(demandeur.date_n, "S").date || "",
          ADR_P: sanitizeInput(dossier.adress || ""),
          NUM_ACT_P: sanitizeInput(demandeur.num_act || ""),
          PP: sanitizeInput(demandeur.prenom_p_fr || ""),
          NPM: sanitizeInput(
            `${demandeur.nom_m_fr || ""} ${demandeur.prenom_m_fr || ""}`
          ),
          LIB_SEXE: sanitizeInput(demandeur.gender || ""),
          CC: "",
          NC: sanitizeInput(demandeur.lieu_n_fr || ""),
          WILAYA: sanitizeInput(demandeur.wil_n || ""),
        };

        newData.push(newRecord);
      }
      if (conjoin) {
        const newRecord = {
          "N°": newData.length + 1,
          NUM_DOSS: dossier.num_dos,
          CODE_P: "",
          NOM_P: sanitizeInput(conjoin.nom_fr || ""),
          PRENOM_P: sanitizeInput(conjoin.prenom_fr || ""),
          DDN_P: convertDateFormat(conjoin.date_n, "S").date || "",
          ADR_P: sanitizeInput(dossier.adress || ""),
          NUM_ACT_P: sanitizeInput(conjoin.num_act || ""),
          PP: sanitizeInput(conjoin.prenom_p_fr || ""),
          NPM: sanitizeInput(
            `${conjoin.nom_m_fr || ""} ${conjoin.prenom_m_fr || ""}`
          ),
          LIB_SEXE: sanitizeInput(conjoin.gender || ""),
          CC: "",
          NC: sanitizeInput(conjoin.lieu_n_fr || ""),
          WILAYA: sanitizeInput(conjoin.wil_n || ""),
        };

        newData.push(newRecord);
      }
      break;
    }
  }
}

const getDossierByDates = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.body;
  const dossiers = await getFullDossier();

  const dossierByDates = dossiers.filter(
    (dossier) =>
      new Date(dossier.date_depo) >= new Date(fromDate) &&
      new Date(dossier.date_depo) <= new Date(toDate)
  );

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
  var { dossierEnq: dossiersList } = req.body;

  const data = await getFullDossier();
  var dossierEnq = [];
  if (dossiersList.length > 0) {
    // console.log(dossiersList);
    await dossiersList.forEach(function (e) {
      const element = this.find((e1) => {
        return e1._id.toString() === e;
      });
      if (element) dossierEnq.push(element);
    }, Object.values(data));
  } else {
    dossierEnq = data;
  }
  // console.log(dossierEnq);
  let workbook = XLSX.readFile("CNL.xlsx", { cellStyles: true });
  let first_sheet_name = workbook.SheetNames;
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
    // modify value in A
    XLSX.utils.sheet_add_aoa(worksheet, [[i + 1]], {
      origin: `A${i + 10}`,
    });

    // set the style in A
    worksheet[`A${i + 11}`].s = {
      font: {
        name: "Times New Roman",
        sz: 14,
      },
    };
    console.log(record.conjoin);
    if (record.demandeur) {
      // modify value in B
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.nom_fr]], {
        origin: `B${i + 10}`,
      });
      // set the style in B
      worksheet[`B${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in C
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.prenom_fr]], {
        origin: `C${i + 10}`,
      });
      // set the style in C
      worksheet[`C${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in D
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.gender]], {
        origin: `D${i + 10}`,
      });
      // set the style in D
      worksheet[`D${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in E
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [[convertDateFormat(record.demandeur.date_n, "S").date]],
        {
          origin: `E${i + 10}`,
        }
      );
      // set the style in E
      worksheet[`E${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in F
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.type_date_n]], {
        origin: `F${i + 10}`,
      });
      // set the style in F
      worksheet[`F${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in G
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.lieu_n_fr]], {
        origin: `G${i + 10}`,
      });
      // set the style in G
      worksheet[`G${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in H
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.wil_n]], {
        origin: `H${i + 10}`,
      });
      // set the style in H
      worksheet[`H${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in I
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.num_act]], {
        origin: `I${i + 10}`,
      });
      // set the style in I
      worksheet[`I${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in J
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.stuation_f]], {
        origin: `J${i + 10}`,
      });
      // set the style in J
      worksheet[`J${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in K
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.prenom_p_fr]], {
        origin: `K${i + 10}`,
      });
      // set the style in K
      worksheet[`K${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in L
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.nom_m_fr]], {
        origin: `L${i + 10}`,
      });
      // set the style in L
      worksheet[`L${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in M
      XLSX.utils.sheet_add_aoa(worksheet, [[record.demandeur.prenom_m_fr]], {
        origin: `M${i + 10}`,
      });
      // set the style in M
      worksheet[`M${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };
    }

    if (record.conjoin) {
      // modify value in N
      XLSX.utils.sheet_add_aoa(worksheet, [[record.conjoin.nom_fr]], {
        origin: `N${i + 10}`,
      });
      // set the style in N
      worksheet[`N${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in O
      XLSX.utils.sheet_add_aoa(worksheet, [[record.conjoin.prenom_fr]], {
        origin: `O${i + 10}`,
      });
      // set the style in O
      worksheet[`O${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in P
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [[convertDateFormat(record.conjoin.date_n, "S").date]],
        {
          origin: `P${i + 10}`,
        }
      );
      // set the style in P
      worksheet[`P${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in Q
      XLSX.utils.sheet_add_aoa(worksheet, [[record.conjoin.type_date_n]], {
        origin: `Q${i + 10}`,
      });
      // set the style in Q
      worksheet[`Q${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in R
      XLSX.utils.sheet_add_aoa(worksheet, [[record.conjoin.lieu_n_fr]], {
        origin: `R${i + 10}`,
      });
      // set the style in R
      worksheet[`R${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in S
      XLSX.utils.sheet_add_aoa(worksheet, [[record.conjoin.wil_n]], {
        origin: `S${i + 10}`,
      });
      // set the style in S
      worksheet[`S${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in T
      XLSX.utils.sheet_add_aoa(worksheet, [[record.conjoin.num_act]], {
        origin: `T${i + 10}`,
      });
      // set the style in T
      worksheet[`T${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in U
      XLSX.utils.sheet_add_aoa(worksheet, [[record.conjoin.prenom_p_fr]], {
        origin: `U${i + 10}`,
      });
      // set the style in U
      worksheet[`U${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in V
      XLSX.utils.sheet_add_aoa(worksheet, [[record.conjoin.nom_m_fr]], {
        origin: `V${i + 10}`,
      });
      // set the style in V
      worksheet[`V${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };

      // modify value in W
      XLSX.utils.sheet_add_aoa(worksheet, [[record.conjoin.prenom_m_fr]], {
        origin: `W${i + 10}`,
      });
      // set the style in W
      worksheet[`W${i + 11}`].s = {
        font: {
          name: "Times New Roman",
          sz: 14,
        },
      };
    }

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
  var { dossiersList, type, quotaDate } = req.body;

  const data = await getFullDossier();
  var dossiers = [];
  if (dossiersList.length > 0) {
    await dossiersList.forEach(function (e) {
      const element = this.find((e1) => {
        return e1._id.toString() === e;
      });
      if (element) dossiers.push(element);
    }, Object.values(data));
  } else {
    dossiers = data;
  }
  const workbook = new ExcelJS.Workbook();
  let pi = 1,
    mi = 1;
  let worksheetPlus;
  let worksheetMoin;

  switch (type) {
    case "arabic": {
      try {
        await workbook.xlsx.readFile("ListBenefisiersAr.xlsx");
      } catch (error) {
        // console.log(error);
      }

      worksheetPlus = workbook.worksheets[0];

      worksheetMoin = workbook.worksheets[1];
      break;
    }

    case "arabicr": {
      await workbook.xlsx.readFile("ListReserveBenefisiersAr.xlsx");
      worksheetPlus = workbook.worksheets[0];
      worksheetMoin = workbook.worksheets[1];
      break;
    }

    case "french": {
      await workbook.xlsx.readFile("ListBenefisiersFr.xlsx");
      worksheetPlus = workbook.worksheets[1];
      worksheetMoin = workbook.worksheets[0];
      break;
    }

    case "frenchr": {
      await workbook.xlsx.readFile("ListBenefisiersFr.xlsx");
      worksheetPlus = workbook.worksheets[0];
      worksheetMoin = workbook.worksheets[1];
      break;
    }
    case "export": {
      await workbook.xlsx.readFile("Export-Ar.xlsx");
      worksheetPlus = workbook.worksheets[0];
      worksheetMoin = workbook.worksheets[1];
      break;
    }
    case "exportFilter": {
      await workbook.xlsx.readFile("Export-ArFilter.xlsx");
      worksheetPlus = workbook.worksheets[0];
      break;
    }
  }

  const imageId1 = workbook.addImage({
    filename: "HMDMOK logo.PNG",
    extension: "png",
  });

  // insert an image over B2:D6
  worksheetPlus.addImage(imageId1, "AA2:AB3");
  if (type !== "exportFilter") worksheetMoin.addImage(imageId1, "AA2:AB3");

  let newDoss;
  if (type === "export") {
    newDoss = await dossiers.map(
      asyncHandler(async function (record, i) {
        if (
          new Date(convertDateFormat(record.demandeur?.date_n).jsDate) <=
          new Date(
            new Date(quotaDate).getFullYear() - 35,
            new Date(quotaDate).getMonth(),
            new Date(quotaDate).getDate()
          )
        ) {
          await worksheetPlus.addRow(
            [
              worksheetPlus._rows.length - 3,
              record.num_dos,
              record.date_depo,
              record.demandeur?.nom,
              record.demandeur?.prenom,
              getGenderName(record.demandeur?.gender, "a"),
              record.demandeur?.type_date_n,
              record.demandeur?.date_n,
              record.demandeur?.num_act,
              record.demandeur?.lieu_n,
              getCivility(record.demandeur?.stuation_f, "a"),
              record.demandeur?.prenom_p,
              record.demandeur?.nom_m,
              record.demandeur?.prenom_m,
              record.adress,
              record.conjoin?.nom,
              record.conjoin?.prenom,
              record.conjoin?.type_date_n,
              record.conjoin?.date_n,
              record.conjoin?.num_act,
              record.conjoin?.lieu_n,
              record.conjoin?.prenom_p,
              record.conjoin?.nom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
            ],
            "i+"
          );
        } else {
          await worksheetMoin.addRow(
            [
              worksheetMoin._rows.length - 3,
              record.num_dos,
              record.date_depo,
              record.demandeur?.nom,
              record.demandeur?.prenom,
              getGenderName(record.demandeur?.gender, "a"),
              record.demandeur?.date_n,
              record.demandeur?.num_act,
              record.demandeur?.lieu_n,
              getCivility(record.demandeur?.stuation_f, "a"),
              record.demandeur?.prenom_p,
              record.demandeur?.nom_m,
              record.demandeur?.prenom_m,
              record.adress,
              record.conjoin?.nom,
              record.conjoin?.prenom,
              record.conjoin?.date_n,
              record.conjoin?.num_act,
              record.conjoin?.lieu_n,
              record.conjoin?.prenom_p,
              record.conjoin?.nom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
              record.conjoin?.prenom_m,
            ],
            "i+"
          );
        }
      })
    );
  } else if (type === "exportFilter") {
    newDoss = await dossiers.map(
      asyncHandler(async function (record, i) {
        await worksheetPlus.addRow(
          [
            worksheetPlus._rows.length - 3,
            record.num_dos,
            record.date_depo,
            record.demandeur?.nom,
            record.demandeur?.prenom,
            getGenderName(record.demandeur?.gender, "a"),
            record.demandeur?.date_n,
            record.demandeur?.type_date_n,
            record.demandeur?.num_act,
            record.demandeur?.lieu_n,
            getCivility(record.demandeur?.stuation_f, "a"),
            record.demandeur?.prenom_p,
            record.demandeur?.nom_m,
            record.demandeur?.prenom_m,
            record.adress,
            record.conjoin?.nom,
            record.conjoin?.prenom,
            record.conjoin?.date_n,
            record.conjoin?.type_date_n,
            record.conjoin?.num_act,
            record.conjoin?.lieu_n,
            record.conjoin?.prenom_p,
            record.conjoin?.nom_m,
            record.conjoin?.prenom_m,
            record.conjoin?.prenom_m,
            record.conjoin?.prenom_m,
            record.conjoin?.prenom_m,
            record.conjoin?.prenom_m,
            record.conjoin?.prenom_m,
            record.conjoin?.prenom_m,
            record.conjoin?.prenom_m,
          ],
          "i+"
        );
      })
    );
  } else {
    newDoss = await dossiersList.map(
      asyncHandler(async function (record, i) {
        if (
          type.includes("f") &&
          new Date(convertDateFormat(record.demandeur?.date_n).jsDate) <=
            new Date(
              new Date(quotaDate).getFullYear() - 35,
              new Date(quotaDate).getMonth(),
              new Date(quotaDate).getDate()
            )
        ) {
          await worksheetPlus.addRow(
            [
              worksheetPlus._rows.length - 6,
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
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
            ],
            "i+"
          );
          let image;
          if (record.demandeur?.photo_link) {
            image = workbook.addImage({
              filename: record.demandeur?.photo_link,
              extension: "png",
            });
          } else {
            image = workbook.addImage({
              filename: "usersPicUpload/default.png",
              extension: "png",
            });
          }
          worksheetPlus.addImage(image, {
            tl: { col: 29, row: worksheetPlus._media.length + 5 },
            ext: { width: 200, height: 250 },
          });

          pi = pi + 1;
        } else if (
          type.includes("f") &&
          new Date(convertDateFormat(record.demandeur?.date_n).jsDate) >=
            new Date(
              new Date(quotaDate).getFullYear() - 35,
              new Date(quotaDate).getMonth(),
              new Date(quotaDate).getDate()
            )
        ) {
          await worksheetMoin.addRow(
            [
              worksheetMoin._rows.length - 6,
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
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
              record.conjoin?.prenom_m_fr,
            ],
            "i+"
          );
          if (record.demandeur?.photo_link) {
            const image = workbook.addImage({
              filename: record.demandeur?.photo_link,
              extension: "png",
            });
            worksheetMoin.addImage(image, {
              tl: { col: 29, row: worksheetMoin._media.length + 5 },
              ext: { width: 200, height: 250 },
            });
          }
          mi++;
        } else if (
          type.includes("a") &&
          new Date(convertDateFormat(record.demandeur?.date_n).jsDate) >=
            new Date(
              new Date(quotaDate).getFullYear() - 35,
              new Date(quotaDate).getMonth(),
              new Date(quotaDate).getDate()
            )
        ) {
          await worksheetPlus.addRow(
            [
              worksheetPlus._rows.length - 6,
              record.demandeur.nom,
              record.demandeur.prenom,
              record.demandeur.date_n,
              record.demandeur.lieu_n,
              getCivility(record.demandeur.stuation_f, "a"),
              record.demandeur.prenom_p,
              record.demandeur.nom_m,
              record.demandeur.prenom_m,
            ],
            "i+"
          );
          if (record.demandeur?.photo_link) {
            const image = workbook.addImage({
              filename: record.demandeur?.photo_link,
              extension: "png",
            });
            worksheetPlus.addImage(image, {
              tl: { col: 9, row: worksheetPlus._media.length + 5 },
              ext: { width: 200, height: 150 },
            });
          }
          pi++;
        } else if (
          type.includes("a") &&
          new Date(convertDateFormat(record.demandeur?.date_n).jsDate) <=
            new Date(
              new Date(quotaDate).getFullYear() - 35,
              new Date(quotaDate).getMonth(),
              new Date(quotaDate).getDate()
            )
        ) {
          await worksheetMoin.addRow(
            [
              worksheetMoin._rows.length - 6,
              record.demandeur.nom,
              record.demandeur.prenom,
              record.demandeur.date_n,
              record.demandeur.lieu_n,
              getCivility(record.demandeur.stuation_f, "a"),
              record.demandeur.prenom_p,
              record.demandeur.nom_m,
              record.demandeur.prenom_m,
            ],
            "i+"
          );

          if (record.demandeur?.photo_link) {
            const image = workbook.addImage({
              filename: record.demandeur?.photo_link,
              extension: "png",
            });
            worksheetMoin.addImage(image, {
              tl: { col: 9, row: worksheetMoin._media.length + 5 },
              ext: { width: 200, height: 150 },
            });
          }
          mi++;
        }
      })
    );
  }

  // worksheet.spliceRows(7, 1);
  const newFileName = `List Benifisiers ${
    new Date().toISOString().split("T")[0]
  }.xlsx`;

  return Promise.all(newDoss)
    .then(
      asyncHandler(async () => {
        if (type === "export") {
          await worksheetPlus.spliceRows(2, 3);
          await worksheetMoin.spliceRows(2, 3);
        } else if (type === "exportFilter") {
          await worksheetPlus.spliceRows(2, 3);
        } else {
          await worksheetPlus.spliceRows(7, 1);
          await worksheetMoin.spliceRows(7, 1);
        }

        try {
          await workbook.xlsx.writeFile(newFileName);
        } catch (error) {
          // console.log(workbook);
          console.log("writeFile(newFileName): ", error);
        }
      })
    )
    .then(
      asyncHandler(async () => {
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
  var stream = XLSX.stream.to_json(file.Sheets[sheet_name], {
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
          // console.log(dossierToEnquet);
          var demandeur = {};
          var conjoin = {};
          if (dossierToEnquet.id_demandeur) {
            // get demandeur
            demandeur = await Person.findById(dossierToEnquet.id_demandeur);
          }
          if (dossierToEnquet.id_conjoin) {
            // get conjoin
            conjoin = await Person.findById(dossierToEnquet.id_conjoin);
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
    // console.log(newData);
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

const getEnquetCNASFileTest = asyncHandler(async (req, res) => {
  var {} = req.body;

  const dossierEnq = await getFullDossier();

  fs.copyFile(
    "./sourceEnq/enqueteCNAS.mdb",
    "./sourceEnq/enqCNAS.mdb",
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log("File copied succesfuly");
      }
    }
  );
  const connection = ADODB.open(
    `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=./sourceEnq/enqCNAS.mdb;`
  );
  var newData = await dossierEnq.map(
    asyncHandler(async function (record) {
      if (record.demandeur && record.demandeur?.nom_fr !== "") {
        const insert = `INSERT INTO  Table1 (NOM_P, PRENOM_P, DDN_P, NUM_ACT_P, PP, NPM, LIB_SEXE, NC, WILAYA)
        VALUES ("${record.demandeur?.nom_fr}",  
        "${record.demandeur?.prenom_fr}",
         "${convertDateFormat(record.demandeur?.date_n, "S").date}",
        "${record.demandeur?.num_act || ""}",
        "${record.demandeur?.prenom_p_fr}", 
        "${record.demandeur?.nom_m_fr}",
        "${record.demandeur?.gender}",
        "${record.demandeur?.com_n}", 
        "${record.demandeur?.wil_n}");`;
        try {
          await connection.execute(insert);
        } catch (error) {
          console.log("Insert1 error: ", error.process.message);
        }
      }

      if (record.conjoin && record.conjoin?.nom_fr !== "") {
        const sql = `INSERT INTO Table1 (NOM_P, PRENOM_P, DDN_P, NUM_ACT_P, PP, NPM, LIB_SEXE, NC, WILAYA) VALUES ("${
          record.conjoin?.nom_fr
        }", "${record.conjoin?.prenom_fr}",
        "${convertDateFormat(record.conjoin?.date_n, "S").date}", 
        "${record.conjoin?.num_act || ""}",
        "${record.conjoin?.prenom_p_fr}", 
        "${record.conjoin?.nom_m_fr}",
        "${record.conjoin?.gender}",
        "${record.conjoin?.com_n}", 
        "${record.conjoin?.wil_n}");`;
        try {
          await connection.execute(sql);
        } catch (error) {
          console.log("insert 2 error: ", error.process.message);
          // console.log(
          //     `"${record.conjoin?.date_n}",
          // "${record.conjoin?.num_act}",
          // "${record.conjoin?.prenom_p_fr}",
          // "${record.conjoin?.nom_m_fr}",
          // "${record.conjoin?.gender}",
          // "${record.conjoin?.com_n}",
          // "${record.conjoin?.wil_n}");`
          //   );
        }
      }
      return record;
    })
  );

  return Promise.all(newData)
    .then(async () => {
      // file download
      res.download("./sourceEnq/enqCNAS.mdb");
    })
    .catch((err) => {
      // console.log(err);
    });
});

const getEnquetCNASFile = asyncHandler(async (req, res) => {
  var { dossierEnq: dossiersList } = req.body;

  const data = await getFullDossier();
  var dossierEnq = [];
  if (dossiersList.length > 0) {
    // console.log(dossiersList);
    await dossiersList.forEach(function (e) {
      const element = this.find((e1) => {
        return e1._id.toString() === e;
      });
      if (element) dossierEnq.push(element);
    }, Object.values(data));
  } else {
    dossierEnq = data;
  }

  var newData = [];
  var numOrdre = 1;
  const dossiersMaped = dossierEnq?.map(
    asyncHandler(async (dossier) => {
      createRecord(dossier, newData, "CNAS");

      var newWB = XLSX.utils.book_new();
      var newWS = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(newWB, newWS, "Table1");
      XLSX.writeFile(newWB, "new_EnquetCNAS.xlsx");
    })
  );

  return Promise.all(dossiersMaped)
    .then(async () => {
      const fileCNAS = `new_EnquetCNAS.xlsx`;

      res.download(fileCNAS);
    })
    .catch((err) => {
      console.log(err);
      res.json("error creating enqCNAS");
    });
});

const getEnquetCASNOSFile = asyncHandler(async (req, res) => {
  var { dossierEnq: dossiersList } = req.body;

  const data = await getFullDossier();
  var dossierEnq = [];
  if (dossiersList.length > 0) {
    // console.log(dossiersList);
    await dossiersList.forEach(function (e) {
      const element = this.find((e1) => {
        return e1._id.toString() === e;
      });
      if (element) dossierEnq.push(element);
    }, Object.values(data));
  } else {
    dossierEnq = data;
  }
  const dateTimeString = getCurrentDateTimeString();
  const folderPath = path.join(__dirname, `CASNOS_${dateTimeString}`);

  // Create the folder
  fs.mkdirSync(folderPath);

  var newData = [];
  let fileCounter = 1;

  const dossiersMaped = dossierEnq?.map(
    asyncHandler(async (dossier, index) => {
      createRecord(dossier, newData, "CASNOS");

      if ((index + 1) % 100 === 0 || index === dossierEnq.length - 1) {
        const fileName = path.join(
          folderPath,
          `new_EnquetCASNOS_${fileCounter}.xlsx`
        );
        const newWB = XLSX.utils.book_new();
        const newWS = XLSX.utils.json_to_sheet(newData);
        XLSX.utils.book_append_sheet(newWB, newWS, "Table1");
        XLSX.writeFile(newWB, fileName);

        newData = []; // Reset the newData array for the next batch of 200 records
        fileCounter++; // Increment the file counter
      }
    })
  );

  return Promise.all(dossiersMaped)
    .then(async () => {
      await compressFolderToZip(folderPath);
      const fileCASNOS = `${folderPath}.zip`;

      res.download(fileCASNOS);
    })
    .catch((err) => {
      console.log(err);
      res.json("error creating enqCASNOS");
    });
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
  // console.log(sheet_name);
  var stream = XLSX.stream.to_json(file.Sheets[sheet_name], {
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
            if (dossierToEnquet.id_demandeur) {
              // get demandeur
              demandeur = await Person.findById(dossierToEnquet.id_demandeur);

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
            if (dossierToEnquet.id_conjoin) {
              // get conjoin
              conjoin = await Person.findById(dossierToEnquet.id_conjoin);
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

            // console.log("dossier added");
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
              // console.log("DBF file created.");
            } catch (error) {
              fileCASNOS = await DBFFile.open(
                "CASNOSENQ.dbf",
                fieldDescriptors
              );
              // console.log("DBF file opend.");
            }
            try {
              await fileCASNOS.appendRecords(records);
              // console.log(`${records.length} records added.`);
            } catch (error) {
              // console.log(`Error adding records: ${error}`);
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
          // console.log(err);
        });
    })
  );
});

const getEnquetCASNOSFiletest2 = asyncHandler(async (req, res) => {
  var {} = req.body;

  const dossierEnq = await getFullDossier();

  fs.unlink("CASNOSENQ.dbf", (err) => {
    if (err) {
      // console.log("Error Found:", err);
    } else {
      // console.log("File deleted succesfuly");
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
      if (record.demandeur) {
        var demandeur = {
          CODE_P: "",
          NOM_P: record.demandeur?.nom_fr,
          PRENOM_P: record.demandeur?.prenom_fr,
          DNN_P: convertDateFormat(record.demandeur?.date_n, "S").date,
          ADR_P: "",
          NUM_ACT_P: record.demandeur?.num_act || "",
          PRENP: record.demandeur?.prenom_p_fr,
          NPM: `${record.demandeur?.nom_m_fr} ${record.demandeur?.prenom_m_fr}`,
          LIB_SEXE: record.demandeur?.gender,
          CC: "",
          NC: record.demandeur?.com_n,
          WILAYA: record.demandeur?.wil_n,
        };
        records.push(demandeur);
      }
      if (record.conjoin) {
        var conjoin = {
          CODE_P: "",
          NOM_P: record.conjoin?.nom_fr,
          PRENOM_P: record.conjoin?.prenom_fr,
          DNN_P: convertDateFormat(record.conjoin?.date_n, "S").date,
          ADR_P: "",
          NUM_ACT_P: record.conjoin?.num_act || "",
          PRENP: record.conjoin?.prenom_p_fr,
          NPM: `${record.conjoin?.nom_m_fr} ${record.conjoin?.prenom_m_fr}`,
          LIB_SEXE: record.conjoin?.gender,
          CC: "",
          NC: record.conjoin?.com_n,
          WILAYA: record.conjoin?.wil_n,
        };
        records.push(conjoin);
      }
      return record;
    })
  );

  let dbf;
  try {
    dbf = await DBFFile.create("CASNOSENQ.dbf", fieldDescriptors);
    // console.log("DBF file created.");
  } catch (error) {
    dbf = await DBFFile.open("CASNOSENQ.dbf", fieldDescriptors);
    // console.log("DBF file opend.");
  }
  try {
    await dbf.appendRecords(records);
    // console.log(`${records.length} records added.`);
  } catch (error) {
    // console.log(`Error adding records: ${error}`);
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
