import { useState, useEffect } from "react";
import Note from "../components/Note.tsx";
import settings from "../utils/config";
import "../../src/pages/Dashboard.css";

interface NoteData {
  id: string;
  note_id?: string;
  title?: string;
  classInfo?: string;
  classQuarter?: string;
  instructor?: string;
  description?: string;
  file_id?: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<NoteData[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  useEffect(() => {
    fetch(`${settings.domain}/api/notes`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err));
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
      const response = await fetch(
        `${settings.domain}/api/notes/search/${encodeURIComponent(searchTerm)}`,
        { credentials: "include" }
      );
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
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          />
          <button className="search-button" onClick={handleSearch}>Enter</button>
        </div>

        {searchAttempted && searchTerm ? (
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((note) => (
                <div key={note.id} className="note">
                  <Note
                    title={note.title}
                    className={note.classInfo}
                    quarter={note.classQuarter}
                    professor={note.instructor}
                    page="dashboard"
                    fileUrl={note.file_id}
                  />
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "#000", margin: "1rem" }}>
                No notes found
              </div>
            )}
          </div>
        ) : (
          <>
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
                {notes.length === 0 ? (
                  <p style={{ color: "#888", margin: "1rem" }}>No notes yet.</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="note">
                      <Note
                        title={note.title}
                        className={note.classInfo}
                        quarter={note.classQuarter}
                        professor={note.instructor}
                        page="dashboard"
                        fileUrl={note.file_id}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
