import { useState } from "react";
import { CRIMINAL_API_URL } from "../../config";

const CRIME_TYPES = [
  "Armed Robbery",
  "Assault",
  "Cybercrime",
  "Fraud",
  "Murder",
  "Extortion",
  "Theft",
  "Kidnapping",
];

const inputStyle = {
  background: "#020617",
  border: "1px solid #1e293b",
  color: "#fff",
  height: "46px",
  borderRadius: "10px",
};

const selectStyle = {
  ...inputStyle,
};

const textareaStyle = {
  background: "#020617",
  border: "1px solid #1e293b",
  color: "#fff",
  borderRadius: "10px",
};

const modalCardStyle = {
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(2,6,23,0.98))",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.08)",
};

const imageBox = {
  width: "100%",
  height: 140,
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const AddCriminalModal = ({ onClose, onAddCriminal }) => {

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [status, setStatus] = useState("WANTED");
  const [physical, setPhysical] = useState("");
  const [selectedCrimes, setSelectedCrimes] = useState([]);
  const [mugshot, setMugshot] = useState("");
  const [fingerprint, setFingerprint] = useState("");

  const toggleCrime = (crime) => {
    setSelectedCrimes((prev) =>
      prev.includes(crime)
        ? prev.filter((c) => c !== crime)
        : [...prev, crime]
    );
  };

  const handleImage = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {

    setMessage("");

    // Required validation
    if (
      !name ||
      !alias ||
      !gender ||
      !dob ||
      !status ||
      !physical ||
      !mugshot ||
      !fingerprint ||
      selectedCrimes.length === 0
    ) {
      setMessageType("error");
      setMessage("Please fill all required fields.");
      return;
    }

    const criminalData = {
      fullName: name,
      aliases: alias.split(",").map(a => a.trim()),
      gender: gender,
      dateOfBirth: dob,
      status: status,
      mugshot: mugshot,
      fingerprint: fingerprint,
      physicalDescription: physical,
      crimeTypes: selectedCrimes,
    };

    try {
      const response = await fetch(`${CRIMINAL_API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(criminalData),
      });

      if (!response.ok) {
        throw new Error("Failed to add criminal");
      }

      const savedData = await response.json();

      if (onAddCriminal) {
        onAddCriminal(savedData);
      }

      setMessageType("success");
      setMessage("Criminal Added Successfully");

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (error) {
      console.error("Error:", error);
      setMessageType("error");
      setMessage("Error adding criminal");
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(2,6,23,0.8)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content text-light p-2" style={modalCardStyle}>

{/* HEADER */}
<div className="d-flex justify-content-between align-items-start px-4 pt-4 pb-3 border-bottom border-secondary">
  <div>
    <h5 className="mb-1">Add New Criminal</h5>
    <small className="text-secondary">
      Enter the details of the criminal to add to the database.
    </small>
  </div>
  <button className="btn-close btn-close-white" onClick={onClose} />
</div>

{/* BODY */}
<div className="px-4 py-4">

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

<div className="row g-3 mb-4">

<div className="col-md-6">
<label className="small text-secondary mb-1">Full Name *</label>
<input
placeholder="Enter full name"
className="form-control"
style={inputStyle}
value={name}
onChange={(e) => setName(e.target.value)}
/>
</div>

<div className="col-md-6">
<label className="small text-secondary mb-1">
Alias (comma separated) *
</label>
<input
placeholder="e.g. The Wolf, Johnny"
className="form-control"
style={inputStyle}
value={alias}
onChange={(e) => setAlias(e.target.value)}
/>
</div>

</div>

<div className="row g-3 mb-4">

<div className="col-md-4">
<label className="small text-secondary mb-1">Gender *</label>
<select
className="form-select"
style={selectStyle}
value={gender}
onChange={(e) => setGender(e.target.value)}
>
<option>Male</option>
<option>Female</option>
<option>Other</option>
</select>
</div>

<div className="col-md-4">
<label className="small text-secondary mb-1">Date of Birth *</label>
<input
type="date"
className="form-control"
style={inputStyle}
value={dob}
onChange={(e) => setDob(e.target.value)}
/>
</div>

<div className="col-md-4">
<label className="small text-secondary mb-1">Status *</label>
<select
className="form-select"
style={selectStyle}
value={status}
onChange={(e) => setStatus(e.target.value)}
>
<option>WANTED</option>
<option>ARRESTED</option>
<option>CONVICTED</option>
</select>
</div>

</div>

<div className="row g-3 mb-4">

<div className="col-md-6">
<label className="small text-secondary mb-1">Mugshot *</label>
<div style={imageBox}>
{mugshot ? (
<img src={mugshot} className="img-fluid" alt="" />
) : (
<span className="text-secondary small">No Image</span>
)}
</div>
<label className="btn btn-sm btn-outline-info w-100 mt-2">
Upload Mugshot
<input
type="file"
accept="image/*"
hidden
onChange={(e) => handleImage(e, setMugshot)}
/>
</label>
</div>

<div className="col-md-6">
<label className="small text-secondary mb-1">Fingerprint *</label>
<div style={imageBox}>
{fingerprint ? (
<img src={fingerprint} className="img-fluid" style={{ filter: "grayscale(1)" }} alt="" />
) : (
<span className="text-secondary small">No Image</span>
)}
</div>
<label className="btn btn-sm btn-outline-info w-100 mt-2">
Upload Fingerprint
<input
type="file"
accept="image/*"
hidden
onChange={(e) => handleImage(e, setFingerprint)}
/>
</label>
</div>

</div>

<div className="mb-4">
<label className="small text-secondary mb-1">
Physical Description *
</label>
<textarea
rows="4"
placeholder="Height, weight, distinguishing marks, etc."
className="form-control"
style={textareaStyle}
value={physical}
onChange={(e) => setPhysical(e.target.value)}
/>
</div>

<div>
<label className="small text-secondary mb-2">
Crime Types *
</label>
<div className="d-flex flex-wrap gap-2">
{CRIME_TYPES.map((crime) => {
const active = selectedCrimes.includes(crime);
return (
<button
key={crime}
type="button"
className="btn btn-sm px-3 rounded-pill"
onClick={() => toggleCrime(crime)}
style={
active
? { background: "#2563eb", color: "#fff", border: "none" }
: { background: "#0f172a", color: "#cbd5f5", border: "1px solid #1e293b" }
}
>
{crime}
</button>
);
})}
</div>
</div>

</div>

<div className="d-flex justify-content-end gap-3 px-4 pb-4 pt-3">
<button
className="btn btn-outline-secondary px-4"
onClick={onClose}
>
Cancel
</button>

<button
className="btn px-4"
style={{ background: "#2563eb", color: "white", fontWeight: 600 }}
onClick={handleAdd}
>
+ Add Criminal
</button>
</div>

        </div>
      </div>
    </div>
  );
};

export default AddCriminalModal;