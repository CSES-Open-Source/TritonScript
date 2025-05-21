import { useState, useEffect } from "react";
import axios from "axios";
import NoteBlock from "../components/NoteBlock";
import ClassNote from "../components/ClassNotes/ClassNotes.tsx";
import Note from "../components/Note.tsx";

import settings from "../utils/config";
import filter from '../assets/filter-icon.png';
import edit from '../assets/edit.png';
import note from '../assets/note-placeholder.png';
import "../../src/pages/Dashboard.css";

interface NoteData {
  _id: string;
  note_id: string;
  title: string;
  classInfo: string;
  description: string;
  isPublic: boolean;
  uploader: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<NoteData[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5015/api/notes", { withCredentials: true })

      .then(res => {
        console.log("📦 NOTES DATA:", res.data);
        setNotes(res.data);
      })
      .catch(err => console.error("❌ ERROR FETCHING NOTES:", err));
  }, []);

  const notes_placeholder = [note, note];

  return (
    <div>
      <div className="dashboard-features">
        <div className="search-features">
          <input
            className="search-input"
            type="text"
            placeholder="Search..."
          />
        </div>

        <div className="folders-container">
          <div className="folder-text-and-add">
            <h3 className="folder-text">Folders</h3>
            <img className="add-folder" src="src/assets/plus-solid-dark.svg" />
          </div>
          <div className="folders">
            <div className="folder">Math</div>
            <div className="folder">Physics</div>
            <div className="folder">CS</div>
          </div>
        </div>

        <div className="recent-view-container">
          <h3 className="recent-view-text">Recently Viewed</h3>
          <div className="recent-view">
            {notes.slice(0, 3).map(note => (
              <div className="note" key={note._id}>
                <Note
                  title={note.title}
                  className={note.classInfo || "CSE100"}
                  quarter="SP25"
                  professor={note.uploader || "Unknown"}
                  page="dashboard"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
