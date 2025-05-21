const express = require("express");
const { createNote, getNotes, deleteNote, searchNotesByName, getNotesByClass, getNotesByQuarter, getNotesByProfessor, universalSearch  } = require("../controllers/note.controller");
const { uploadFile } = require("../controllers/file.controller");

const router = express.Router();

// Get all notes in order of updatedAt
router.get("/", getNotes);

// Upload a file
router.post("/upload-file", uploadFile);

// Create a new note
router.post("/", createNote);

router.delete('/:id', deleteNote)

// Search notes by title or classInfo
router.get("/search/:name", searchNotesByName);

// Get notes by classInfo
router.get("/search/class/:class", getNotesByClass);

// Get notes by quarter
router.get("/search/quarter/:quarter", getNotesByQuarter);

// Get notes by professor
router.get("/search/professor/:professor", getNotesByProfessor);

// Search notes by anything
router.get("/search/:term", universalSearch);

module.exports = router;
