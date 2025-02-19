import express from "express";
import { createNote } from "../controllers/note.controller";
// import { notes } from "../controllers/note.controller";
import { getNotes } from "../controllers/note.controller";
import multer from 'multer';

//const storage = multer.memoryStorage();  // Store files in memory for now
//const upload = multer({ storage });
const router = express.Router();

// get all notes in order of updatedAt
router.get("/", getNotes);

// // get all notes containing a given search string
// router.get("/search/:name", searchForNoteByName);
//console.log(upload); 
//router.post('/',  upload.single('file'), createNote)


export default router;
