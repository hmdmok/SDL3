const XLSX = require("xlsx");

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
    case "C":
      civility = language === "a" ? "أعزب/عزباء" : "Célibataire";
      break;
    case "M":
      civility = language === "a" ? "متزوج/متزوجة" : "Marié(e)";
      break;
    case "D":
      civility = language === "a" ? "مطلق/مطلقة" : "Divorcé(e)";
      break;
    case "V":
      civility = language === "a" ? "أرمل/أرملة" : "Veuf/Veuve";
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

function convertDateFormat(dateStr) {
  // Split the input date string by "/"
  let parts = dateStr.split("/");

  // Change 00 to 01 if its found
  if (parts[0] === "00") parts[0] = "01";
  if (parts[1] === "00") parts[1] = "01";

  // Rearrange the parts into the new format
  let newDateStr = `${parts[0]}-${parts[1]}-${parts[2]}`;

  return newDateStr;
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
};
