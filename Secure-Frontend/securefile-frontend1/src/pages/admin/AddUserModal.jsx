import { useState } from "react";
import axios from "axios";
import { USER_API_URL } from "../../config";

const modalStyle = {
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,1))",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  width: "500px",
  padding: "30px",
};

const inputStyle = {
  background: "#020617",
  border: "1px solid #1e293b",
  color: "#fff",
  borderRadius: "10px",
  height: "45px",
};

const AddUserModal = ({ onClose, onUserAdded }) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("OFFICER");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error

  const handleSubmit = async () => {

    setMessage("");

    if (!name || !email || !password) {
      setMessageType("error");
      setMessage("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessageType("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const res = await axios.post(
        `${USER_API_URL}/register`,
        {
          name,
          email,
          password,
          role,
        }
      );

      setMessageType("success");
      setMessage("User created successfully ✅");

      if (onUserAdded) {
        onUserAdded(res.data);
      }

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Failed to create user. Try again.");
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.7)", zIndex: 9999 }}
    >
      <div style={modalStyle} className="text-light">

        <div className="d-flex justify-content-between mb-3">
          <h5>Create New User</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="mb-3">
          <label className="small text-secondary">Full Name</label>
          <input
            className="form-control"
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="small text-secondary">Email</label>
          <input
            className="form-control"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="small text-secondary">Password</label>
          <input
            type="password"
            className="form-control"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="small text-secondary">Role</label>
          <select
            className="form-select"
            style={inputStyle}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="OFFICER">Officer</option>
            <option value="SHO">SHO</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* 🔥 INLINE MESSAGE */}
        {message && (
          <div
            className="mb-3 text-end"
            style={{
              color: messageType === "success" ? "#4ade80" : "#f87171",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {message}
          </div>
        )}

        <div className="d-flex justify-content-end gap-3">
          <button
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn btn-info"
            onClick={handleSubmit}
          >
            Create User
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddUserModal;