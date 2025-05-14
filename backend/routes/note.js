const express = require("express");
const { createNote, getNotes } = require("../controllers/note.controller");
const { uploadFile } = require("../controllers/file.controller");

const router = express.Router();

// Get all notes in order of updatedAt
router.get("/", getNotes);

// Upload a file
router.post("/upload-file", uploadFile);

// Create a new note
router.post("/", createNote);

router.delete('/:id', deleteNote)

module.exports = router;
