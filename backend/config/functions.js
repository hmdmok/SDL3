import * as XLSX from "xlsx";

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

module.exports = {
  isValidDate,
  validateHeader,
  isStrictArabic,
  isStrictFrench,
};
