import express from "express";
import { signin, google, signout, isAuth } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signin", signin);
// router.post("/google", google);
router.get("/signout", signout);
router.get("/isAuth/:id", isAuth);

export default router;
