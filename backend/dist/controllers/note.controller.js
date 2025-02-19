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
const note_models_1 = __importDefault(require("../models/note.models"));
function test(req, res) {
    res.json({
        message: "API is working!",
    });
}
// get all notes at the same time and sort by recent on top 
function getNotes(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //sort by updatedAt vs createdAt;
            const notes = yield note_models_1.default.find().sort({ updatedAt: -1 });
            res.status(200).json(notes);
        }
        catch (error) {
            next(error);
        }
    });
}
// // search database for notes that contain name.
// export async function searchForNoteByName(req: Request, res: Response, next: NextFunction){
//     try {
//       const regex = new RegExp(req.params.name, "i")  
//       const events = await Note.find({ note_id: regex });
//         res.status(200).json(events);
//       } catch (error) {
//         next(error);
//       }
// }
// update user
function createNote(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.body);
            console.log(req.file);
            //const rest = await r2.url("cses", req.params.id);
            const { note_id, title, classInfo, description, isPublic, uploader, file_id } = req.body;
            const newNote = yield note_models_1.default.create({
                note_id,
                title,
                classInfo,
                description,
                isPublic: true,
                uploader,
                file_id
            });
            res.status(200).json({ success: true, data: newNote });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
}
// export {
//   getNotes,
// //  getNote,
//   createNote
// //  deleteNote
// };
