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

    const { note_id, title, classInfo, description, isPublic, uploader } = req.body;
    const newNote = await Note.create({
      note_id,
      title,
      classInfo,
      description,
      isPublic: true,
      uploader,
    });
    res.status(200).json({ success: true, data: newNote });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function deleteNote(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such note" });
    }

    const note = await Note.findOneAndDelete({ _id: id });

    if (!note) {
      return res.status(400).json({ error: "No such note" });
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
}

// Search notes by title or classInfo (case-insensitive, partial match)
async function searchNotesByName(req, res, next) {
  try {
    const { name } = req.params;
    const regex = new RegExp(name, "i");
    const notes = await Note.find({
      $or: [{ title: regex }, { classInfo: regex }]
    }).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

// Get notes by classInfo (exact match, case-insensitive)
async function getNotesByClass(req, res, next) {
  try {
    const { class: className } = req.params;
    const notes = await Note.find({
      classInfo: { $regex: new RegExp(`^${className}$`, "i") }
    }).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

// Optionally, if you need this in other places:
module.exports = {
  test,
  getNotes,
  createNote,
  deleteNote,
  searchNotesByName,
  getNotesByClass
};
