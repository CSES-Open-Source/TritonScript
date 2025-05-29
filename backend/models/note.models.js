"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
const { type } = require("os");
var noteSchema = new mongoose_1.default.Schema({
    note_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: false,
        unique: false,
    },
    classQuarter: {
        type: String,
        required: true,
        unique: false,
    },
    instructor: {
        type: String,
        required: true,
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
var Note = mongoose_1.default.model("Note", noteSchema);
//"exports.default = Note;"
module.exports = Note;