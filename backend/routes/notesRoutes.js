const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesControllers");

const router = express.Router();

router.route("/").get(getNotes);
router
  .route("/:id")
  .get(getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);
router.route("/create").post(protect, createNote);

module.exports = router;
