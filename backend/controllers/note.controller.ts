import prisma from "../database/connect";
import { Request, Response, NextFunction } from "express";

export function test(req: Request, res: Response) {
  res.json({ message: "API is working!" });
}

export async function getNotes(req: Request, res: Response, next: NextFunction) {
  try {
    const { uploader } = req.query as { uploader?: string };
    const notes = await prisma.note.findMany({
      where: uploader ? { uploader } : undefined,
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

export async function createNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { note_id, title, classInfo, classQuarter, instructor, description, isPublic, uploader, file_id } = req.body;
    const newNote = await prisma.note.create({
      data: {
        note_id,
        title,
        classInfo,
        classQuarter,
        instructor,
        description,
        isPublic: isPublic ?? true,
        uploader,
        file_id,
      },
    });
    res.status(200).json({ success: true, data: newNote });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function deleteNote(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.note.delete({ where: { id: req.params.id } });
    res.status(200).json("Note has been deleted...");
  } catch (error) {
    next(error);
  }
}

export async function searchNotesByName(req: Request, res: Response, next: NextFunction) {
  try {
    const term = req.params.name;
    const notes = await prisma.note.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { classInfo: { contains: term, mode: "insensitive" } },
        ],
      },
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

export async function getNotesByClass(req: Request, res: Response, next: NextFunction) {
  try {
    const notes = await prisma.note.findMany({
      where: { classInfo: { contains: req.params.class, mode: "insensitive" } },
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

export async function getNotesByQuarter(req: Request, res: Response, next: NextFunction) {
  try {
    const notes = await prisma.note.findMany({
      where: { classQuarter: { contains: req.params.quarter, mode: "insensitive" } },
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

export async function getNotesByProfessor(req: Request, res: Response, next: NextFunction) {
  try {
    const notes = await prisma.note.findMany({
      where: { instructor: { contains: req.params.professor, mode: "insensitive" } },
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

export async function universalSearch(req: Request, res: Response, next: NextFunction) {
  try {
    const term = req.params.term;
    const notes = await prisma.note.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { classInfo: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { instructor: { contains: term, mode: "insensitive" } },
          { classQuarter: { contains: term, mode: "insensitive" } },
        ],
      },
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}
