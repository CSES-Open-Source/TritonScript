import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    note_id: {
      type: String,
      required: false,
      unique: true,
    },
    title: {
      type: String,
      required: false,
      unique: false,
    },
    classInfo: {
      type: String,
      required: false,
      unique: false,
    },
    description: {
      type: String,
      required: false,
      unique: false,
    },
    isPublic: {
      type: Boolean,
      required: false,
      unique: false,
    },
    uploader: {
      type: String,
      required: false,
      unique: false,
    },
    file_id: {
      type: String,
      required: false,
      unique: false,
    },
    file: {
      type: Buffer,
      required: false
    }
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
