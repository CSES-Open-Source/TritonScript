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
exports.signin = signin;
exports.isAuth = isAuth;
exports.google = google;
exports.signout = signout;
const user_model_js_1 = __importDefault(require("../models/user.model.js"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const error_js_1 = require("../utils/error.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));

function signin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const validUser = yield user_model_js_1.default.findOne({ email });
            if (!validUser)
                return next((0, error_js_1.errorHandler)(404, "User not found"));
            const validPassword = bcryptjs_1.default.compareSync(password, validUser.password);
            if (!validPassword)
                return next((0, error_js_1.errorHandler)(401, "wrong credentials"));
            const token = jsonwebtoken_1.default.sign({ id: validUser._id }, "secret");
            const _a = validUser.toObject(), { password: hashedPassword } = _a, rest = __rest(_a, ["password"]);
            const expiryDate = new Date(Date.now() + 3600000);
            res.cookie("access_token", token, { httpOnly: true, expires: expiryDate }).status(200).json(rest);
        }
        catch (error) {
            next(error);
        }
    });
}
function isAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.access_token;
        if (!token)
            return next((0, error_js_1.errorHandler)(401, "You are not authenticated!"));
        jsonwebtoken_1.default.verify(token, "secret", (err, user) => {
            if (err)
                return next((0, error_js_1.errorHandler)(403, "Token is not valid!"));
            if (req.params.id !== user.id)
                return next((0, error_js_1.errorHandler)(403, "You are not authenticated!"));
            if (req.params.id === user.id)
                return res.status(200).json(true);
        });
    });
}
function google(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_js_1.default.findOne({ email: req.body.email });
            if (user) {
                const token = jsonwebtoken_1.default.sign({ id: user._id }, "secret");
                const _a = user.toObject(), { password: hashedPassword } = _a, rest = __rest(_a, ["password"]);
                const expiryDate = new Date(Date.now() + 3600000);
                res
                    .cookie("access_token", token, {
                    httpOnly: true,
                    expires: expiryDate,
                })
                    .status(200)
                    .json(rest);
            }
            else {
                const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const hashedPassword = bcryptjs_1.default.hashSync(generatedPassword, 10);
                const newUser = new user_model_js_1.default({
                    username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
                    email: req.body.email,
                    password: hashedPassword,
                    profilePicture: req.body.photo,
                });
                yield newUser.save();
                const token = jsonwebtoken_1.default.sign({ id: newUser._id }, "secret");
                const _b = newUser.toObject(), { password: hashedPassword2 } = _b, rest = __rest(_b, ["password"]);
                const expiryDate = new Date(Date.now() + 3600000); // 1 hour
                res
                    .cookie("access_token", token, {
                    httpOnly: true,
                    expires: expiryDate,
                })
                    .status(200)
                    .json(rest);
            }
        }
        catch (error) {
            next(error);
        }
    });
}
function signout(req, res) {
    console.log("signout", res);
    res.clearCookie("access_token").status(200).json("Signout success!");
}
