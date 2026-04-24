import express from "express";
import {
  getNotes,
  createNote,
  deleteNote,
  getNotesByClass,
  getNotesByQuarter,
  getNotesByProfessor,
  universalSearch,
} from "../controllers/note.controller";
import { uploadFile } from "../controllers/file.controller";

const router = express.Router();

router.get("/", getNotes);
router.post("/", createNote);
router.delete("/:id", deleteNote);
router.post("/upload-file", uploadFile);

router.get("/search/class/:class", getNotesByClass);
router.get("/search/quarter/:quarter", getNotesByQuarter);
router.get("/search/professor/:professor", getNotesByProfessor);
router.get("/search/:term", universalSearch);

export default router;
