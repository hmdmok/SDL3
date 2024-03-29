const asyncHandler = require("express-async-handler");
const dossier = require("../models/dossierModel");
const Person = require("../models/personModel");
const Notes = require("../models/notesModel");
const generateToken = require("../utils/generateToken");
const { calculate } = require("./CalculeNotesDossier");
const person = require("../models/personModel");

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
      const updatedPerson = await personToUpdate.save();
      res.status(201).json(updatedPerson);
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

const getDossierByFilters = asyncHandler(async (req, res) => {
  const {
    dossiersCount,
    numDoss,
    nomFr,
    prenomFr,
    birthDate,
    fromDate,
    toDate,
    situationFamiliale,
  } = req.body;

  const persons = await Person.find();

  const dossiers = await dossier.find().sort({ notes: -1 });
  const dossierByNotes = dossiers.map((dossierFound) => {
    let newdossier = dossierFound;
    persons.map((personMaped) => {
      if (dossierFound.id_demandeur === personMaped._id.toString()) {
        newdossier = { ...newdossier._doc, demandeur: personMaped };
      }
      if (dossierFound.id_conjoin === personMaped._id.toString()) {
        newdossier = { ...newdossier, conjoin: personMaped };
      }
    });
    return newdossier;
  });
  // await dossier.aggregate([
  //   {
  //     $match: {
  //       date_depo: {
  //         $gte: fromDate,
  //         $lt: toDate,
  //       },
  //     },
  //   },
  //   {
  //     $lookup: {
  //       localField: "id_demandeur",
  //       foreignField: "personId",
  //       as: "demandeur",
  //       pipeline: [{ $documents: persons }],
  //     },
  //   },
  //   { $sort: { notes: -1 } },
  // ]);

  const filtredByDate = dossierByNotes.filter((filtredDossiers) => {
    return filtredDossiers?.num_dos
      ?.toLowerCase()
      .includes(numDoss?.toLowerCase());
  });

  const filtredByNames = filtredByDate?.filter((filtredDemand) => {
    return (
      filtredDemand.demandeur?.nom_fr
        ?.toLowerCase()
        .includes(nomFr?.toLowerCase()) &&
      filtredDemand.demandeur?.prenom_fr
        ?.toLowerCase()
        .includes(prenomFr?.toLowerCase()) &&
      filtredDemand.demandeur?.date_n.includes(birthDate) &&
      new Date(filtredDemand.date_depo) >= new Date(fromDate) &&
      new Date(filtredDemand.date_depo) <= new Date(toDate)
    );
  });

  const filtredBySituation = filtredByNames.filter((filtredDossiers) => {
    if (situationFamiliale === "all") return true;
    else return filtredDossiers.demandeur?.stuation_f === situationFamiliale;
  });

  const FinalList = filtredBySituation
    ?.sort((a, b) => b.notes - a.notes)
    .slice(0, dossiersCount - 0);

  if (dossierByNotes) {
    res.json(FinalList);
  } else {
    res.status(400);
    throw new Error("لا توجد ملفات");
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

  const demandeurData = await Person.findById(id_demandeur);
  if (!demandeurData) {
    res.status(400);
    throw new Error("يرجى ادخال معلومات صحيحة لطالب السكن");
  } else {
    salairDemandeur = demandeurData.salaire || 0;
    situationFamiliale = demandeurData.stuation_f;
  }

  let conjoinData;
  id_conjoin && id_conjoin !== ""
    ? (conjoinData = await Person.findById(id_conjoin))
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
  const demandeurData = await Person.findById(id_demandeur);
  if (id_conjoin && id_conjoin !== "") {
    conjoinData = await Person.findById(id_conjoin);
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
  getDossierByDates,
  getDossierByFilters,
  getDossierByNumDoss,
};
