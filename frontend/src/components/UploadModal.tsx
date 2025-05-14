import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import "../pages/Upload.css";
import uploadIcon from "../assets/upload-icon2.png";
import settings from "../utils/config";

interface UploadModalProps {
    onClose: () => void;
    terms: { value: string; text: string }[];
    isLoadingTerms: boolean;
}

export default function UploadModal({ onClose, terms, isLoadingTerms }: UploadModalProps) {
    const { currentUser } = useSelector((state: any) => state.user);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        classInfo: "",
        description: "",
        uploader: "",
        instructor: ""
    });

    // const [terms, setTerms] = useState<{ value: string; text: string }[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [isLoadingInstructors, setIsLoadingInstructors] = useState(false);
    
    const [courses, setCourses] = useState<string[]>([]);
    const [instructors, setInstructors] = useState<string[]>([]);

    const [selectedTerm, setSelectedTerm] = useState<string>("");
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    
    // useEffect(() => {
    //     fetch("http://localhost:3000/terms")
    //         .then((res) => res.json())
    //         .then((data) => setTerms(data.terms))
    //         .catch((err) => console.error("Error fetching terms:", err));
    // }, []);
    
    useEffect(() => {
        setIsLoadingCourses(true);
        async function fetchCourses() {
            try {
                const res = await fetch(`http://localhost:3000/courses`);
                const data = await res.json();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setIsLoadingCourses(false);
            }
        }
        fetchCourses();
    }, []);
    
    useEffect(() => {
        async function fetchInstructors() {
            if (!selectedTerm || !selectedCourse) return;
            setIsLoadingInstructors(true); 
            try {
                const res = await fetch(`http://localhost:3000/instructors?term=${selectedTerm}&course=${selectedCourse}`);
                const data = await res.json();
                setInstructors(data.instructors);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            } finally {
                setIsLoadingInstructors(false);
            }
        }
        fetchInstructors();
    }, [selectedTerm, selectedCourse]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTerm(e.target.value);
    };

    const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCourse(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedTerm || !selectedCourse || !formData.title || !file) {
            return alert("Please fill out all required fields and upload a file");
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
            onClose();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-body">
                    <div className="upload-drop-area">
                        <label htmlFor="file-upload" className="upload-placeholder">
                            <img src={uploadIcon} alt="Upload Icon" className="upload-icon2" />
                            <p className="upload-text">
                                {file ? file.name : "Click to upload"}
                            </p>
                            <input 
                                id="file-upload" 
                                type="file" 
                                accept="application/pdf" 
                                onChange={handleFileChange} 
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>
                    <form className="upload-form" onSubmit={handleSubmit}>
                        <input 
                            className="upload-input" 
                            type="text" 
                            name="title" 
                            placeholder="Note title" 
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <select 
                            className="upload-input" 
                            value={selectedTerm} 
                            onChange={handleTermChange}
                        >
                            <option value="">{isLoadingTerms ? "Loading terms..." : "Choose a term and quarter"}</option>
                            {terms.map((term) => (
                                <option key={term.value} value={term.value}>
                                    {term.text}
                                </option>
                            ))}
                        </select>
                        <select 
                            className="upload-input" 
                            value={selectedCourse} 
                            onChange={handleCourseChange}
                        >
                            <option value="">{isLoadingCourses ? "Loading courses..." : "Choose a course code"}</option>
                            {courses.map((course) => (
                                <option key={course} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
                        <select 
                            className="upload-input" 
                            name="instructor" 
                            value={formData.instructor} 
                            onChange={handleChange}
                        >
                            <option value="">{isLoadingInstructors ? "Loading instructors..." : "Choose an instructor"}</option>
                            {instructors.map((instructor) => (
                                <option key={instructor} value={instructor}>
                                    {instructor}
                                </option>
                            ))}
                        </select>
                        <button 
                            className="submit-upload-button" 
                            type="submit" 
                            disabled={isUploading}
                        >
                            {isUploading ? "Uploading..." : "Upload Note"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
