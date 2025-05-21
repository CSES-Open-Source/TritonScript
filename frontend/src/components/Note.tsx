import React, { useState } from "react";
import "./Note.css";

const NoteCard = ({ title, className, quarter, professor, page }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleDotsClick = (e) => {
    // e.stopPropagation(); // Prevent click events from propagating
    setShowOptions(!showOptions);
  };

  return (
    <div className="note-card">
      <div className="note-textarea">
        __________________
        __________________
        __________________
        __________________
        __________________
        __________________
      </div>

      <div className="note-footer">
        <div className="note-info">
          <h2 className="note-title">{title}</h2>
          <p className="note-meta">{className} | {quarter}</p>
          <p className="note-professor">{professor}</p>
        </div>
        <div className="note-dots-container">
          <div className="note-dots" onClick={handleDotsClick}>
            <img src="src/assets/dots.svg" alt="Options" />
          </div>
          {showOptions && (
            <div className="note-options">
              {page === "dashboard" ? (
                <button className="note-option-add" onClick={() => alert("Add to Folder")}>
                  <img src="src/assets/folder.svg" alt="Add Icon" className="note-option-icon" />
                  Add to Folder
                </button>
              ) : page === "upload" ? (
                <button className="note-option-delete" onClick={() => alert("Delete Note")}>
                  <img src="src/assets/delete.svg" alt="Add Icon" className="note-option-icon" />
                  Delete
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;