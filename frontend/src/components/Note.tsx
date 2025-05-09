import React, { useState } from "react";
import "./Note.css";

const NoteCard = ({title, className, quarter, professor}) => {
  const [note, setNote] = useState("");

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
        <div className="note-dots">•••</div>
      </div>
    </div>
  );
};

export default NoteCard;
