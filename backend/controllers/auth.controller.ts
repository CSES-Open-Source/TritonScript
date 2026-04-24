import prisma from "../database/connect";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5005";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const CALLBACK_URL = `${BACKEND_URL}/api/auth/google/callback`;

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export async function signup(req: Request, res: Response, next: NextFunction) {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
}

export async function signin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const validUser = await prisma.user.findUnique({ where: { email } });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));
    const token = jwt.sign({ id: validUser.id }, JWT_SECRET);
    const { password: _, ...rest } = validUser;
    const expiryDate = new Date(Date.now() + 7 * 24 * 3600000);
    res.cookie("access_token", token, { httpOnly: true, expires: expiryDate, sameSite: "lax" })
      .status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

export async function isAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "You are not authenticated!"));
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return next(errorHandler(403, "Token is not valid!"));
    if (req.params.id !== user.id) return next(errorHandler(403, "You are not authenticated!"));
    return res.status(200).json(true);
  });
}

// Step 1: redirect browser to Google's OAuth consent screen
export function googleLogin(_req: Request, res: Response) {
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
export async function googleCallback(req: Request, res: Response, next: NextFunction) {
  const { code } = req.query as { code?: string };
  if (!code) return next(errorHandler(400, "Missing authorization code"));

  try {
    // Exchange code for access token
    const tokenResp = await fetch(GOOGLE_TOKEN_URL, {
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
    if (!tokenResp.ok) return next(errorHandler(400, "Token exchange failed"));
    const tokens = await tokenResp.json() as { access_token: string };

    // Get user info from Google
    const userInfoResp = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!userInfoResp.ok) return next(errorHandler(400, "Failed to get user info"));
    const info = await userInfoResp.json() as { email: string; name: string; picture: string };

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: info.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: info.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-6),
          email: info.email,
          password: bcryptjs.hashSync(Math.random().toString(36).slice(-16), 10),
          profilePicture: info.picture,
        },
      });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    const expiryDate = new Date(Date.now() + 7 * 24 * 3600000); // 7 days

    res.cookie("access_token", token, { httpOnly: true, expires: expiryDate, sameSite: "lax" })
      .redirect(FRONTEND_URL);
  } catch (error) {
    next(error);
  }
}

export function signout(_req: Request, res: Response) {
  res.clearCookie("access_token").status(200).json("Signout success!");
}

export async function getMe(req: Request, res: Response) {
  const token = req.cookies.access_token;
  if (!token) return res.status(200).json(null);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true, profilePicture: true },
    });
    return res.status(200).json(user ?? null);
  } catch {
    return res.status(200).json(null);
  }
}
