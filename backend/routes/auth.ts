import express from "express";
import { signin, signup, googleLogin, googleCallback, signout, isAuth, getMe } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/google/login", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/signout", signout);
router.get("/isAuth/:id", isAuth);
router.get("/me", getMe);

export default router;
