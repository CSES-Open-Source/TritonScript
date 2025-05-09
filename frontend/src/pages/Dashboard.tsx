import { useState, useEffect } from "react";
import NoteBlock from "../components/NoteBlock";
import ClassNote from "../components/ClassNotes/ClassNotes.tsx";
import Note from "../components/Note.tsx";

import settings from "../utils/config";
import filter from '../assets/filter-icon.png';
import edit from '../assets/edit.png';
import note from '../assets/note-placeholder.png';
import "../../src/pages/Dashboard.css";


interface Note {
  note_id: number;
  title: string;
  content: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]); // Explicitly type notes as an array of Note

  // 
  // async function fetchNotes() {
  //   try {
  //     const response = await fetch(`${settings.domain}/api/note`, {
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     setNotes(data); 
  //   } catch (error) {
  //     console.error("Error fetching notes:", error);
  //   }
  // }

  // useEffect(() => {
  //   fetchNotes();
  // }, []);

    useEffect(() => {
      const mockNotes: Note[] = [
        {
          note_id: 1,
          title: "Sample Note - Physics",
          content: "This is a sample note to simulate functionality.",
        },
        {
          note_id: 2,
          title: "Sample Note 2 - CS",
          content: "another simulated note.",
        },{
          note_id: 2,
          title: "Sample Note 2 - Math",
          content: "another simulated note.",
        },
      ];
      setNotes(mockNotes); 
    }, []);

    const notes_placeholder = [
      note,
      note,
    ];

  return (
    <div>
        <div className="dashboard-features">
          <div className="search-features">
            <input className="search-input"
              type="text"
              placeholder="Search..."
            />
            {/* <div className="filter">
              <img className="filter-logo" src={filter} alt="search filter icon" />
            </div> */}
            {/* <div className="edit">
              <img className="edit-logo" src={edit} alt="edit icon" />
            </div> */}
          </div>
          
          <div className="folders-container">
            <div className="folder-text-and-add">
              <h3 className="folder-text">Folders</h3>
              <img className ="add-folder" src="src/assets/plus-solid-dark.svg"/>
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
              <div className="note">
              <Note
                  title="Lecture 1"
                  className="CSE120"
                  quarter="SP25"
                  professor="Ousterhoust"
                />
              </div>
              <div className="note">
              <Note
                  title="Lecture 5"
                  className="CSE30"
                  quarter="SP24"
                  professor="Muller"
                />
              </div>
              <div className="note">
              <Note
                  title="Dijktras"
                  className="CSE101"
                  quarter="FA24"
                  professor="Jones"
                />
              </div>
              </div>
          </div>
        </div>
    </div>
  );
}