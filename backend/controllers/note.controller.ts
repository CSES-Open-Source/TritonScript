import Note from "../models/note.models";
import r2 from "../utils/r2";
import multer from 'multer';

import { Request, Response, NextFunction } from "express";
import { upload } from "../server";

export function test(req: Request, res: Response) {
  res.json({
    message: "API is working!",
  });
}

// get all notes at the same time and sort by recent on top 
export async function getNotes(req: Request, res: Response, next: NextFunction) {
  try {
    //sort by updatedAt vs createdAt;
    const notes = await Note.find().sort({updatedAt: -1});
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

// // search database for notes that contain name.
// export async function searchForNoteByName(req: Request, res: Response, next: NextFunction){
//     try {
//       const regex = new RegExp(req.params.name, "i")  
//       const events = await Note.find({ note_id: regex });
//         res.status(200).json(events);
        
//       } catch (error) {
//         next(error);
//       }
// }

// update user
export async function createNote(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.body)
    console.log(req.file)

    //const rest = await r2.url("cses", req.params.id);
    const { note_id, title, classInfo, description, isPublic, uploader, file_id } = req.body;
    const newNote = await Note.create({
      note_id,
      title,
      classInfo,
      description,
      isPublic: true,
      uploader,
      file_id
    });
    res.status(200).json({ success: true, data: newNote });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

// export {
//   getNotes,
// //  getNote,
//   createNote
// //  deleteNote
// };



