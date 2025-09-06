"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();

router.post("/signin", auth_controller_1.signin);
// router.post("/google", google);
router.get("/signout", auth_controller_1.signout);
router.get("/isAuth/:id", auth_controller_1.isAuth);
exports.default = router;
