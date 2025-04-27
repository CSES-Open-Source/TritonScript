"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// import { notes } from "../controllers/note.controller";
var note_controller_1 = require("../controllers/note.controller");
//const storage = multer.memoryStorage();  // Store files in memory for now
//const upload = multer({ storage });
var router = express_1.default.Router();
// get all notes in order of updatedAt
router.get("/", note_controller_1.getNotes);
// // get all notes containing a given search string
// router.get("/search/:name", searchForNoteByName);
//console.log(upload); 
//router.post('/',  upload.single('file'), createNote)
exports.default = router;
