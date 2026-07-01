import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.jpeg";
import { USER_API_URL, FIR_API_URL } from "../../config";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Shield,
  User
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [stats, setStats] = useState({ active: 0, personnel: 0 });
  const role = user?.role || "ADMIN";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch Users count
        const usersRes = await fetch(`${USER_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const users = await usersRes.json();

        // Fetch FIRs for active count
        const firsRes = await fetch(`${FIR_API_URL}/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const firs = await firsRes.json();

        if (Array.isArray(users) && Array.isArray(firs)) {
          setStats({
            personnel: users.length,
            active: firs.filter(f => f.status === "ASSIGNED" || f.status === "IN_PROGRESS").length
          });
        }
      } catch (err) {
        console.error("Admin Sidebar stats error:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const linkStyle = (active) => ({
    textDecoration: "none",
    color: active ? "#38bdf8" : "#cbd5f5",
    padding: "12px 16px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: active ? "rgba(56, 189, 248, 0.15)" : "transparent",
    marginBottom: "8px",
    transition: "0.2s",
  });

  return (
    <aside
      className="d-flex flex-column justify-content-between position-fixed top-0 start-0"
      style={{
        width: "240px",
        height: "100vh",
        background: "linear-gradient(180deg,#020617,#020617)",
        padding: "24px 18px",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        zIndex: 1000,
      }}
    >

      <div>
        <div
          className="d-flex align-items-center mb-4 pb-3"
          style={{
            gap: "14px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={logo}
              alt="SecureFile Logo"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
                borderRadius: "14px",
                border: "2px solid #38bdf8",
                background: "transparent"
              }}
            />
          </div>

          <div>
            <h6 className="mb-0 text-white fw-semibold">SecureFile</h6>
            <small style={{ color: "#94a3b8" }}>Admin HQ</small>
          </div>
        </div>

        <nav className="d-flex flex-column">
          <Link
            to="/admin/dashboard"
            style={linkStyle(isActive("/admin/dashboard", true))}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            style={linkStyle(isActive("/admin/users"))}
          >
            <Users size={18} />
            User Management
          </Link>

          <Link
            to="/admin/audit"
            style={linkStyle(isActive("/admin/audit"))}
          >
            <ClipboardList size={18} />
            System Audit
          </Link>

          <Link
            to="/admin/personnel"
            style={linkStyle(isActive("/admin/personnel"))}
          >
            <Shield size={18} />
            Force Overview
          </Link>
        </nav>

      </div>

      {/* 🔹 PROFILE SECTION (BOTTOM) */}
      <div className="position-relative">
        {/* Profile Popup */}
        {showProfilePopup && (
          <div
            className="position-absolute bottom-100 start-0 mb-2 w-100"
            style={{
              background: "rgba(15, 23, 42, 0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
              zIndex: 1001,
            }}
          >
            <div className="d-flex flex-column gap-3">
              <div className="pb-2 border-bottom border-secondary" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <h6 className="mb-0 text-white fw-bold">Profile Details</h6>
                <p className="text-secondary small mb-0">System Information</p>
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex flex-column">
                  <span style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</span>
                  <span className="text-white small fw-medium">{user?.fullName || "Not Specified"}</span>
                </div>
                <div className="d-flex flex-column">
                  <span style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Role</span>
                  <span className="text-primary small fw-medium">{role}</span>
                </div>
                <div className="d-flex flex-column">
                  <span style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Station ID</span>
                  <span className="text-white small">{user?.station || "N/A"}</span>
                </div>
                <div className="d-flex flex-column">
                  <span style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>User ID</span>
                  <span className="text-white small">#{user?.userId || user?.id || "N/A"}</span>
                </div>
              </div>

              <button
                onClick={() => setShowProfilePopup(false)}
                className="btn btn-sm w-100 mt-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#94a3b8",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px"
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div
          className="d-flex align-items-center gap-3 p-3"
          onClick={() => setShowProfilePopup(!showProfilePopup)}
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: showProfilePopup ? "rgba(56, 189, 248, 0.1)" : "rgba(255,255,255,0.02)",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "0.2s"
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "38px",
              height: "38px",
              background: "rgba(56, 189, 248, 0.15)",
              color: "#38bdf8",
            }}
          >
            <User size={18} />
          </div>

          <div style={{ lineHeight: "1.2", overflow: "hidden" }}>
            <div className="fw-semibold text-white small text-truncate" style={{ maxWidth: "135px" }}>
              {user?.fullName || "Admin"}
            </div>
            <div className="text-truncate" style={{ color: "#94a3b8", fontSize: "11px", maxWidth: "135px", marginBottom: "2px" }} title={user?.email}>
              {user?.email || ""}
            </div>
            <div style={{ color: "#38bdf8", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
