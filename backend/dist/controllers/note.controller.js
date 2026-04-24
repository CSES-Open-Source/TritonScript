"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = test;
exports.getNotes = getNotes;
exports.createNote = createNote;
exports.deleteNote = deleteNote;
exports.searchNotesByName = searchNotesByName;
exports.getNotesByClass = getNotesByClass;
exports.getNotesByQuarter = getNotesByQuarter;
exports.getNotesByProfessor = getNotesByProfessor;
exports.universalSearch = universalSearch;
const connect_1 = __importDefault(require("../database/connect"));
function test(req, res) {
    res.json({ message: "API is working!" });
}
function getNotes(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { uploader } = req.query;
            const notes = yield connect_1.default.note.findMany({
                where: uploader ? { uploader } : undefined,
                orderBy: { updatedAt: "desc" },
            });
            res.status(200).json(notes);
        }
        catch (error) {
            next(error);
        }
    });
}
function createNote(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { note_id, title, classInfo, classQuarter, instructor, description, isPublic, uploader, file_id } = req.body;
            const newNote = yield connect_1.default.note.create({
                data: {
                    note_id,
                    title,
                    classInfo,
                    classQuarter,
                    instructor,
                    description,
                    isPublic: isPublic !== null && isPublic !== void 0 ? isPublic : true,
                    uploader,
                    file_id,
                },
            });
            res.status(200).json({ success: true, data: newNote });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
}
function deleteNote(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connect_1.default.note.delete({ where: { id: req.params.id } });
            res.status(200).json("Note has been deleted...");
        }
        catch (error) {
            next(error);
        }
    });
}
function searchNotesByName(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const term = req.params.name;
            const notes = yield connect_1.default.note.findMany({
                where: {
                    OR: [
                        { title: { contains: term, mode: "insensitive" } },
                        { classInfo: { contains: term, mode: "insensitive" } },
                    ],
                },
                orderBy: { updatedAt: "desc" },
            });
            res.status(200).json(notes);
        }
        catch (error) {
            next(error);
        }
    });
}
function getNotesByClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notes = yield connect_1.default.note.findMany({
                where: { classInfo: { contains: req.params.class, mode: "insensitive" } },
                orderBy: { updatedAt: "desc" },
            });
            res.status(200).json(notes);
        }
        catch (error) {
            next(error);
        }
    });
}
function getNotesByQuarter(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notes = yield connect_1.default.note.findMany({
                where: { classQuarter: { contains: req.params.quarter, mode: "insensitive" } },
                orderBy: { updatedAt: "desc" },
            });
            res.status(200).json(notes);
        }
        catch (error) {
            next(error);
        }
    });
}
function getNotesByProfessor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notes = yield connect_1.default.note.findMany({
                where: { instructor: { contains: req.params.professor, mode: "insensitive" } },
                orderBy: { updatedAt: "desc" },
            });
            res.status(200).json(notes);
        }
        catch (error) {
            next(error);
        }
    });
}
function universalSearch(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const term = req.params.term;
            const notes = yield connect_1.default.note.findMany({
                where: {
                    OR: [
                        { title: { contains: term, mode: "insensitive" } },
                        { classInfo: { contains: term, mode: "insensitive" } },
                        { description: { contains: term, mode: "insensitive" } },
                        { instructor: { contains: term, mode: "insensitive" } },
                        { classQuarter: { contains: term, mode: "insensitive" } },
                    ],
                },
                orderBy: { updatedAt: "desc" },
            });
            res.status(200).json(notes);
        }
        catch (error) {
            next(error);
        }
    });
}
