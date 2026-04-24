"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const note_controller_1 = require("../controllers/note.controller");
const file_controller_1 = require("../controllers/file.controller");
const router = express_1.default.Router();
router.get("/", note_controller_1.getNotes);
router.post("/", note_controller_1.createNote);
router.delete("/:id", note_controller_1.deleteNote);
router.post("/upload-file", file_controller_1.uploadFile);
router.get("/search/class/:class", note_controller_1.getNotesByClass);
router.get("/search/quarter/:quarter", note_controller_1.getNotesByQuarter);
router.get("/search/professor/:professor", note_controller_1.getNotesByProfessor);
router.get("/search/:term", note_controller_1.universalSearch);
exports.default = router;
