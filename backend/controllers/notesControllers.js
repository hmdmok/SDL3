const asyncHandler = require("express-async-handler");
const Notes = require("../models/notesModel");

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Notes.find();
  if (notes) res.json(notes);
  else {
    res.status(400);
    throw new Error("لا يوجد نقاط");
  }
});

const getNoteById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const noteById = await Notes.findById(id);
  if (noteById) res.json(noteById);
  else {
    res.status(400);
    throw new Error("النقطة غير موجود");
  }
});

const createNote = asyncHandler(async (req, res) => {
  const { notes, code, nom } = req.body;

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!notes || !code || !nom) {
    res.status(400);
    throw new Error("يجب ادخال كل معلومات النقاط");
  }
  const noteToAdd = await Notes.create({
    notes,
    code,
    nom,
  });

  if (noteToAdd) {
    res.status(201).json({
      _id: noteToAdd._id,
      nom: noteToAdd.nom,
    });
  } else {
    res.status(400);
    throw new Error("خطء في انشاء التنقيط الجديد");
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { notes, code, nom } = req.body;

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  const id = req.params.id;
  const noteToUpdate = await Notes.findById(id);

  if (!noteToUpdate) {
    res.status(400);
    throw new Error("هذا التنقيط غير موجود");
  } else {
    noteToUpdate.notes = notes || noteToUpdate.notes;
    noteToUpdate.code = code || noteToUpdate.code;
    noteToUpdate.nom = nom || noteToUpdate.nom;

    const updatedNote = await noteToUpdate.save();
    res.status(201).json(updatedNote);
  }
});

const deleteNote = asyncHandler(async (req, res) => {
  const noteId = req.params.id;
  const noteData = await Notes.findById(noteId);

  if (req.user.usertype !== "super") {
    res.status(400);
    throw new Error("المستخدم غير مرخص");
  }

  if (!noteData) {
    res.status(400);
    throw new Error("هذا التنقيط غير موجود");
  } else {
    //do somethink
    await noteData.remove();
    res.json({ message: "تم حذف التنقيط" });
  }
});

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
