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
exports.signup = signup;
exports.signin = signin;
exports.isAuth = isAuth;
exports.googleLogin = googleLogin;
exports.googleCallback = googleCallback;
exports.signout = signout;
exports.getMe = getMe;
const connect_1 = __importDefault(require("../database/connect"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const error_1 = require("../utils/error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5005";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const CALLBACK_URL = `${BACKEND_URL}/api/auth/google/callback`;
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
function signup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        try {
            yield connect_1.default.user.create({
                data: { username, email, password: hashedPassword },
            });
            res.status(201).json({ message: "User created successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
function signin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const validUser = yield connect_1.default.user.findUnique({ where: { email } });
            if (!validUser)
                return next((0, error_1.errorHandler)(404, "User not found"));
            const validPassword = bcryptjs_1.default.compareSync(password, validUser.password);
            if (!validPassword)
                return next((0, error_1.errorHandler)(401, "Wrong credentials"));
            const token = jsonwebtoken_1.default.sign({ id: validUser.id }, JWT_SECRET);
            const { password: _ } = validUser, rest = __rest(validUser, ["password"]);
            const expiryDate = new Date(Date.now() + 7 * 24 * 3600000);
            res.cookie("access_token", token, { httpOnly: true, expires: expiryDate, sameSite: "lax" })
                .status(200).json(rest);
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
            return next((0, error_1.errorHandler)(401, "You are not authenticated!"));
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
            if (err)
                return next((0, error_1.errorHandler)(403, "Token is not valid!"));
            if (req.params.id !== user.id)
                return next((0, error_1.errorHandler)(403, "You are not authenticated!"));
            return res.status(200).json(true);
        });
    });
}
// Step 1: redirect browser to Google's OAuth consent screen
function googleLogin(_req, res) {
    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: CALLBACK_URL,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "select_account",
    });
    res.redirect(`${GOOGLE_AUTH_URL}?${params}`);
}
// Step 2: Google redirects here with ?code=...
function googleCallback(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code } = req.query;
        if (!code)
            return next((0, error_1.errorHandler)(400, "Missing authorization code"));
        try {
            // Exchange code for access token
            const tokenResp = yield fetch(GOOGLE_TOKEN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    code,
                    client_id: GOOGLE_CLIENT_ID,
                    client_secret: GOOGLE_CLIENT_SECRET,
                    redirect_uri: CALLBACK_URL,
                    grant_type: "authorization_code",
                }).toString(),
            });
            if (!tokenResp.ok)
                return next((0, error_1.errorHandler)(400, "Token exchange failed"));
            const tokens = yield tokenResp.json();
            // Get user info from Google
            const userInfoResp = yield fetch(GOOGLE_USERINFO_URL, {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });
            if (!userInfoResp.ok)
                return next((0, error_1.errorHandler)(400, "Failed to get user info"));
            const info = yield userInfoResp.json();
            // Find or create user
            let user = yield connect_1.default.user.findUnique({ where: { email: info.email } });
            if (!user) {
                user = yield connect_1.default.user.create({
                    data: {
                        username: info.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-6),
                        email: info.email,
                        password: bcryptjs_1.default.hashSync(Math.random().toString(36).slice(-16), 10),
                        profilePicture: info.picture,
                    },
                });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET);
            const expiryDate = new Date(Date.now() + 7 * 24 * 3600000); // 7 days
            res.cookie("access_token", token, { httpOnly: true, expires: expiryDate, sameSite: "lax" })
                .redirect(FRONTEND_URL);
        }
        catch (error) {
            next(error);
        }
    });
}
function signout(_req, res) {
    res.clearCookie("access_token").status(200).json("Signout success!");
}
function getMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.access_token;
        if (!token)
            return res.status(200).json(null);
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = yield connect_1.default.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, username: true, email: true, profilePicture: true },
            });
            return res.status(200).json(user !== null && user !== void 0 ? user : null);
        }
        catch (_a) {
            return res.status(200).json(null);
        }
    });
}
