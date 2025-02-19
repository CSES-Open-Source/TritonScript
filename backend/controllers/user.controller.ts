import User from "../models/user.model.js";
import { 
  
 } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import { Request, Response, NextFunction } from "express";

export function test(req: Request, res: Response) {
  res.json({
    message: "API is working!",
  });
}

// update user

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser.toObject();
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

// delete user

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (error) {
    next(error);
  }
}
