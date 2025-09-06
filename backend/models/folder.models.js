"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
const { type } = require("os");
var folderSchema = new mongoose_1.default.Schema({
    folder_title: {
        type: String,
        required: false,
        unique: false,
    }
}, { timestamps: true });
var Folder = mongoose_1.default.model("Folder", folderSchema);
module.exports = Folder;