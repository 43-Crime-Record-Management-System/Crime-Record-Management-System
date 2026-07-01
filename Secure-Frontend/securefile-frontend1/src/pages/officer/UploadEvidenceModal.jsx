import { useState } from "react";
import axios from "axios";
import { EVIDENCE_API_URL } from "../../config";

const UploadEvidenceModal = ({ caseId, onClose, onUpload }) => {

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleUpload = async () => {

    setMessage("");

    if (!title || !type || !file) {
      setMessageType("error");
      setMessage("Title, Type and File are required.");
      return;
    }

    const formData = new FormData();
    formData.append("caseId", caseId);
    formData.append("title", title);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("file", file);

    try {

      const response = await axios.post(
        `${EVIDENCE_API_URL}/evidence/upload`,
        formData
      );

      onUpload(response.data);

      setMessageType("success");
      setMessage("Evidence Uploaded Successfully");

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error("Upload failed:", error);
      setMessageType("error");
      setMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex
                 align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.6)", zIndex: 5000 }}
    >
      <div
        className="bg-dark border border-secondary rounded-4 p-4"
        style={{ width: 420 }}
      >

        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-light">Upload Evidence</h5>
          <button
            onClick={onClose}
            className="btn btn-sm btn-link text-secondary fs-5 text-decoration-none"
          >
            ✕
          </button>
        </div>

        {/* MESSAGE DISPLAY */}
        {message && (
          <div
            className="mt-3"
            style={{
              color: messageType === "success" ? "#4ade80" : "#f87171",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {message}
          </div>
        )}

        <div className="d-flex flex-column gap-3 mt-3">

          <div>
            <label className="small text-secondary mb-1">Title *</label>
            <input
              className="form-control bg-dark text-light border-secondary rounded-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="small text-secondary mb-1">Type *</label>
            <select
              className="form-select bg-dark text-light border-secondary rounded-3"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option>Document</option>
              <option>Image</option>
              <option>Video</option>
            </select>
          </div>

          <div>
            <label className="small text-secondary mb-1">Description</label>
            <textarea
              rows={3}
              className="form-control bg-dark text-light border-secondary rounded-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <label
            className="border border-secondary border-dashed rounded-3
                       p-3 text-center text-secondary"
            style={{ cursor: "pointer" }}
          >
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file ? file.name : "Click to select file"}
          </label>

        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">

          <button
            onClick={onClose}
            className="btn btn-outline-secondary px-3"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            className="btn btn-primary px-4"
          >
            Upload
          </button>

        </div>
      </div>
    </div>
  );
};

export default UploadEvidenceModal;