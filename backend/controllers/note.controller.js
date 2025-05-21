//const Note = require("../models/note.models");
const r2 = require("../utils/r2");
const Note = require('../models/note.models');

// If you plan to use multer in the future, you can uncomment this
// const multer = require('multer');

function test(req, res) {
  res.json({
    message: "API is working!",
  });
}

// Get all notes and sort them by updatedAt in descending order
async function getNotes(req, res, next) {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

// Create a new note
async function createNote(req, res, next) {
  try {
    console.log(req.body);
    console.log(req.file);

    const { note_id, title, classInfo, description, isPublic, uploader, instructor, classQuarter } = req.body;
    const newNote = await Note.create({
      note_id,
      title,
      classInfo,
      classQuarter,
      instructor,
      description,
      isPublic: true,
      uploader,
    });
    res.status(200).json({ success: true, data: newNote });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

// Optionally, if you need this in other places:
module.exports = {
  test,
  getNotes,
  createNote
};
