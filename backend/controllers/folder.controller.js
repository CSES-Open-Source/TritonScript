const r2 = require("../utils/r2");
const Note = require('../models/folder.models');

function test(req, res) {
  res.json({
    message: "API is working!",
  });
}

// Get all notes and sort them by updatedAt in descending order
async function getFolders(req, res, next) {
  try {
    const notes = await Folder.find().sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

// Create a new note
async function createFolder(req, res, next) {
  try {
    console.log(req.body);
    console.log(req.file);

    const { folder_title } = req.body;
    const newFolder = await Note.create({
      folder_title,
    });
    res.status(200).json({ success: true, data: newFolder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function deleteFolder(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such folder" });
    }

    const folder = await Note.findOneAndDelete({ id });

    if (!folder) {
      return res.status(400).json({ error: "No such folder" });
    }
    await Note.updateMany({ folder_id: id }, { $set: { folder_id: null } });
    res.status(200).json(folder);
  } catch (error) {
    next(error);
  }
}

// Optionally, if you need this in other places:
module.exports = {
  test,
  getFolders,
  createFolder,
  deleteFolder,
};
