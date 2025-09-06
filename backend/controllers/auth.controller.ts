import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export async function signin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, "secret");
    const { password: hashedPassword, ...rest } = validUser.toObject();
    const expiryDate = new Date(Date.now() + 3600000);
    res.cookie("access_token", token, { httpOnly: true, expires: expiryDate }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

export async function isAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "You are not authenticated!"));

  jwt.verify(token, "secret", (err, user) => {
    if (err) return next(errorHandler(403, "Token is not valid!"));
    if (req.params.id !== user.id) return next(errorHandler(403, "You are not authenticated!"));
    if (req.params.id === user.id) return res.status(200).json(true);
  });
}

export async function google(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, "secret");
      const { password: hashedPassword, ...rest } = user.toObject();
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, "secret");
      const { password: hashedPassword2, ...rest } = newUser.toObject();
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
}

export function signout(req: Request, res: Response) {
  console.log("signout", res);
  res.clearCookie("access_token").status(200).json("Signout success!");
}
