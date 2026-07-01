import { useState } from "react";
import "../../styles/AddCaseEntryModal.css";

const ScheduleCourtHearingModal = ({ onClose, onAdd }) => {
  const [date, setDate] = useState("");
  const [court, setCourt] = useState("");
  const [purpose, setPurpose] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = () => {
    setMessage("");

    if (!date || !court || !purpose) {
      setMessageType("error");
      setMessage("Please fill all fields.");
      return;
    }

    const newHearing = {
      id: Date.now(),
      date,
      court,
      purpose,
    };

    onAdd(newHearing);

    setMessageType("success");
    setMessage("Hearing Scheduled Successfully");

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h3>Schedule Court Hearing</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* MESSAGE DISPLAY */}
        {message && (
          <div
            style={{
              color: messageType === "success" ? "#4ade80" : "#f87171",
              fontSize: "14px",
              fontWeight: 500,
              margin: "10px 0",
            }}
          >
            {message}
          </div>
        )}

        <div className="modal-body">
          <label>Hearing Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Court *</label>
          <input
            placeholder="Enter court name"
            value={court}
            onChange={(e) => setCourt(e.target.value)}
          />

          <label>Purpose *</label>
          <textarea
            placeholder="Enter hearing purpose..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="add-btn" onClick={handleSubmit}>
            Schedule
          </button>
        </div>

      </div>
    </div>
  );
};

export default ScheduleCourtHearingModal;