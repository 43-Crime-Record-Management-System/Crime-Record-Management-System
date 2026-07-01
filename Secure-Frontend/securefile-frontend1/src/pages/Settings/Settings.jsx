import { useState, useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { AUTH_API_URL } from "../../config";

const cardStyle = {
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 25px rgba(0,0,0,0.6)",
};

const inputStyle = {
  background: "#1e293b",
  color: "#ffffff",
  border: "1px solid #334155",
  borderRadius: "10px",
  height: 46,
};

const toggleCSS = `
.ios-switch { position: relative; width: 48px; height: 26px; }
.ios-switch input { opacity: 0; width: 0; height: 0; }
.ios-slider { position: absolute; inset: 0; background-color: #1f2937; border-radius: 999px; transition: 0.3s; }
.ios-slider:before { content: ""; position: absolute; height: 20px; width: 20px; left: 3px; top: 3px; background-color: white; border-radius: 50%; transition: 0.3s; }
.ios-switch input:checked + .ios-slider { background-color: #38bdf8; }
.ios-switch input:checked + .ios-slider:before { transform: translateX(22px); }
`;

import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { updateUser } = useAuth();
  const { showAlert } = useNotifications();
  const token = localStorage.getItem("token");

  const [fullName, setFullName] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [station, setStation] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailAlerts, setEmailAlerts] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(false);


  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();

        setFullName(data.fullName || "");
        setBadgeNumber(data.badgeNumber || "");
        setStation(data.station || "");
        setEmailAlerts(data.emailAlerts || false);
        setSmsAlerts(data.smsAlerts || false);

        // Sync with global auth state
        updateUser({
          fullName: data.fullName,
          station: data.station,
          badgeNumber: data.badgeNumber,
          userId: data.userId || data.id // Ensure ID is saved
        });

      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    if (token) fetchProfile();

  }, [token]);


  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${AUTH_API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          badgeNumber,
          station,
        }),
      });

      if (!res.ok) throw new Error("Profile update failed");

      // Update global auth state
      updateUser({ fullName, station });

      showAlert("Your profile information has been updated successfully.", "Profile Updated", "success");

    } catch (err) {
      console.error("Profile update error:", err);
      showAlert("Could not update profile. Please try again.", "Error", "error");
    }
  };


  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      showAlert("New password and confirmation password do not match.", "Mismatch", "error");
      return;
    }

    try {
      const res = await fetch(`${AUTH_API_URL}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMsg = errorData?.message || "Password update failed";
        throw new Error(errorMsg);
      }

      showAlert("Your password has been changed successfully.", "Security Updated", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.error("Password update error:", err);
      showAlert(err.message || "Failed to update password. Please check your current password and try again.", "Error", "error");
    }
  };


  useEffect(() => {

    const savePreferences = async () => {
      try {
        await fetch(`${AUTH_API_URL}/notification-settings`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            emailAlerts,
            smsAlerts,
          }),
        });
      } catch (err) {
        console.error("Preference save error:", err);
      }
    };

    if (token) savePreferences();

  }, [emailAlerts, smsAlerts, token]);

  return (
    <div className="text-light w-100 mt-4 px-3">
      <style>{toggleCSS}</style>

      <div style={cardStyle} className="p-4 mb-4">
        <h5 className="mb-1">👤 Profile Settings</h5>
        <p className="text-secondary small mb-4">
          Update your personal information
        </p>

        <div className="row g-4 mb-3">

          <div className="col-md-6">
            <label className="small mb-1">Full Name</label>
            <input style={inputStyle} className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="small mb-1">Badge Number</label>
            <input style={inputStyle} className="form-control"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="small mb-1">Station</label>
            <input style={inputStyle} className="form-control"
              value={station}
              onChange={(e) => setStation(e.target.value)} />
          </div>

        </div>

        <button
          className="btn px-4"
          style={{ background: "#38bdf8", color: "#020617", fontWeight: 600 }}
          onClick={handleSaveProfile}
        >
          Save Changes
        </button>
      </div>

      <div style={cardStyle} className="p-4 mb-4">
        <h5 className="mb-1">🔒 Security</h5>
        <p className="text-secondary small mb-4">
          Change your password
        </p>

        <div className="row g-4 mb-3">
          <div className="col-md-4">
            <label className="small mb-1">Current Password</label>
            <input type="password" style={inputStyle}
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>

          <div className="col-md-4">
            <label className="small mb-1">New Password</label>
            <input type="password" style={inputStyle}
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} />
          </div>

          <div className="col-md-4">
            <label className="small mb-1">Confirm Password</label>
            <input type="password" style={inputStyle}
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>

        <button
          className="btn px-4"
          style={{ background: "#38bdf8", color: "#020617", fontWeight: 600 }}
          onClick={handlePasswordUpdate}
        >
          Update Password
        </button>
      </div>


    </div>
  );
};

export default Settings;
