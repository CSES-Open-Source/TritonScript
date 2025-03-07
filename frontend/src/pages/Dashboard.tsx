import { useState, useEffect } from "react";
import filter from '../assets/filter-icon.png';
import edit from '../assets/edit.png';
import noteImage from '../assets/note-placeholder.png'; // ✅ Renamed to avoid confusion
import "../../src/pages/Dashboard.css";

interface Note {
  _id: string; 
  note_id: string;
  title: string;
  classInfo: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]); 
  const [groupedNotes, setGroupedNotes] = useState<{ [className: string]: Note[] }>({});

  // ✅ Fetch Notes from Backend
  async function fetchNotes() {
    try {
      const response = await fetch("http://localhost:5004/api/notes", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Fetched Notes:", data); 
      setNotes(data);

      // ✅ Group notes by class
      const grouped = data.reduce((acc: { [key: string]: Note[] }, note: Note) => {
        if (!acc[note.classInfo]) acc[note.classInfo] = [];
        acc[note.classInfo].push(note);
        return acc;
      }, {});
      setGroupedNotes(grouped);
      
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
        <div className="dashboard-features">
          <div className="search-features">
            <input className="search-input"
              type="text"
              placeholder="Search"
            />
            <div className="filter">
              <img className="filter-logo" src={filter} alt="search filter icon" />
            </div>
            <div className="edit">
              <img className="edit-logo" src={edit} alt="edit icon" />
            </div>
          </div>
          <div className="notes-grid">
              {/* ✅ Recent Notes (Left Side) */}
              <div className="recent-notes">
                <div className="recent-notes-text">
                  <p><b>RECENT NOTES</b></p>
                  <div className="note-container">
                    {notes.length > 0 ? (
                      notes.map((oneNote) => (
                        <div key={oneNote._id} className="note-card">
                          <img 
                            className="placeholder-note-recent" 
                            src={noteImage} // ✅ Fix: Use the correct image
                            alt={oneNote.title || "placeholder note"} 
                          />
                          <p className="note-title">{oneNote.title || "Untitled Note"}</p>
                        </div>
                      ))
                    ) : (
                      <p>No notes available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ✅ Class Notes (Right Side) */}
              <div className="class-notes-sidebar">
                {Object.keys(groupedNotes).map((className) => (
                  <div key={className} className="class-section">
                    <p className="class-title">{className}</p>
                    <div className="class-note-container">
                      {groupedNotes[className].map((note) => (
                        <div key={note._id} className="note-card">
                          <img 
                            className="placeholder-note-recent" 
                            src={noteImage} // ✅ Fix: Uses the same image as recent notes
                            alt={note.title || "placeholder note"} 
                          />
                          <p className="note-title">{note.title || "Untitled Note"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
    </div>
  );
}
