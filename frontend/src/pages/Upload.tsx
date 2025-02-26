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

  const [terms, setTerms] = useState<{ value: string; text: string }[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<string[]>([]);

  // Selected values
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");


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

  useEffect(() => {
    fetch("http://localhost:3000/terms")
      .then((res) => res.json())
      .then((data) => setTerms(data.terms)) 
      .catch((err) => console.error("Error fetching terms:", err));
  }, []);
  
  
  
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch(`http://localhost:3000/courses`);
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, []); 
  
  
  useEffect(() => {
    async function fetchInstructors() {
      if (!selectedTerm || !selectedCourse) return;
      try {
        const res = await fetch(`http://localhost:3000/instructors?term=${selectedTerm}&course=${selectedCourse}`);
        const data = await res.json();
        setInstructors(data.instructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    }
    fetchInstructors();
  }, [selectedTerm, selectedCourse]);
  

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
    if (!selectedTerm || !selectedCourse || !formData.title || !formData.description) {
      return alert("Please fill out all fields");
    }
  
    const id = uuidv4();
    setIsUploading(true);
    
    const submissionData = {
      ...formData,
      classInfo: selectedCourse, 
      uploader: currentUser.username,
    };
  
    try {
      const res = await fetch(`${settings.domain}/api/note/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
  
      const _url = await res.json();
      await fetch(_url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "application/pdf" },
      });
  
      alert("Upload Success!");
      setFormData({ title: "", classInfo: "", description: "", uploader: "", instructor: "" });
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  }
  
  // async function handleSubmit(e: any) {
  //   e.preventDefault();
  //   const id = uuidv4();

  //   if (formData.title === "" || formData.classInfo === "" || formData.description === "")
  //     return alert("Please fill out all fields");
  //   if (file === null) return alert("Please upload a file");
  //   setIsUploading(true);
  //   formData["uploader"] = currentUser.username;
  //   const res = await fetch(`${settings.domain}/api/note/${id}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(formData),
  //   });
  //   const _url = await res.json();

  //   while (true) {
  //     try {
  //       await fetch(_url, {
  //         method: "PUT",
  //         body: file,
  //         headers: {
  //           "Content-Type": "applcation/pdf",
  //         },
  //       });
  //       break;
  //     } catch (e) {
  //       await new Promise((resolve) => setTimeout(resolve, 5000));
  //     }
  //   }
  //   setIsUploading(false);
  //   alert("Upload Success!");
  //   setFormData({ title: "", classInfo: "", description: "", uploader: "", instructor: "" });
  //   setFile(null);
  // }
  // const notes_placeholder = [
  //   note,
  //   note,
  // ];
  return (
    <div>
      <div className="upload-grid">
        <div className="upload-box">
          <p className="upload-text-title"><b>UPLOAD NOTES</b></p>
          <div className="upload-options">
              <label htmlFor="file" className="sr-only">
              </label>
              <input className="file-upload" accept="application/pdf" id="file" type="file" onChange={handleFileChange} />
            <div className="upload-fields">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                id="title"
                className="field"
                onChange={handleChange}
              />
              <select id="term" className="field" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
                <option value="">Select Term</option>
                {terms.map((term) => (
                  <option key={term.value} value={term.value}>
                    {term.text}
                  </option>
                ))}
              </select>

              <select id="classInfo" className="field" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>

              <select id="instructor" className="field" value={formData.instructor} onChange={handleChange}>
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor} value={instructor}>
                    {instructor}
                  </option>
                ))}
              </select>
              {/* <input
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
              /> */}
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
