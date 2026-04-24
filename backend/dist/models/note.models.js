"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const noteSchema = new mongoose_1.default.Schema({
    note_id: {
        type: String,
        required: false,
        unique: true,
    },
    title: {
        type: String,
        required: false,
        unique: false,
    },
    classInfo: {
        type: String,
        required: false,
        unique: false,
    },
    description: {
        type: String,
        required: false,
        unique: false,
    },
    isPublic: {
        type: Boolean,
        required: false,
        unique: false,
    },
    uploader: {
        type: String,
        required: false,
        unique: false,
    },
    file_id: {
        type: String,
        required: false,
        unique: false,
    },
    file: {
        type: Buffer,
        required: false
    }
}, { timestamps: true });
const Note = mongoose_1.default.model("Note", noteSchema);
exports.default = Note;
