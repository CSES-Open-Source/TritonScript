import "../pages/Upload.css"; 
import uploadIcon from "../assets/upload-icon2.png";

interface UploadModalProps {
    onClose: () => void;
}

export default function UploadModal({ onClose }: UploadModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-body">
                    <div className="upload-drop-area">
                        <div className="upload-placeholder">
                            <img src={uploadIcon} alt="Upload Icon" className="upload-icon2" />
                            <p className="upload-text">Click to upload</p>
                        </div>
                    </div>
                    <div className="upload-form">
                        <input className="upload-input" type="text" placeholder="Choose a term and quarter" />
                        <input className="upload-input" type="text" placeholder="Choose a course code" />
                        <input className="upload-input" type="text" placeholder="Choose a professor" />
                        <button className="submit-upload-button">Upload Note</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
