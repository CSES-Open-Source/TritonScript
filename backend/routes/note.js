const express = require("express");
const { createNote, getNotes, deleteNote, searchNotesByName, getNotesByClass  } = require("../controllers/note.controller");
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
router.get("/class/:class", getNotesByClass);

module.exports = router;
