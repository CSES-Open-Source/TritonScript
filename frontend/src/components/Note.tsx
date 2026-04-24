import React, { useState } from "react";
import "./Note.css";

const NoteCard = ({ title, className, quarter, professor, page, fileUrl }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleDotsClick = () => {
    setShowOptions(!showOptions);
  };

  const handleDownload = () => {
    if (!fileUrl) return alert("No file attached to this note.");
    window.open(fileUrl, "_blank");
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
              <button className="note-option-add" onClick={handleDownload}>
                <img src="src/assets/folder.svg" alt="Download Icon" className="note-option-icon" />
                Download
              </button>
              {page === "upload" && (
                <button className="note-option-delete" onClick={() => alert("Delete Note")}>
                  <img src="src/assets/delete.svg" alt="Delete Icon" className="note-option-icon" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
