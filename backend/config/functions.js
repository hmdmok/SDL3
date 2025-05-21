const XLSX = require("sheetjs-style");
const fs = require("fs");
const archiver = require("archiver");
const dossier = require("../models/dossierModel");
const person = require("../models/personModel");
const system = require("../models/systemModel");

function validateHeader(file, expectedHeader) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const header = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

      if (JSON.stringify(header) === JSON.stringify(expectedHeader)) {
        resolve(true);
      } else {
        resolve(false);
      }
    };

    reader.onerror = (event) => {
      reject(event.target.error);
    };

    reader.readAsBinaryString(file);
  });
}

function isValidDate(dateString) {
  // Parse the input string into a Date object
  const dateObj = new Date(dateString);

  // Check if the input string was a valid date
  if (isNaN(dateObj.getTime())) {
    return false;
  }

  // Check if the date is equal to the parsed date string
  if (dateObj.toISOString().slice(0, 10) !== dateString) {
    return false;
  }

  return true;
}

const isStrictArabic = (str) => {
  const strictArabicRegex = /^[\u0600-\u06FF\s]+$/;
  return strictArabicRegex.test(str);
};

function isStrictFrench(str) {
  const strictFrenchRegex = /^[a-zA-Zàáâäçèéêëìíîïñòóôöùúûüÿ\s]+$/;
  return strictFrenchRegex.test(str);
}

const getCivility = (status, language) => {
  let civility = "";

  switch (status) {
    case "CM":
      civility = language === "a" ? "أعزب" : "Célibataire";
      break;
    case "MM":
      civility = language === "a" ? "متزوج" : "Marié";
      break;
    case "DM":
      civility = language === "a" ? "مطلق" : "Divorcé";
      break;
    case "VM":
      civility = language === "a" ? "أرمل" : "Veuf";
      break;
    case "CF":
      civility = language === "a" ? "عزباء" : "Célibataire";
      break;
    case "MF":
      civility = language === "a" ? "متزوجة" : "Mariée";
      break;
    case "DF":
      civility = language === "a" ? "مطلقة" : "Divorcée";
      break;
    case "VF":
      civility = language === "a" ? "أرملة" : "Veuve";
      break;
    default:
      civility = "Unknown marital status";
  }

  return civility;
};

const getAlphabet = (language) => {
  let alphabet = [];

  if (language === "ar") {
    for (let i = 0; i < 28; i++) {
      alphabet.push(String.fromCharCode(1601 + i)); // Arabic characters start from Unicode 1601
    }
  } else if (language === "fr") {
    for (let i = 65; i <= 90; i++) {
      alphabet.push(String.fromCharCode(i)); // Uppercase Latin alphabet characters start from Unicode 65
    }
    for (let i = 97; i <= 122; i++) {
      alphabet.push(String.fromCharCode(i)); // Lowercase Latin alphabet characters start from Unicode 97
    }
  }

  return alphabet;
};

const getGenderName = (gender, language) => {
  let genderName = "";

  if (gender === "F") {
    genderName = language === "a" ? "أنثى" : "Femme"; // Arabic: 'أنثى', French: 'Femme'
  } else if (gender === "M") {
    genderName = language === "a" ? "ذكر" : "Homme"; // Arabic: 'ذكر', French: 'Homme'
  }

  return genderName;
};

function convertDateFormat(dateStr, outputType) {
  // Helper function to add leading zero if needed
  function padZero(number) {
    return number < 10 ? "0" + number : number;
  }

  // Regular expressions to match dd/mm/yyyy, dd-mm-yyyy, yyyy/mm/dd, and yyyy-mm-dd formats
  const dateRegex1 = /^(\d{1,2}|"00")[\/\-](\d{1,2}|"00")[\/\-](\d{4})$/; // dd/mm/yyyy or dd-mm-yyyy
  const dateRegex2 = /^(\d{4})[\/\-](\d{1,2}|00)[\/\-](\d{1,2}|00)$/; // yyyy/mm/dd or yyyy-mm-dd

  let match1 = dateRegex1.exec(dateStr);
  let match2 = dateRegex2.exec(dateStr);

  let day, month, year;
  let type = "E"; // Default to "E" for error

  if (match1) {
    day = parseInt(match1[1], 10);
    month = parseInt(match1[2], 10);
    year = parseInt(match1[3], 10);

    // Basic validation for day and month ranges
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      type = "N"; // Normal date
    } else {
      // Swap day and month if they seem reversed
      if (day >= 1 && day <= 12 && month >= 1 && month <= 31) {
        let temp = day;
        day = month;
        month = temp;
        type = "N";
      } else {
        // If day or month is 00
        if (day == 0 || month == 0) {
          day = 0;
          month = 0;
          type = "P";
        } else {
          type = "E"; // Still an error
        }
      }
    }
  } else if (match2) {
    year = parseInt(match2[1], 10);
    month = parseInt(match2[2], 10);
    day = parseInt(match2[3], 10);

    // Basic validation for day and month ranges
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      type = "N"; // Normal date
    } else {
      type = "E"; // Error if day or month are out of range
    }
  } else {
    // Try to find a 4-digit year and presume a valid date
    let yearMatch = /\b(\d{4})\b/.exec(dateStr);
    if (yearMatch) {
      year = parseInt(yearMatch[1], 10);
      day = 0;
      month = 0;
      type = "P"; // Presumed date
    } else {
      // If no valid year is found, return the fixed error date
      return { date: "01-01-1800", type: type };
    }
  }

  if (type === "E") {
    // Return the fixed error date
    return { date: "01-01-1800", type: type };
  }

  // Format the date parts with leading zeros
  day = padZero(day);
  month = padZero(month);

  // Format the date as 01/01/yyyy if day or month is 00
  let day01 = day === "00" ? "01" : day;
  let month01 = month === "00" ? "01" : month;

  // Format the date as  31/12/yyyy if day or month is 00
  let day31 = day === "00" ? "31" : day;
  let month12 = month === "00" ? "12" : month;

  // Determine the separator based on outputType
  let separator = outputType === "T" ? "-" : "/";

  // Format the date as  31/12/yyyy if day or month is 00
  let preDateAr =
    padZero(day) === "00" || padZero(month) === "00"
      ? "خلال "
      : `${padZero(day)}${separator}${padZero(month)}${separator}`;

  let formattedDate = `${day}${separator}${month}${separator}${year}`;
  let jsFormattedDate = `${month}${separator}${day}${separator}${year}`;
  let formattedDate0101 = `${day01}${separator}${month01}${separator}${year}`;
  let formattedDate3112 = `${day31}${separator}${month12}${separator}${year}`;
  let formattedDatePreAr = `${preDateAr}${year}`;

  return {
    date: formattedDate,
    type: type,
    jsDate: jsFormattedDate,
    date0101: formattedDate0101,
    date3112: formattedDate3112,
    preDateAr: formattedDatePreAr,
  };
}

function sanitizeInput(input) {
  return input.replace(/[^a-zA-Z0-9 ]/g, ""); // Only allow alphanumeric characters and spaces
}

// Function to get the current date and time as a string
function getCurrentDateTimeString() {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
  return `${date}_${time}`;
}

// Function to compress the folder into a ZIP file
function compressFolderToZip(folderPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(`${folderPath}.zip`);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", function () {
      resolve();
    });

    archive.on("error", function (err) {
      reject(err);
    });

    archive.pipe(output);

    // Append the folder to the archive
    archive.directory(folderPath, false);

    archive.finalize();
  });
}

async function getFullDossier() {
  const people = await person.find();
  const systemInfo = await system.findOne();
  const dossies = await dossier.find({ id_commune: systemInfo.communeCode });
  // const dossies = await dossier.find();

  // Create a map of person ID to person data
  const personMap = people.reduce((map, person) => {
    map[person._id] = person;
    return map;
  }, {});

  // Combine dossier data with person data
  const dossierEnq = dossies.map((dossier) => {
    const demandeurInfo = personMap[dossier.id_demandeur] || null;
    var conjoinInfo = [];
    if (dossier.id_conjoin)
      conjoinInfo = dossier.id_conjoin.map((id_conj) => {
        const conjoin = personMap[id_conj] || null;
        return conjoin;
      });

    if (conjoinInfo)
      return {
        ...dossier._doc,
        demandeur: demandeurInfo,
        conjoin: conjoinInfo,
      };
    else return { ...dossier._doc, demandeur: demandeurInfo };
  });

  return dossierEnq;
}

function sortByName(a, b, attribut, type) {
  let x = a.demandeur[attribut].toLowerCase();
  let y = b.demandeur[attribut].toLowerCase();
  if (type === "asc") {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
  }
  if (type === "desc") {
    if (x < y) {
      return 1;
    }
    if (x > y) {
      return -1;
    }
  }

  return 0;
}
function reverseDayAndMonth(dateStr) {
  if (dateStr) {
    const [day, month, year] = dateStr.split("/");
    return `${month}/${day}/${year}`;
  } else {
    return "";
  }
}

function countParentKeyMatches(targetEntry, tableEntries, lowPercentage = 0.84) {
  // Initialize counters
  const results = {
    fatherMatches: [],
    motherMatches: [],
    totalFatherMatches: 0,
    totalMotherMatches: 0,
  };

  // Improved fuzzy match function (Levenshtein-based)
  function calculateSimilarity(str1 = "", str2 = "") {
    if (str1 === str2) return 1;
    if (!str1 || !str2) return 0;

    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) matrix[i] = [i];
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Deletion
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + cost // Substitution
        );
      }
    }

    // Calculate similarity percentage
    const maxLen = Math.max(len1, len2);
    return 1 - matrix[len1][len2] / maxLen;
  }

  // Ensure we have valid target and table entries
  if (!targetEntry?.demandeur || !Array.isArray(tableEntries)) {
    return results;
  }

  const targetFather = targetEntry.demandeur.fatherkey;
  const targetMother = targetEntry.demandeur.motherkey;

  // Compare against all table entries
  tableEntries.forEach((entry) => {
    if (!entry?.demandeur || entry._id === targetEntry._id) return;

    const currentFather = entry.demandeur.fatherkey;
    const currentMother = entry.demandeur.motherkey;

    // Check fatherkey match
    if (targetFather && currentFather) {
      const similarity = calculateSimilarity(targetFather, currentFather);
      if (similarity >= lowPercentage) {
        results.fatherMatches.push({
          matchId: entry._id,
          num_dos: entry.num_dos,
          date_depo: entry.date_depo,
          notes: entry.notes,
          similarity: similarity * 100,
          matchingKey: currentFather,
          demandeur: {
            nom_fr: entry["demandeur"]?.nom_fr,
            prenom_fr: entry["demandeur"]?.prenom_fr,
            date_n: entry["demandeur"]?.date_n,
            stuation_f: entry["demandeur"]?.stuation_f,
            prenom_p_fr: entry["demandeur"]?.prenom_p_fr,
            prenom_m_fr: entry["demandeur"]?.prenom_m_fr,
            nom_m_fr: entry["demandeur"]?.nom_m_fr,
          },
        });
        results.totalFatherMatches++;
      }
    }

    // Check motherkey match
    if (targetMother && currentMother) {
      const similarity = calculateSimilarity(targetMother, currentMother);
      if (similarity >= lowPercentage) {
        results.motherMatches.push({
          matchId: entry._id,
          num_dos: entry.num_dos,
          date_depo: entry.date_depo,
          notes: entry.notes,
          similarity: similarity * 100,
          matchingKey: currentFather,
          demandeur: {
            nom_fr: entry["demandeur"]?.nom_fr,
            prenom_fr: entry["demandeur"]?.prenom_fr,
            date_n: entry["demandeur"]?.date_n,
            stuation_f: entry["demandeur"]?.stuation_f,
            prenom_p_fr: entry["demandeur"]?.prenom_p_fr,
            prenom_m_fr: entry["demandeur"]?.prenom_m_fr,
            nom_m_fr: entry["demandeur"]?.nom_m_fr,
          },
        });
        results.totalMotherMatches++;
      }
    }
  });

  return results;
}

module.exports = {
  isValidDate,
  validateHeader,
  isStrictArabic,
  isStrictFrench,
  getCivility,
  getAlphabet,
  getGenderName,
  convertDateFormat,
  sanitizeInput,
  getCurrentDateTimeString,
  compressFolderToZip,
  getFullDossier,
  sortByName,
  reverseDayAndMonth,
  countParentKeyMatches,
};
