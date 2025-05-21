import { useState, useEffect } from "react";
import Note from "../components/Note.tsx";
import settings from "../utils/config";
import filter from '../assets/filter-icon.png';
import edit from '../assets/edit.png';
import note from '../assets/note-placeholder.png';
import "../../src/pages/Dashboard.css";

interface Note {
  note_id: number;
  title: string;
  classInfo: string;
  quarter: string;
  professor: string;
  content: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);


  async function fetchNotes() {
    try {
      const response = await fetch(`http://localhost:5005/api/notes`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setNotes(data); 
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
  if (!searchTerm) {
    setSearchResults([]);
    setSearchAttempted(false);
  }
}, [searchTerm]);

  const handleSearch = async () => {
    setSearchAttempted(true);
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5005/api/notes/search/${encodeURIComponent(searchTerm)}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching notes:", error);
    }
  };

  return (
    <div>
      <div className="dashboard-features">
        <div className="search-features">
          <input
            className="search-input"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button className="search-button" onClick={handleSearch}>Enter</button>
          {/* <div className="filter">
            <img className="filter-logo" src={filter} alt="search filter icon" />
          </div> */}
          {/* <div className="edit">
            <img className="edit-logo" src={edit} alt="edit icon" />
          </div> */}
        </div>

        <div className="search-results">
          {searchAttempted && searchTerm ? (
            searchResults.length > 0 ? (
              searchResults.map(note => (
                <div className="note">
                  <Note 
                    key={note.note_id}
                    title={note.title}
                    className={note.classInfo}
                    quarter={note.quarter}
                    professor={note.professor}
                    page="dashboard"
                  />
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "#000", margin: "1rem" }}>
                No notes found
              </div>
            )
          ) : null}
        </div>
        
      {(!searchAttempted || !searchTerm) && (
        <>
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
                  page="dashboard"
                />
              </div>
              <div className="note">
                <Note
                  title="Lecture 5"
                  className="CSE30"
                  quarter="SP24"
                  professor="Muller"
                  page="dashboard"
                />
              </div>
              <div className="note">
                <Note
                  title="Dijktras"
                  className="CSE101"
                  quarter="FA24"
                  professor="Jones"
                  page="dashboard"
                />
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}