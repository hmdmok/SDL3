const asyncHandler = require("express-async-handler");
const Communes = require("../config/algeria_cities.json");

function pad(n, length) {
  var len = length - ("" + n).length;
  return (len > 0 ? new Array(++len).join("0") : "") + n;
}

const dairasList = () => {
  // make a dairas list with duplicates
  const dairasDup = Communes.map((commune, indx) => {
    return {
      code: commune.wilaya_code + pad(indx, 4),
      codeWilaya: commune.wilaya_code,
      nomAr: commune.daira_name,
      nomFr: commune.daira_name_ascii,
    };
  });

  // make a dairas list without duplicates
  const uniqueDairasNames = [];
  const dairas = dairasDup.filter((element) => {
    const isDuplicate = uniqueDairasNames.includes(element.nomFr);

    if (!isDuplicate) {
      uniqueDairasNames.push(element.nomFr);

      return true;
    }

    return false;
  });
  return dairas;
};

const getDairas = asyncHandler(async (req, res) => {
  const dairas = dairasList();
  if (dairas) res.json(dairas);
  else {
    res.status(400);
    throw new Error("لا يوجد دوائر في القاعدة");
  }
});

const getDairaByًWilya = asyncHandler(async (req, res) => {
  const codeWilaya = req.body.codeWilaya;
  const dairas = dairasList();
  // make a dairas list without duplicates
  const dairaByWilaya = dairas.filter((element) => {
    if (element.codeWilaya == codeWilaya) {
      return true;
    }

    return false;
  });
  if (dairaByWilaya) res.json(dairaByWilaya);
  else {
    res.status(400);
    throw new Error("الدوائر غير موجودة");
  }
});

module.exports = {
  getDairas,
  getDairaByًWilya,
};
