import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

type Note = {
  _id: string;
  note_id: string;
  title: string;
  classInfo: string;
  description: string;
  isPublic: boolean;
  uploader: string;
  updatedAt: string;
};

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    axios.get("/api/notes")
      .then(res => {
        console.log("📦 NOTES DATA:", res.data);
        setNotes(res.data);
      })
      .catch(err => console.error("❌ ERROR FETCHING NOTES:", err));
  }, []);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">All Notes</h1>
      <div className="note-grid">
        {notes.map(note => (
          <div className="note-card" key={note._id}>
            <div className="note-preview" />
            <div className="note-card-bottom">
              <div className="note-info">
                <h2 className="note-title">{note.title}</h2>
                <p className="note-meta">{note.classInfo} | SP25</p>
                <p className="note-professor">{note.uploader}</p>
              </div>
              <span className="note-dots">⋯</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
