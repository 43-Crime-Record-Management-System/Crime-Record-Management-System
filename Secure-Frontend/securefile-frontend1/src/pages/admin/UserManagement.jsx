import React, { useEffect, useState, useCallback } from "react";
import { USER_API_URL } from "../../config";

/* ================= MAIN COMPONENT ================= */

const UserManagement = () => {

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const token = localStorage.getItem("token");

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 2500);
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${USER_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      showMessage("Failed to fetch users");
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  /* ================= TOGGLE ================= */

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(
        `${USER_API_URL}/toggle-status/${id}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error();

      fetchUsers();
      showMessage("User status updated ✅", "success");

    } catch {
      showMessage("Status update failed");
    }
  };

  /* ================= DELETE ================= */

  const deleteUser = async (id) => {
    try {
      const res = await fetch(
        `${USER_API_URL}/users/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        const errorText = await res.text();
        showMessage(errorText);
        return;
      }

      fetchUsers();
      showMessage("User deleted successfully ✅", "success");

    } catch {
      showMessage("Delete failed");
    }
  };

  /* ================= ADD USER ================= */

  const handleAddUser = async (newUser) => {
    try {
      const res = await fetch(
        `${USER_API_URL}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        showMessage(errorText);
        return;
      }

      setShowModal(false);
      await fetchUsers();
      showMessage("User created successfully ✅", "success");

    } catch {
      showMessage("Failed to create user");
    }
  };

  return (
    <div style={pageStyle}>

      {/* MESSAGE */}
      {message && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          padding: "10px 16px",
          borderRadius: "8px",
          background: messageType === "success"
            ? "rgba(34,197,94,.15)"
            : "rgba(239,68,68,.15)",
          color: messageType === "success" ? "#22c55e" : "#ef4444",
          border: messageType === "success"
            ? "1px solid rgba(34,197,94,.4)"
            : "1px solid rgba(239,68,68,.4)",
          fontWeight: 600,
          zIndex: 9999
        }}>
          {message}
        </div>
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>User Management</h3>
          <p style={{ color: "#94a3b8" }}>
            Manage system users and access control
          </p>
        </div>

        <button style={primaryBtn} onClick={() => setShowModal(true)}>
          + Add User
        </button>
      </div>

      {/* TABLE */}
      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={rowStyle}>
                <td style={tdStyle}>{u.fullName}</td>
                <td style={{ ...tdStyle, color: "#94a3b8" }}>{u.email}</td>

                <td style={tdStyle}>
                  <span style={{ ...badgeBase, ...roleStyle(u.role) }}>
                    {u.role}
                  </span>
                </td>

                <td style={tdStyle}>
                  {u.status === "ACTIVE"
                    ? <span style={activeBadge}>Active</span>
                    : <span style={blockedBadge}>Blocked</span>}
                </td>

                <td style={{ ...tdStyle, display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => toggleStatus(u.id)}
                    style={u.status === "ACTIVE" ? dangerBtn : successBtn}
                  >
                    {u.status === "ACTIVE" ? "Disable" : "Enable"}
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div style={{ textAlign: "center", padding: "30px" }}>
            No users found
          </div>
        )}
      </div>

      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddUser}
        />
      )}
    </div>
  );
};

/* ================= ADD USER MODAL ================= */

const AddUserModal = ({ onClose, onAdd }) => {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OFFICER");
  const [error, setError] = useState("");

  const handleSubmit = () => {

    if (!fullName || !email || !password) {
      setError("All fields are required");
      return;
    }

    setError("");
    onAdd({ fullName, email, password, role });
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        <div className="d-flex justify-content-between mb-3">
          <h4>Create New User</h4>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <input style={inputStyle} placeholder="Full Name"
          value={fullName} onChange={(e) => setFullName(e.target.value)} />

        <input style={inputStyle} placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="password" style={inputStyle} placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <select style={inputStyle}
          value={role}
          onChange={(e) => setRole(e.target.value)}>
          <option value="OFFICER">Officer</option>
          <option value="SHO">SHO</option>
        </select>

        {error && (
          <div style={{ color: "#ef4444", marginBottom: "10px" }}>
            {error}
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button style={secondaryBtn} onClick={onClose}>Cancel</button>
          <button style={primaryBtn} onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES (UNCHANGED) ================= */

const pageStyle = {
  minHeight: "100vh",
  padding: "30px",
  background: "radial-gradient(160% 120% at 50% 0%, #0b1220 0%, #020617 65%, #020617 100%)",
  color: "#e5e7eb",
};

const cardStyle = {
  background: "linear-gradient(145deg, #0b1220, #020617)",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "20px",
};

const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = {
  padding: "16px 20px",
  textAlign: "left",
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#38bdf8",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};
const tdStyle = { padding: "18px 20px" };
const rowStyle = { borderBottom: "1px solid rgba(255,255,255,0.05)" };

const badgeBase = {
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
};

const activeBadge = {
  ...badgeBase,
  color: "#22c55e",
  background: "rgba(34,197,94,0.15)",
  border: "1px solid rgba(34,197,94,0.4)",
};

const blockedBadge = {
  ...badgeBase,
  color: "#ef4444",
  background: "rgba(239,68,68,0.15)",
  border: "1px solid rgba(239,68,68,0.4)",
};

const primaryBtn = {
  background: "#38bdf8",
  border: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: "600",
  color: "#020617",
  cursor: "pointer",
};

const secondaryBtn = {
  background: "transparent",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "8px 16px",
  color: "#94a3b8",
  cursor: "pointer",
};

const dangerBtn = {
  background: "#ef4444",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  color: "#020617",
};

const successBtn = {
  background: "#22c55e",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  color: "#020617",
};

const deleteBtn = {
  background: "#7f1d1d",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  color: "#fff",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.85)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalStyle = {
  width: "400px",
  background: "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(2,6,23,1))",
  borderRadius: "16px",
  padding: "25px",
};

const inputStyle = {
  width: "100%",
  marginBottom: "12px",
  padding: "10px",
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  color: "#fff",
};

const closeBtn = {
  background: "transparent",
  border: "none",
  color: "#94a3b8",
};

const roleStyle = (role) => {
  if (role === "ADMIN")
    return { color: "#38bdf8", background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.4)" };
  if (role === "OFFICER")
    return { color: "#facc15", background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.4)" };
  return { color: "#a78bfa", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.4)" };
};

export default UserManagement;