import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UploadModal from "../components/UploadModal";
import "../../src/pages/Upload.css";
import uploadIcon from "../assets/upload-icon.png";
import settings from "../utils/config";
import Note from "../components/Note.tsx";

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

      <div className="past-notes-container">
            <h3 className="past-notes-text">Past Notes</h3>
              <div className="past-view">
              <div className="note">
              <Note
                  title="Lecture 1"
                  className="CSE120"
                  quarter="SP25"
                  professor="Ousterhoust"
                  page="upload"
                />
              </div>
              <div className="note">
              <Note
                  title="Lecture 5"
                  className="CSE30"
                  quarter="SP24"
                  professor="Muller"
                  page="upload"
                />
              </div>
              <div className="note">
              <Note
                  title="Dijktras"
                  className="CSE101"
                  quarter="FA24"
                  professor="Jones"
                  page="upload"
                />
              </div>
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