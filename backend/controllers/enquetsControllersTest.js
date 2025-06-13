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
  processDossier,
  processDossierBrothers,
  getSimilarityKey,
  segregateBrothersLists,
} = require("../config/functions");
const fs = require("fs");
const { DBFFile } = require("dbffile");
const ExcelJS = require("exceljs");
const System = require("../models/systemModel");
const path = require("path");

const createRecord = (dossier, newData, type) => {
  const createNewRecord = (person, address, numAct, prefix) => ({
    "N°": prefix === "CNAS" ? newData.length + 1 : undefined,
    NUM_DOSS: prefix === "CNAS" ? dossier.num_dos : undefined,
    CODE_P: prefix === "CASNOS" ? newData.length + 1 : "",
    NOM_P: sanitizeInput(person.nom_fr || ""),
    PRENOM_P: sanitizeInput(person.prenom_fr || ""),
    DDN_P: convertDateFormat(person.date_n, "S").date3112 || "",
    ADR_P: "",
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
      newData.push(
        createNewRecord(demandeur, address, demandeur.num_act, type)
      );
    }
    if (conjoin) {
      conjoin.forEach((person) => {
        if (person)
          newData.push(createNewRecord(person, address, person.num_act, type));
      });
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

  ["A2", "A3", "A4", "A5", "I6", "I7"].forEach((cell) => {
    worksheet[cell].s = cellStyles.title;
  });

  getAlphabet("fr").forEach((letter) => {
    if (!["X", "Y", "Z"].includes(letter.toUpperCase())) {
      worksheet[`${letter.toUpperCase()}9`].s = cellStyles.header;
    }
  });
  let index = 0;
  selectedDossiers.forEach((record, i) => {
    const rowIndex = index + 10 + i;

    XLSX.utils.sheet_add_aoa(worksheet, [[record.num_dos]], {
      origin: `A${rowIndex}`,
    });

    // worksheet[`A${rowIndex}`].s = cellStyles.default;

    const addPersonData = (person, prefix) => {
      if (prefix === "D")
        [
          ["B", person.nom_fr],
          ["C", person.prenom_fr],
          ["D", person.gender],
          ["E", convertDateFormat(person.date_n, "S").date0101],
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
          if (worksheet[`${col}${rowIndex}`])
            worksheet[`${col}${rowIndex}`].s = cellStyles.default;
        });
      else if (prefix === "C")
        [
          ["N", person.nom_fr],
          ["O", person.prenom_fr],
          ["P", convertDateFormat(person.date_n, "S").date0101],
          ["Q", person.type_date_n],
          ["R", person.lieu_n_fr],
          ["S", person.wil_n],
          ["T", person.num_act],
          ["U", person.prenom_p_fr],
          ["V", person.nom_m_fr],
          ["W", person.prenom_m_fr],
        ].forEach(([col, value]) => {
          XLSX.utils.sheet_add_aoa(worksheet, [[value]], {
            origin: `${col}${rowIndex}`,
          });
          if (worksheet[`${col}${rowIndex}`])
            worksheet[`${col}${rowIndex}`].s = cellStyles.default;
        });
    };

    if (record.demandeur) {
      addPersonData(record.demandeur, "D");

      if (record.conjoin) {
        record.conjoin.forEach((person, x) => {
          if (person) {
            addPersonData(person, "C");
            x > 0 ? index++ : index;
          }
        });
      }
      // index++;
    }
  });
  const newFileName = `newEnquetCNL_${new Date().toDateString()}.xlsx`;
  XLSX.writeFile(workbook, newFileName, {
    cellStyles: true,
  });
  const file = newFileName;
  res.status(200).download(file);
});

const getEnquetCASNOSFile = asyncHandler(async (req, res) => {
  try {
    const { dossierEnq: dossiersList } = req.body;
    const data = await getFullDossier();

    const dossierEnq =
      dossiersList.length > 0
        ? dossiersList.map((e) => data.find((d) => d._id.toString() === e))
        : data;

    const dateTimeString = getCurrentDateTimeString();
    const folderPath = path.join(__dirname, `CASNOS_${dateTimeString}`);

    // Create the folder
    fs.mkdirSync(folderPath);

    let newData = [];
    let fileCounter = 1;

    const processDossierBatch = async (dossiersBatch) => {
      createRecord(dossiersBatch, newData, "CASNOS");

      const fileName = path.join(
        folderPath,
        `new_EnquetCASNOS_${fileCounter}.xlsx`
      );
      const newWB = XLSX.utils.book_new();
      const newWS = XLSX.utils.json_to_sheet(newData);
      XLSX.utils.book_append_sheet(newWB, newWS, "Table1");
      XLSX.writeFile(newWB, fileName);

      newData = []; // Reset the newData array for the next batch of records
      fileCounter++; // Increment the file counter
    };

    for (let i = 0; i < dossierEnq.length; i++) {
      createRecord(dossierEnq[i], newData, "CASNOS");

      if ((i + 1) % 100 === 0 || i === dossierEnq.length - 1) {
        await processDossierBatch(dossierEnq.slice(i - 99, i + 1));
      }
    }

    await compressFolderToZip(folderPath);
    const fileCASNOS = `${folderPath}.zip`;

    res.download(fileCASNOS);
  } catch (error) {
    console.error("Error creating enqCASNOS file:", error);
    res.status(500).json("Error creating enqCASNOS");
  }
});

const getEnquetCNASFile = asyncHandler(async (req, res) => {
  try {
    const { dossierEnq: dossiersList } = req.body;
    const data = await getFullDossier();
    let dossierEnq = [];

    if (dossiersList.length > 0) {
      dossiersList.forEach((e) => {
        const element = data.find((d) => d._id.toString() === e);
        if (element) dossierEnq.push(element);
      });
    } else {
      dossierEnq = data;
    }

    let newData = [];

    for (let i = 0; i < dossierEnq.length; i++) {
      createRecord(dossierEnq[i], newData, "CNAS");
    }

    const fileName = `new_EnquetCNAS.xlsx`;
    const newWB = XLSX.utils.book_new();
    const newWS = XLSX.utils.json_to_sheet(newData);
    XLSX.utils.book_append_sheet(newWB, newWS, "Table1");
    XLSX.writeFile(newWB, fileName);
    const fileCNAS = `new_EnquetCNAS.xlsx`;

    res.download(fileCNAS);
  } catch (error) {
    console.error("Error creating enqCNAS file:", error);
    res.status(500).json("Error creating enqCNAS");
  }
});

const getListBenefisiersFile = asyncHandler(async (req, res) => {
  try {
    const { dossiersList, type, triDossiers, photoFemme } = req.body;
    // console.log("type2:", type);
    const data = await getFullDossier();
    const systemInfo = await System.findOne();

    let dossiers =
      dossiersList.length > 0
        ? await dossiersList.map((e) =>
            data.find((d) => d._id.toString() === e)
          )
        : data;

    const dossierBrothers = await segregateBrothersLists(
      await getSimilarityKey(dossiers, "ar")
    );

    const workbook = new ExcelJS.Workbook();
    let worksheetPlus,
      worksheetMoin,
      worksheetBrother,
      worksheetFather,
      worksheetMother,
      worksheetUnique;

    const loadWorkbook = async (fileName) => {
      try {
        await workbook.xlsx.readFile(fileName);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    };

    switch (type) {
      case "arabic":
        await loadWorkbook("ListBenefisiersAr.xlsx");
        worksheetPlus = workbook.worksheets[0];
        worksheetMoin = workbook.worksheets[1];
        break;
      case "arabicr":
        await loadWorkbook("ListReserveBenefisiersAr.xlsx");
        worksheetPlus = workbook.worksheets[0];
        worksheetMoin = workbook.worksheets[1];
        break;
      case "french":
        await loadWorkbook("ListBenefisiersFr.xlsx");
        worksheetPlus = workbook.worksheets[1];
        worksheetMoin = workbook.worksheets[0];
        break;
      case "frenchr":
        await loadWorkbook("ListReserveBenefisiersFr.xlsx");
        worksheetPlus = workbook.worksheets[0];
        worksheetMoin = workbook.worksheets[1];
        break;
      case "export":
        await loadWorkbook("Export-Ar.xlsx");
        worksheetPlus = workbook.worksheets[0];
        worksheetMoin = workbook.worksheets[1];
        break;
      case "exportFilter":
        await loadWorkbook("Export-ArFilter.xlsx");
        worksheetPlus = workbook.worksheets[0];
        break;
      case "brothersfr":
        await loadWorkbook("ListBrothersFr.xlsx");
        worksheetBrother = workbook.worksheets[0];
        worksheetFather = workbook.worksheets[1];
        worksheetMother = workbook.worksheets[2];
        worksheetUnique = workbook.worksheets[3];
        break;
      case "brothersar":
        await loadWorkbook("ListBrothersAr.xlsx");
        worksheetBrother = workbook.worksheets[0];
        worksheetFather = workbook.worksheets[1];
        worksheetMother = workbook.worksheets[2];
        worksheetUnique = workbook.worksheets[3];
        break;
      default:
        return res.status(400).json({ error: "Invalid type" });
    }

    const imageId1 = workbook.addImage({
      filename: "HMDMOK logo.PNG",
      extension: "png",
    });

    // if (type !== "exportFilter" && type !== "export") {
    //   worksheetPlus.addImage(imageId1, "A1:A1");
    //   worksheetMoin.addImage(imageId1, "A1:A1");
    // }
    const quotaDate = systemInfo.quotaDate;

    if (type.includes("brothers")) {
      var filterBySearch = dossierBrothers.brotherBrothersList;
      var filterBySearch2 = dossierBrothers.fatherBrothersList;
      var filterBySearch3 = dossierBrothers.motherBrothersList;

      filterBySearch = filterBySearch.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.

        return (
          b.mainDossier?.numberOfBrotherBrothers -
          a.mainDossier?.numberOfBrotherBrothers
        );
      });
      filterBySearch2 = filterBySearch2.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.

        return (
          b.mainDossier?.numberOfFatherBrothers -
          a.mainDossier?.numberOfFatherBrothers
        );
      });
      filterBySearch3 = filterBySearch3.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.

        return (
          b.mainDossier?.numberOfMotherBrothers -
          a.mainDossier?.numberOfMotherBrothers
        );
      });
      // console.log("dossierBrothers: ", filterBySearch[0].mainDossier.numberOfBrotherBrothers);
      await Promise.all(
        filterBySearch.map((dossier, index) => {
          // console.log("number of brothers: ", dossier.brothers.length + 1);
          return processDossierBrothers(
            dossier,
            index,
            dossier.brothers.length + 1,
            workbook,
            type,
            photoFemme,
            worksheetBrother,
            worksheetFather,
            worksheetMother,
            worksheetUnique,
            "Brothers"
          );
        })
      );
      await Promise.all(
        filterBySearch2.map((dossier, index) => {
          // console.log("dossier: ", dossier);
          return processDossierBrothers(
            dossier,
            index,
            dossier.brothers.length + 1,
            workbook,
            type,
            photoFemme,
            worksheetBrother,
            worksheetFather,
            worksheetMother,
            worksheetUnique,
            "Fathers"
          );
        })
      );

      await Promise.all(
        filterBySearch3.map((dossier, index) => {
          // console.log("dossier: ", dossier);
          return processDossierBrothers(
            dossier,
            index,
            dossier.brothers.length + 1,
            workbook,
            type,
            photoFemme,
            worksheetBrother,
            worksheetFather,
            worksheetMother,
            worksheetUnique,
            "Mothers"
          );
        })
      );
      await Promise.all(
        dossierBrothers.remainingDossiers.map((dossier, index) => {
          // console.log("dossier: ", dossier);
          return processDossierBrothers(
            dossier,
            index,
            null,
            workbook,
            type,
            photoFemme,
            worksheetBrother,
            worksheetFather,
            worksheetMother,
            worksheetUnique,
            "Unique"
          );
        })
      );
    } else
      await Promise.all(
        dossiers.map((dossier) =>
          processDossier(
            dossier,
            triDossiers,
            quotaDate,
            workbook,
            type,
            photoFemme,
            worksheetPlus,
            worksheetMoin
          )
        )
      );

    const newFileName = `generatedEnq/List Benifisiers ${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    // console.log("type1:", type);
    if (type === "export" || type === "exportFilter") {
      worksheetPlus.spliceRows(2, 1);
      if (type === "export") worksheetMoin.spliceRows(2, 1);
    } else if (type === "brothersfr") {
      worksheetBrother.spliceRows(7, 1);
      worksheetFather.spliceRows(7, 1);
      worksheetMother.spliceRows(7, 1);
      worksheetUnique.spliceRows(7, 1);
    } else if (type === "brothersar") {
      worksheetBrother.spliceRows(7, 1);
      worksheetFather.spliceRows(7, 1);
      worksheetMother.spliceRows(7, 1);
      worksheetUnique.spliceRows(7, 1);
    } else {
      worksheetPlus.spliceRows(7, 1);
      worksheetMoin.spliceRows(7, 1);
    }

    await workbook.xlsx.writeFile(newFileName);
    res.download(newFileName);
  } catch (error) {
    console.error("Error creating file:", error);
    res.status(500).json("Error creating list");
  }
});

module.exports = {
  getDossierByDates,
  uploadDossierEnq,
  getEnquetCNLFile,
  getEnquetCASNOSFile,
  getEnquetCNASFile,
  getListBenefisiersFile,
};
