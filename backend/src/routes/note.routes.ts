import express from 'express';
import { 
  getUploadUrl, 
  createNote, 
  getUserNotes, 
  getNoteById,
  getDownloadUrl,
  deleteNote 
} from '../controllers/note.controller';
import { auth } from '../middleware/auth'; // Use your auth middleware

const router = express.Router();

// All routes require authentication
router.post('/get-upload-url', auth, getUploadUrl);
router.post('/create', auth, createNote);
router.get('/', auth, getUserNotes);
router.get('/:noteId/download', auth, getDownloadUrl);
router.get('/:noteId', auth, getNoteById);
router.delete('/:noteId', auth, deleteNote);

export default router;
