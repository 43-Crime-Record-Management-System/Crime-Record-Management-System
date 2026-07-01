import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { FIR_API_URL } from "../../config";

const inputFixStyle = `
.form-control,
.form-select,
textarea {
  background-color: #020617 !important;
  color: #ffffff !important;
  border: 1px solid #1e293b !important;
  border-radius: 10px;
  padding: 10px 14px;
}
.form-control:focus,
.form-select:focus,
textarea:focus {
  border-color: #38bdf8 !important;
  box-shadow: 0 0 0 1px rgba(56,189,248,0.4);
}
.form-control::placeholder,
textarea::placeholder {
  color: rgba(255,255,255,0.55);
}
input[type="file"] {
  display: none;
}
`;

const FIRRegister = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  const [incidentDate, setIncidentDate] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [description, setDescription] = useState("");
  const [ipcSections, setIpcSections] = useState([]);

  const [witnesses, setWitnesses] = useState([
    { name: "", phone: "", statement: "" },
  ]);

  const [suspects, setSuspects] = useState([
    { name: "", alias: "", physical: "", photos: [] },
  ]);

  const handleRegister = async () => {
    setMessage("");

    const token = localStorage.getItem("token");
    const station = localStorage.getItem("station");

    // Required validation
    if (
      !fullName ||
      !contactNumber ||
      !address ||
      !incidentDate ||
      !incidentLocation ||
      !description ||
      ipcSections.length === 0
    ) {
      setMessageType("error");
      setMessage("Please fill all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      setMessageType("error");
      setMessage("Contact number must be exactly 10 digits.");
      return;
    }

    for (let w of witnesses) {
      if (!w.name || !w.phone || !w.statement) {
        setMessageType("error");
        setMessage("Please fill all witness details.");
        return;
      }
      if (!/^\d{10}$/.test(w.phone)) {
        setMessageType("error");
        setMessage("Witness contact number must be exactly 10 digits.");
        return;
      }
    }

    for (let s of suspects) {
      if (!s.name || !s.physical) {
        setMessageType("error");
        setMessage("Please fill all suspect details.");
        return;
      }
    }

    if (!station) {
      setMessageType("error");
      setMessage("Station not found. Please login again.");
      return;
    }

    const firData = {
      fullName,
      contactNumber,
      address,
      incidentDate,
      incidentLocation,
      description,
      ipcSections,
      stationId: station,
      witnesses: witnesses.map((w) => ({
        witnessName: w.name,
        witnessContactNumber: w.phone,
        witnessStatement: w.statement,
      })),
      suspects: suspects.map((s) => ({
        suspectName: s.name,
        physicalDescription: s.physical,
        suspectPhotos: s.photos,
      })),
    };

    try {
      const response = await fetch(`${FIR_API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(firData),
      });

      if (!response.ok) throw new Error("Failed");

      setMessageType("success");
      setMessage("FIR Registered Successfully ✅");

      const officerName = localStorage.getItem("userName") || "An officer";
      addNotification({
        type: "fir",
        title: "New FIR Registered",
        message: `${officerName} registered a new FIR #${fullName}'s case. (ID: ${incidentLocation})`,
        route: "/admin/dashboard", // Or a specific admin route if exists
      });

      setTimeout(() => {
        navigate("/dashboard/fir/success");
      }, 1500);

    } catch (err) {
      console.error("FIR registration error:", err);
      setMessageType("error");
      setMessage("Failed to register FIR. Please try again.");
    }
  };

  const addWitness = () => {
    setWitnesses([...witnesses, { name: "", phone: "", statement: "" }]);
  };

  const updateWitness = (i, field, value) => {
    const updated = [...witnesses];
    updated[i][field] = value;
    setWitnesses(updated);
  };

  const addSuspect = () => {
    setSuspects([
      ...suspects,
      { name: "", alias: "", physical: "", photos: [] },
    ]);
  };

  const updateSuspect = (i, field, value) => {
    const updated = [...suspects];
    updated[i][field] = value;
    setSuspects(updated);
  };

  const handlePhotoUpload = (i, files) => {
    const updated = [...suspects];
    const images = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    updated[i].photos = [...updated[i].photos, ...images];
    setSuspects(updated);
  };

  const removePhoto = (sIndex, pIndex) => {
    const updated = [...suspects];
    updated[sIndex].photos.splice(pIndex, 1);
    setSuspects(updated);
  };

  const sectionStyle = {
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95))",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "26px",
  };

  const titleStyle = {
    color: "#38bdf8",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "14px",
  };

  const uploadBox = {
    border: "1px dashed #334155",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
    color: "#94a3b8",
    cursor: "pointer",
    background: "rgba(2,6,23,0.7)",
  };

  const uploadBtn = {
    marginTop: "8px",
    background: "rgba(56,189,248,0.15)",
    color: "#38bdf8",
    border: "1px solid rgba(56,189,248,0.4)",
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "13px",
  };

  return (
    <div className="text-light">
      <style>{inputFixStyle}</style>

      <div style={sectionStyle}>
        <div style={titleStyle}>Complainant Details</div>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              placeholder="Full Name"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              placeholder="Contact Number"
              className="form-control"
              value={contactNumber}
              minLength={10}
              maxLength={10}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              placeholder="Address"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={titleStyle}>Incident Details</div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <input
              type="datetime-local"
              className="form-control"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <input
              placeholder="Incident Location"
              className="form-control"
              value={incidentLocation}
              onChange={(e) => setIncidentLocation(e.target.value)}
            />
          </div>
        </div>

        <textarea
          rows="4"
          placeholder="Provide detailed description of the incident..."
          className="form-control mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="form-select"
          onChange={(e) =>
            setIpcSections([...ipcSections, e.target.value])
          }
        >
          <option value="">Select applicable IPC sections</option>
          <option value="379">IPC 379 - Theft</option>
          <option value="392">IPC 392 - Robbery</option>
          <option value="420">IPC 420 - Cheating</option>
        </select>
      </div>

      <div style={sectionStyle}>
        <div className="d-flex justify-content-between mb-3">
          <div style={titleStyle}>Witness Details</div>
          <button
            onClick={addWitness}
            className="btn btn-sm btn-outline-info"
          >
            + Add Witness
          </button>
        </div>

        {witnesses.map((w, i) => (
          <div key={i} className="mb-3">
            <input
              className="form-control mb-2"
              placeholder="Witness Name"
              value={w.name}
              onChange={(e) =>
                updateWitness(i, "name", e.target.value)
              }
            />
            <input
              className="form-control mb-2"
              placeholder="Witness Contact Number"
              value={w.phone}
              minLength={10}
              maxLength={10}
              onChange={(e) =>
                updateWitness(i, "phone", e.target.value)
              }
            />
            <textarea
              className="form-control"
              placeholder="Witness statement..."
              value={w.statement}
              onChange={(e) =>
                updateWitness(i, "statement", e.target.value)
              }
            />
          </div>
        ))}
      </div>
      <div style={sectionStyle}>
        <div className="d-flex justify-content-between mb-3">
          <div style={titleStyle}>Suspect Details</div>
          <button
            onClick={addSuspect}
            className="btn btn-sm btn-outline-info"
          >
            + Add Suspect
          </button>
        </div>

        {suspects.map((s, i) => {
          const fileId = `suspect-photo-${i}`;

          return (
            <div key={i} className="mb-4">
              <input
                className="form-control mb-2"
                placeholder="Suspect Name"
                value={s.name}
                onChange={(e) =>
                  updateSuspect(i, "name", e.target.value)
                }
              />

              <textarea
                className="form-control mb-3"
                placeholder="Physical description / identification marks..."
                value={s.physical}
                onChange={(e) =>
                  updateSuspect(i, "physical", e.target.value)
                }
              />

              <label htmlFor={fileId} style={uploadBox}>
                Upload suspect photos
                <div style={uploadBtn}>Select Images</div>
              </label>

              <input
                id={fileId}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  handlePhotoUpload(i, e.target.files)
                }
              />

              {s.photos.length > 0 && (
                <div className="d-flex gap-3 flex-wrap mt-3">
                  {s.photos.map((img, p) => (
                    <div key={p} style={{ position: "relative" }}>
                      <img
                        src={img}
                        alt="suspect"
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "1px solid #1e293b",
                        }}
                      />
                      <button
                        onClick={() => removePhoto(i, p)}
                        style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          fontSize: "12px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {message && (
        <div
          className="text-end mb-3"
          style={{
            color: messageType === "success" ? "#4ade80" : "#f87171",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {message}
        </div>
      )}

      <div className="text-end">
        <button
          type="button"
          onClick={handleRegister}
          className="btn btn-info px-5 py-2 fw-semibold"
        >
          Register FIR
        </button>
      </div>
    </div>
  );
};

export default FIRRegister;