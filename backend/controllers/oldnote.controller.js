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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = test;
exports.getNotes = getNotes;
exports.createNote = createNote;
var note_models_1 = require("../models/note.models");
function test(req, res) {
    res.json({
        message: "API is working!",
    });
}
// get all notes at the same time and sort by recent on top 
function getNotes(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var notes, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, note_models_1.default.find().sort({ updatedAt: -1 })];
                case 1:
                    notes = _a.sent();
                    res.status(200).json(notes);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    next(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
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
    return __awaiter(this, void 0, void 0, function () {
        var _a, note_id, title, classInfo, description, isPublic, uploader, file_id, newNote, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    console.log(req.body);
                    console.log(req.file);
                    _a = req.body, note_id = _a.note_id, title = _a.title, classInfo = _a.classInfo, description = _a.description, isPublic = _a.isPublic, uploader = _a.uploader, file_id = _a.file_id;
                    return [4 /*yield*/, note_models_1.default.create({
                            note_id: note_id,
                            title: title,
                            classInfo: classInfo,
                            description: description,
                            isPublic: true,
                            uploader: uploader,
                            file_id: file_id
                        })];
                case 1:
                    newNote = _b.sent();
                    res.status(200).json({ success: true, data: newNote });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _b.sent();
                    res.status(400).json({ success: false, error: error_2.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// export {
//   getNotes,
// //  getNote,
//   createNote
// //  deleteNote
// };
