import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UploadModal from "../components/UploadModal";
import "../../src/pages/Upload.css";
import uploadIcon from "../assets/upload-icon.png";
import settings from "../utils/config";
import Note from "../components/Note.tsx";

interface NoteData {
  id: string;
  title?: string;
  classInfo?: string;
  classQuarter?: string;
  instructor?: string;
  file_id?: string;
}

export default function Upload({
  terms,
  isLoadingTerms,
}: {
  terms: { value: string; text: string }[];
  isLoadingTerms: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userNotes, setUserNotes] = useState<NoteData[]>([]);
  const { currentUser } = useSelector((state: any) => state.user);

  useEffect(() => {
    if (!currentUser) return;
    fetch(`${settings.domain}/api/notes?uploader=${encodeURIComponent(currentUser.username)}`)
      .then((res) => res.json())
      .then((notes) => setUserNotes(notes))
      .catch((err) => console.error("Error fetching notes:", err));
  }, [currentUser]);

  return (
    <div className="upload-container">
      <div className="upload-header">
        <button className="upload-button" onClick={() => setIsModalOpen(true)}>
          <img src={uploadIcon} alt="Upload Icon" className="upload-icon" />
          Upload Note
        </button>
      </div>

      <div className="past-notes-container">
        <h3 className="past-notes-text">Past Notes</h3>
        <div className="past-view">
          {userNotes.length === 0 ? (
            <p style={{ color: "#888", margin: "1rem" }}>No notes uploaded yet.</p>
          ) : (
            userNotes.map((note) => (
              <div key={note.id} className="note">
                <Note
                  title={note.title}
                  className={note.classInfo}
                  quarter={note.classQuarter}
                  professor={note.instructor}
                  page="upload"
                  fileUrl={note.file_id}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          terms={terms}
          isLoadingTerms={isLoadingTerms}
        />
      )}
    </div>
  );
}
