import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UploadModal from "../components/UploadModal";
import "../../src/pages/Upload.css";
import uploadIcon from "../assets/upload-icon.png";
import settings from "../utils/config";

export default function Upload( { terms, isLoadingTerms,}: {terms: { value: string; text: string }[];isLoadingTerms: boolean;}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userNotes, setUserNotes] = useState([]);
  // const [terms, setTerms] = useState<{ value: string; text: string }[]>([]);
  // const [isLoadingTerms, setIsLoadingTerms] = useState(true);
  const { currentUser } = useSelector((state: any) => state.user);

  // Fetch user's previously uploaded notes
  useEffect(() => {
    async function fetchUserNotes() {
      if (!currentUser) return;
      try {
        const res = await fetch(`${settings.domain}/api/notes?uploader=${currentUser.username}`);
        const notes = await res.json();
        setUserNotes(notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }

    fetchUserNotes();
  }, [currentUser]);

  return (
    <div className="upload-container">
      <div className="upload-header">
        <button className="upload-button" onClick={() => setIsModalOpen(true)}>
          <img src={uploadIcon} alt="Upload Icon" className="upload-icon" />
          Upload Note
        </button>
      </div>

      <h2 className="past-notes-title">Past Notes</h2>

      <div className="notes-grid-container">
        <div className="notes-grid">
          {userNotes.length > 0 ? (
            userNotes.map((note, idx) => (
              <div key={note.id || idx} className="note-placeholder">
              </div>
            ))
          ) : (
            // Display placeholders if no notes found
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="note-placeholder" />
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