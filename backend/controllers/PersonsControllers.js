const asyncHandler = require("express-async-handler");
const person = require("../models/personModel");
const generateToken = require("../utils/generateToken");

const getPersons = asyncHandler(async (req, res) => {
  const persons = await person.find();
  if (persons) res.json(persons);
  else {
    res.status(400);
    throw new Error("لا يوجد اشخاص");
  }
});

const getPersonById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const personById = await person.findById(id);
  if (personById) res.json(personById);
  else {
    res.status(400);
    throw new Error("الشخص غير موجود");
  }
});

const createPerson = asyncHandler(async (req, res) => {
  const {
    type,
    prenom,
    prenom_fr,
    nom,
    nom_fr,
    gender,
    num_act,
    date_n,
    lieu_n,
    lieu_n_fr,
    wil_n,
    com_n,
    prenom_p,
    prenom_p_fr,
    prenom_m,
    prenom_m_fr,
    nom_m,
    nom_m_fr,
    num_i_n,
    stuation_f,
    situation_p,
    profession,
    salaire,
    creator,
  } = req.body;

  const personToAdd = await person.create({
    type,
    prenom,
    prenom_fr,
    nom,
    nom_fr,
    gender,
    num_act,
    date_n,
    lieu_n,
    lieu_n_fr,
    wil_n,
    com_n,
    prenom_p,
    prenom_p_fr,
    prenom_m,
    prenom_m_fr,
    nom_m,
    nom_m_fr,
    num_i_n,
    stuation_f,
    situation_p,
    profession,
    salaire,
    creator,
  });

  if (personToAdd) {
    res.status(201).json({
      _id: personToAdd._id,
      token: generateToken(personToAdd._id),
    });
  } else {
    res.status(400);
    throw new Error("خطء في انشاء ملف جديد");
  }
});

const updatePerson = asyncHandler(async (req, res) => {
  const {
    type,
    prenom,
    prenom_fr,
    nom,
    nom_fr,
    gender,
    num_act,
    date_n,
    lieu_n,
    lieu_n_fr,
    wil_n,
    com_n,
    prenom_p,
    prenom_p_fr,
    prenom_m,
    prenom_m_fr,
    nom_m,
    nom_m_fr,
    num_i_n,
    stuation_f,
    situation_p,
    profession,
    salaire,
    creator,
  } = req.body;

  const id = req.params.id;
  const personToUpdate = await person.findById(id);

  if (!personToUpdate) {
    res.status(400);
    throw new Error("هذا الشخص غير موجود");
  } else {
    personToUpdate.type = type || personToUpdate.type;
    personToUpdate.prenom = prenom || personToUpdate.prenom;
    personToUpdate.prenom_fr = prenom_fr || personToUpdate.prenom_fr;
    personToUpdate.nom = nom || personToUpdate.nom;
    personToUpdate.nom_fr = nom_fr || personToUpdate.nom_fr;
    personToUpdate.gender = gender || personToUpdate.gender;
    personToUpdate.num_act = num_act || personToUpdate.num_act;
    personToUpdate.date_n = date_n || personToUpdate.date_n;
    personToUpdate.lieu_n = lieu_n || personToUpdate.lieu_n;
    personToUpdate.lieu_n_fr = lieu_n_fr || personToUpdate.lieu_n_fr;
    personToUpdate.wil_n = wil_n || personToUpdate.wil_n;
    personToUpdate.com_n = com_n || personToUpdate.com_n;
    personToUpdate.prenom_p = prenom_p || personToUpdate.prenom_p;
    personToUpdate.prenom_p_fr = prenom_p_fr || personToUpdate.prenom_p_fr;
    personToUpdate.prenom_m = prenom_m || personToUpdate.prenom_m;
    personToUpdate.prenom_m_fr = prenom_m_fr || personToUpdate.prenom_m_fr;
    personToUpdate.nom_m = nom_m || personToUpdate.nom_m;
    personToUpdate.nom_m_fr = nom_m_fr || personToUpdate.nom_m_fr;
    personToUpdate.num_i_n = num_i_n || personToUpdate.num_i_n;
    personToUpdate.stuation_f = stuation_f || personToUpdate.stuation_f;
    personToUpdate.situation_p = situation_p || personToUpdate.situation_p;
    personToUpdate.profession = profession || personToUpdate.profession;
    personToUpdate.salaire = salaire || personToUpdate.salaire;
    personToUpdate.creator = creator || personToUpdate.creator;

    const updatedPerson = await personToUpdate.save();
    res.status(201).json(updatedPerson);
  }
});

const deletePerson = asyncHandler(async (req, res) => {
  const personId = req.params.id;
  const personData = await person.findById(personId);

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!personData) {
    res.status(400);
    throw new Error("هذا الشخص غير موجود");
  } else {
    //do somethink
    await personData.remove();
    res.json({ message: "تم حذف الشخص" });
  }
});

const addPhotoToPerson = asyncHandler(async (req, res) => {
  const { personToUpdateId } = req.body;

  const photo_link = req.file?.path;

  const personToUpdate = await person.findById(personToUpdateId);

  if (!personToUpdate) {
    res.status(400);
    throw new Error("هذا الشخص غير موجود");
  } else {
    personToUpdate.photo_link = photo_link;
    const updatedPerson = await personToUpdate.save();
    res.status(201).json(updatedPerson);
  }
});

module.exports = {
  createPerson,
  getPersons,
  getPersonById,
  updatePerson,
  deletePerson,
  addPhotoToPerson
};
