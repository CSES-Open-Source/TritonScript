import { useState } from "react";
import UploadModal from "../components/UploadModal";
import "../../src/pages/Upload.css"; 
import uploadIcon from "../assets/upload-icon.png";

export default function Upload() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUserNotes() {
      if (!currentUser) return; // Ensure the user is logged in
      try {
        const res = await fetch(`${settings.domain}/api/notes?uploader=${currentUser.username}`);
        const notes = await res.json();
        setUserNotes(notes); // Update the state with fetched notes
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }

    fetchUserNotes();
  }, [currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  function handleChange(e: any) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  
  async function handleSubmit(e: any) {
    e.preventDefault();
    const id = uuidv4();

  return (
    <div className="upload-container">
      <div className="upload-header">
        {/* <h1 className="upload-title">Upload Note</h1> */}
        <button className="upload-button" onClick={() => setIsModalOpen(true)}>
          <img src={uploadIcon} alt="Upload Icon" className="upload-icon" />
          Upload Note
        </button>
      </div>

      <h2 className="past-notes-title">Past Notes</h2>

      <div className="notes-grid-container">
        <div className="notes-grid">
          {Array.from({ length: 20 }).map((_, idx) => (
            <div key={idx} className="note-placeholder" />
          ))}
        </div>
      </div>

      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
