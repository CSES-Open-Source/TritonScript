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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = test;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const user_model_js_1 = __importDefault(require("../models/user.model.js"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function test(req, res) {
    res.json({
        message: "API is working!",
    });
}
// update user
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body.password) {
                req.body.password = bcryptjs_1.default.hashSync(req.body.password, 10);
            }
            const updatedUser = yield user_model_js_1.default.findByIdAndUpdate(req.params.id, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                },
            }, { new: true });
            const _a = updatedUser.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
            res.status(200).json(rest);
        }
        catch (error) {
            next(error);
        }
    });
}
// delete user
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_model_js_1.default.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted...");
        }
        catch (error) {
            next(error);
        }
    });
}
