const express = require("express");
const { createFolder, deleteFolder, getFolders } = require("../controllers/folder.controller");

const router = express.Router();

// Get all folders
router.get("/", getFolders);

// Create a folder
router.post("/folder", createFolder);

router.delete('/folder/:id', deleteFolder)

module.exports = router;
