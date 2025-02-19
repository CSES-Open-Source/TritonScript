"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_js_1 = require("./error.js");
function verifyToken(req, res, next) {
    const token = req.cookies.access_token;
    if (!token)
        return next((0, error_js_1.errorHandler)(401, "You are not authenticated!"));
    jsonwebtoken_1.default.verify(token, "secret", (err, user) => {
        if (err)
            return next((0, error_js_1.errorHandler)(403, "Token is not valid!"));
        req.user = user;
        next();
    });
}
