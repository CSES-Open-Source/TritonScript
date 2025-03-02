import { useState, useEffect } from "react";
import settings from "../utils/config";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import "../../src/pages/Upload.css";
import ClassNote from "../components/ClassNotes/ClassNotes.tsx";
import note from '../assets/note-placeholder.png';

export default function Upload() {
  const { currentUser } = useSelector((state: any) => state.user);
  const [formData, setFormData] = useState({ title: "", classInfo: "", description: "", uploader: "", instructor: "" });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userNotes, setUserNotes] = useState<any[]>([]);

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

    if (formData.title === "" || formData.classInfo === "" || formData.description === "")
      return alert("Please fill out all fields");
    if (file === null) return alert("Please upload a file");
    setIsUploading(true);
    formData["uploader"] = currentUser.username;
    const res = await fetch(`${settings.domain}/api/note/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const _url = await res.json();

    while (true) {
      try {
        await fetch(_url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": "applcation/pdf",
          },
        });
        break;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
    setIsUploading(false);
    alert("Upload Success!");
    setFormData({ title: "", classInfo: "", description: "", uploader: "", instructor: "" });
    setFile(null);
  }
  // const notes_placeholder = [
  //   note,
  //   note,
  // ];
  return (
    <div>
      <div className="upload-grid">
        <div className="upload-box">
          <p className="upload-text-title"><b>UPLOAD NOTES</b></p>
          {/* <button onClick={upload}>ss</button> */}
          <div className="upload-options">
            {/* <div> */}
              <label htmlFor="file" className="sr-only">
              </label>
              <input className="file-upload" accept="application/pdf" id="file" type="file" onChange={handleFileChange} />
            {/* </div> */}
            <div className="upload-fields">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                id="title"
                className="field"
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Class"
                id="classInfo"
                className="field"
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Description"
                id="description"
                className="field"
                onChange={handleChange}
              />
               <input
                type="text"
                placeholder="Instructor"
                id="instructor"
                className="field"
                onChange={handleChange}
              />
                <button className="upload-button">Upload PDF</button>
            </form>
          </div>
          <div>{isUploading ? "uploading..." : ""}</div>
        </div>
        </div>
        <div className="past-notes-box">
            <p>PAST NOTES</p>
            {/* <ClassNote classTitle={"CSE 30"} notes={notes_placeholder}/>
                <ClassNote classTitle={"PHYS 2C"} notes={notes_placeholder}/>
                <ClassNote classTitle={"ECE 65"} notes={notes_placeholder}/> */}
              {userNotes.length > 0 ? (
              userNotes.map((note) => (
              <ClassNote
                key={note.id}
                classTitle={note.classInfo}
                notes={[note]}
              />
            ))
          ) : (
            <p>No notes found for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
}
