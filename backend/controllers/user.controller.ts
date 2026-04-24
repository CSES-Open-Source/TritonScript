import prisma from "../database/connect";
import bcryptjs from "bcryptjs";
import { Request, Response, NextFunction } from "express";

export function test(req: Request, res: Response) {
  res.json({ message: "API is working!" });
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profilePicture: req.body.profilePicture,
      },
    });
    const { password, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(200).json("User has been deleted...");
  } catch (error) {
    next(error);
  }
}
