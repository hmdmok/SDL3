const asyncHandler = require("express-async-handler");
const dossier = require("../models/dossierModel");
const person = require("../models/personModel");
const Notes = require("../models/notesModel");
const generateToken = require("../utils/generateToken");
const { calculate } = require("./CalculeNotesDossier");
const {
  getFullDossier,
  sortByName,
  convertDateFormat,
} = require("../config/functions");

const getDossiers = asyncHandler(async (req, res) => {
  const dossiers = await dossier.find();

  if (dossiers) res.json(dossiers);
  else {
    res.status(400);
    throw new Error("لا يوجد ملفات");
  }
});

const getDossierByNumDoss = asyncHandler(async (req, res) => {
  const id = req.params.num_dos.replace("-", "/");

  const photo_link = req.file?.path;

  const dossierById = await dossier.findOne({ num_dos: id });

  if (dossierById) {
    const personToUpdate = await person.findById(dossierById.id_demandeur);

    if (!personToUpdate) {
      res.status(400);
      throw new Error("هذا الشخص غير موجود");
    } else {
      personToUpdate.photo_link = photo_link;
      const updatedperson = await personToUpdate.save();
      res.status(201).json(updatedperson);
    }
  } else {
    res.status(400);
    throw new Error("الملف غير موجود");
  }
});

const getDossierById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const dossierById = await dossier.findById(id);
  if (dossierById) res.json(dossierById);
  else {
    res.status(400);
    throw new Error("الملف غير موجود");
  }
});

const getDossierByFilters = asyncHandler(async (req, res) => {
  try {
    const page = Number(req.query.page) - 1 || 0;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search || "";
    let Sort = req.query.sort || "notes";
    let fromDate = req.query.fromDate || "";
    let toDate = req.query.toDate || "";

    const {
      dossiersCount,
      numDoss,
      nomFr,
      prenomFr,
      birthDate,

      situationFamiliale,
      dateEtude,
      plusMoin35Value,
    } = req.body;

    const dossierByNotes = await getFullDossier();

    var keyArray1 = dossierByNotes.map(function (item) {
      return {
        _id: item._id,
        num_dos: item.num_dos,
        date_depo: item.date_depo,
        notes: item.notes,
        demandeur: item["demandeur"],
      };
    });

    var filterBySearch = keyArray1.filter(function (item) {
      return (
        item.num_dos?.toLowerCase().includes(search.toLowerCase()) ||
        item.demandeur?.nom_fr.toLowerCase().includes(search.toLowerCase()) ||
        item.demandeur?.prenom_fr
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.demandeur?.date_n.toLowerCase().includes(search.toLowerCase()) ||
        item.notes === parseInt(search.toLowerCase())
      );
    });

    //filter by fromDate and toDate
    filterBySearch = filterBySearch.filter((dossier) => {
      let fdCheck = true;
      let tdCheck = true;

      if (fromDate !== "") {
        fdCheck = !(
          new Date(convertDateFormat(dossier.date_depo)).getTime() <=
          new Date(convertDateFormat(fromDate)).getTime()
        );
      }
      if (toDate) {
        tdCheck = !(
          new Date(convertDateFormat(dossier.date_depo)).getTime() >=
          new Date(convertDateFormat(toDate)).getTime()
        );
        console.log(
          "check:" +
            tdCheck +
            " ,date depo:" +
            new Date(convertDateFormat(dossier.date_depo)).getTime() +
            " ,date to:" +
            convertDateFormat(dossier.date_depo)
        );
      }
      return fdCheck && tdCheck;
    });

    // Sort by methode
    let sort = {};
    Sort = Sort.split(",");
    if (Sort[1]) {
      sort.name = Sort[0];
      sort.type = Sort[1];
    } else {
      sort.name = Sort[0];
      sort.type = "desc";
    }
    switch (sort.name) {
      case "nom":
        filterBySearch = filterBySearch.sort(
          sortByName(a, b, "nom_fr", sort.type)
        );
        break;

      case "prenom":
        filterBySearch = filterBySearch.sort(
          sortByName(a, b, "prenom_fr", sort.type)
        );
        break;

      case "date_n":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            return (
              new Date(
                convertDateFormat(b.demandeur.date_n, "S").jsDate
              ).getTime() -
              new Date(
                convertDateFormat(a.demandeur.date_n, "S").jsDate
              ).getTime()
            );
          } else if (sort.type === "desc") {
            return (
              new Date(
                convertDateFormat(a.demandeur.date_n, "S").jsDate
              ).getTime() -
              new Date(
                convertDateFormat(b.demandeur.date_n, "S").jsDate
              ).getTime()
            );
          }
        });
        break;

      case "date_depo":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            console.log(convertDateFormat(b.date_depo, "S").jsDate);
            return (
              new Date(
                convertDateFormat(a.date_depo, "S")?.jsDate
              ).getTime() -
              new Date(
                convertDateFormat(b.date_depo, "S")?.jsDate
              ).getTime()
            );
          } else if (sort.type === "desc") {
            return (
              new Date(
                convertDateFormat(b.date_depo, "S")?.jsDate
              ).getTime() -
              new Date(
                convertDateFormat(a.date_depo, "S")?.jsDate
              ).getTime()
            );
          }
        });
        break;

      case "notes":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            return a.notes - b.notes;
          } else if (sort.type === "desc") {
            return b.notes - a.notes;
          }
          return b.notes - a.notes;
        });
        break;
    }

    const filtredByNumDoss = dossierByNotes.filter((filtredDossiers) => {
      return filtredDossiers?.num_dos
        ?.toLowerCase()
        .includes(numDoss?.toLowerCase());
    });

    const filtredByNames = filtredByNumDoss?.filter((filtredDemand) => {
      return (
        filtredDemand.demandeur?.nom_fr
          ?.toLowerCase()
          .includes(nomFr?.toLowerCase()) &&
        filtredDemand.demandeur?.prenom_fr
          ?.toLowerCase()
          .includes(prenomFr?.toLowerCase())
        //   &&
        // filtredDemand.demandeur?.date_n.includes(birthDate) &&
        // new Date(filtredDemand.date_depo) >= new Date(fromDate) &&
        // new Date(filtredDemand.date_depo) <= new Date(toDate)
      );
    });

    const filtredByBirthday = filtredByNames?.filter((filtredDemand) => {
      if (birthDate === "") return true;
      else {
        return filtredDemand.demandeur?.date_n.includes(birthDate);
        // &&
        // new Date(filtredDemand.date_depo) >= new Date(fromDate) &&
        // new Date(filtredDemand.date_depo) <= new Date(toDate)
      }
    });

    const filtredByDateDepo = filtredByBirthday?.filter((filtredDemand) => {
      if (plusMoin35Value === "m") {
        return (
          new Date(convertDateFormat(filtredDemand.demandeur?.date_n).jsDate) >=
          new Date(
            new Date(dateEtude).getFullYear() - 35,
            new Date(dateEtude).getMonth(),
            new Date(dateEtude).getDate()
          )
        );
      } else if (plusMoin35Value === "p")
        return (
          new Date(convertDateFormat(filtredDemand.demandeur?.date_n).jsDate) <=
          new Date(
            new Date(dateEtude).getFullYear() - 35,
            new Date(dateEtude).getMonth(),
            new Date(dateEtude).getDate()
          )
        );
      else return true;
    });

    const filtredBySituation = filtredByDateDepo.filter((filtredDossiers) => {
      if (situationFamiliale === "all") return true;
      else return filtredDossiers.demandeur?.stuation_f === situationFamiliale;
    });

    const FinalList = filtredBySituation
      ?.sort((a, b) => b.notes - a.notes)
      .slice(0, dossiersCount - 0);

    // Skip page * limit and limit
    filterBySearch = filterBySearch.filter((x, i) => {
      if (i > page * limit - 1 && i < page * limit + limit) {
        return true;
      }
    });
    var keyArray = filterBySearch.map(function (item) {
      return {
        _id: item._id,
        num_dos: item.num_dos,
        date_depo: item.date_depo,
        notes: item.notes,
        demandeur: {
          nom_fr: item["demandeur"].nom_fr,
          prenom_fr: item["demandeur"].prenom_fr,
          date_n: item["demandeur"].date_n,
          stuation_f: item["demandeur"].stuation_f,
        },
      };
    });

    if (keyArray) {
      res.json(keyArray);
    } else {
      res.status(400);
      throw new Error("لا توجد ملفات");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
    throw new Error(error.message);
  }
});

const createDossier = asyncHandler(async (req, res) => {
  const {
    creator,
    id_demandeur,
    id_conjoin,
    date_depo,
    num_dos,
    num_enf,
    stuation_s_avec_d,
    stuation_s_andicap,
    stuation_d,
    numb_p,
    type,
    gender_conj,
    remark,
    saisi_conj,
    scan_dossier,
  } = req.body;

  let dossierExists;
  num_dos && num_dos !== ""
    ? (dossierExists = await dossier.findOne({ num_dos: num_dos }))
    : (dossierExists = null);
  if (dossierExists) {
    res.status(400);
    throw new Error("هذا الملف موجود من قبل");
  }

  let conjoinExists;
  id_conjoin && id_conjoin !== ""
    ? (conjoinExists = await dossier.findOne({ id_demandeur: id_conjoin }))
    : (conjoinExists = null);
  if (conjoinExists) {
    res.status(400);
    throw new Error("الزوج(ة) يمتلك ملف من قبل");
  }

  let demandeurExists;
  id_demandeur && id_demandeur !== ""
    ? (demandeurExists = await dossier.findOne({ id_demandeur: id_demandeur }))
    : (demandeurExists = null);
  if (demandeurExists) {
    res.status(400);
    throw new Error("الشخص يمتلك ملف من قبل");
  }

  let salairDemandeur = "",
    salairConjoin = "",
    situationFamiliale = "";
  const tableNotes = await Notes.find();

  const demandeurData = await person.findById(id_demandeur);
  if (!demandeurData) {
    res.status(400);
    throw new Error("يرجى ادخال معلومات صحيحة لطالب السكن");
  } else {
    salairDemandeur = demandeurData.salaire || 0;
    situationFamiliale = demandeurData.stuation_f;
  }

  let conjoinData;
  id_conjoin && id_conjoin !== ""
    ? (conjoinData = await person.findById(id_conjoin))
    : (conjoinData = null);
  if (!conjoinData) {
    salairConjoin = 0;
  } else {
    salairConjoin = conjoinData.salaire || 0;
  }

  let newNotes =
      calculate(
        req.body,
        salairDemandeur,
        salairConjoin,
        situationFamiliale,
        tableNotes
      ) || 0,
    notes = newNotes;

  const dossierToAdd = await dossier.create({
    creator,
    id_demandeur,
    id_conjoin,
    date_depo,
    num_dos,
    num_enf,
    stuation_s_avec_d,
    stuation_s_andicap,
    stuation_d,
    numb_p,
    type,
    gender_conj,
    remark,
    saisi_conj,
    scan_dossier,
    notes,
  });

  if (dossierToAdd) {
    res.status(201).json({
      _id: dossierToAdd._id,
      token: generateToken(dossierToAdd._id),
    });
  } else {
    res.status(400);
    throw new Error("خطء في انشاء ملف جديد");
  }
});

const updateDossier = asyncHandler(async (req, res) => {
  const {
    creator,
    id_demandeur,
    id_conjoin,
    date_depo,
    num_dos,
    num_enf,
    stuation_s_avec_d,
    stuation_s_andicap,
    stuation_d,
    numb_p,
    type,
    gender_conj,
    remark,
    saisi_conj,
    scan_dossier,
  } = req.body;

  const id = req.params.id;
  const dossierToUpdate = await dossier.findById(id);

  let conjoinData, salairConjoin;
  const tableNotes = await Notes.find();
  const demandeurData = await person.findById(id_demandeur);
  if (id_conjoin && id_conjoin !== "") {
    conjoinData = await person.findById(id_conjoin);
    salairConjoin = conjoinData.salaire || 0;
  } else salairConjoin = 0;
  const salairDemandeur = demandeurData?.salaire || 0;

  const situationFamiliale = demandeurData?.stuation_f;

  let notes = calculate(
    req.body,
    salairDemandeur,
    salairConjoin,
    situationFamiliale,
    tableNotes
  );

  if (!dossierToUpdate) {
    res.status(400);
    throw new Error("هذا الملف غير موجود");
  } else {
    dossierToUpdate.creator = creator || dossierToUpdate.creator;
    dossierToUpdate.id_demandeur = id_demandeur || dossierToUpdate.id_demandeur;
    dossierToUpdate.id_conjoin = id_conjoin || dossierToUpdate.id_conjoin;
    dossierToUpdate.date_depo = date_depo || dossierToUpdate.date_depo;
    dossierToUpdate.num_dos = num_dos || dossierToUpdate.num_dos;
    dossierToUpdate.num_enf = num_enf || dossierToUpdate.num_enf;
    dossierToUpdate.stuation_s_avec_d =
      stuation_s_avec_d || dossierToUpdate.stuation_s_avec_d;
    dossierToUpdate.stuation_s_andicap =
      stuation_s_andicap || dossierToUpdate.stuation_s_andicap;
    dossierToUpdate.stuation_d = stuation_d || dossierToUpdate.stuation_d;
    dossierToUpdate.numb_p = numb_p || dossierToUpdate.numb_p;
    dossierToUpdate.type = type || dossierToUpdate.type;
    dossierToUpdate.gender_conj = gender_conj || dossierToUpdate.gender_conj;
    dossierToUpdate.remark = remark || dossierToUpdate.remark;
    dossierToUpdate.saisi_conj = saisi_conj || dossierToUpdate.saisi_conj;
    dossierToUpdate.scan_dossier = scan_dossier || dossierToUpdate.scan_dossier;
    dossierToUpdate.notes = notes || dossierToUpdate.notes;

    const updatedDossier = await dossierToUpdate.save();
    res.status(201).json(updatedDossier);
  }
});

const deleteDossier = asyncHandler(async (req, res) => {
  const dossierId = req.params.id;
  const dossierData = await dossier.findById(dossierId);

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!dossierData) {
    res.status(400);
    throw new Error("هذا الملف غير موجود");
  } else {
    //do somethink
    await dossierData.remove();
    res.json({ message: "تم حذف الملف" });
  }
});

module.exports = {
  createDossier,
  getDossiers,
  getDossierById,
  updateDossier,
  deleteDossier,
  getDossierByFilters,
  getDossierByNumDoss,
};
