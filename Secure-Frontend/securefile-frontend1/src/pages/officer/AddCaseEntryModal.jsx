import { useState } from "react";

const AddCaseEntryModal = ({ onClose, onAdd }) => {
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = () => {
    setMessage("");

    if (!date || !type) {
      setMessageType("error");
      setMessage("Date and Entry Type are required.");
      return;
    }

    onAdd({ date, type, description });

    setMessageType("success");
    setMessage("Entry Added Successfully");

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const cardStyle = {
    background:
      "linear-gradient(180deg, rgba(17,25,40,0.96), rgba(2,6,23,0.98))",
    borderRadius: "22px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow:
      "0 25px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
    maxWidth: "560px",
    width: "100%",
  };

  const inputStyle = {
    background: "#020617",
    border: "1px solid #1e293b",
    color: "#ffffff",
    borderRadius: "12px",
    height: "46px",
  };

  const textareaStyle = {
    background: "#020617",
    border: "1px solid #1e293b",
    color: "#ffffff",
    borderRadius: "12px",
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(2,6,23,0.85)", zIndex: 2000 }}
    >
      <div style={cardStyle} className="p-4 text-light">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1">Add Case Diary Entry</h5>
            <small className="text-secondary">
              Record investigation progress
            </small>
          </div>

          <button
            className="btn btn-sm btn-outline-secondary rounded-circle"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <hr className="border-secondary mb-4" />

        {/* MESSAGE DISPLAY */}
        {message && (
          <div
            className="mb-3"
            style={{
              color: messageType === "success" ? "#4ade80" : "#f87171",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {message}
          </div>
        )}

        {/* DATE */}
        <div className="mb-3">
          <label className="small text-secondary mb-1">
            Date *
          </label>
          <input
            type="date"
            className="form-control"
            style={inputStyle}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* TYPE */}
        <div className="mb-3">
          <label className="small text-secondary mb-1">
            Entry Type *
          </label>
          <select
            className="form-select"
            style={inputStyle}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Entry Type</option>
            <option>Investigation</option>
            <option>Witness Statement</option>
            <option>Evidence Collected</option>
            <option>Court Update</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="small text-secondary mb-1">
            Description
          </label>
          <textarea
            rows="4"
            className="form-control"
            style={textareaStyle}
            placeholder="Enter details of this diary entry..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* ACTIONS */}
        <div className="d-flex justify-content-end gap-3">

          <button
            className="btn btn-outline-secondary px-4"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn px-4"
            style={{
              background: "#38bdf8",
              color: "#020617",
              fontWeight: 600,
            }}
            onClick={handleSubmit}
          >
            Add Entry
          </button>

        </div>

      </div>
    </div>
  );
};

export default AddCaseEntryModal;