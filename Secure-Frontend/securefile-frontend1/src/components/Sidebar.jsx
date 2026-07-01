import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpeg";
import { FIR_API_URL } from "../config";
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Settings,
  User
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role;
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem("sidebar_stats");
      return cached ? JSON.parse(cached) : { active: 0, closed: 0, pending: 0 };
    } catch { return { active: 0, closed: 0, pending: 0 }; }
  });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const officerId = localStorage.getItem("officerId") || user?.userId;

        // Use filtered endpoint for officers to bypass field naming inconsistencies
        const endpoint = (role === "OFFICER" && officerId)
          ? `${FIR_API_URL}/officer/${officerId}`
          : `${FIR_API_URL}/all`;

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const firs = await res.json();
          if (Array.isArray(firs)) {
            let newStats = { active: 0, closed: 0, pending: 0 };

            if (role === "OFFICER") {
              // Endpoint is already filtered; just count the statuses
              newStats = {
                active: firs.filter(f => f.status === "ASSIGNED" || f.status === "IN_PROGRESS").length,
                closed: firs.filter(f => f.status === "CLOSED").length,
                pending: 0
              };
            } else if (role === "SHO") {
              newStats = {
                active: firs.filter(f => f.status === "ASSIGNED" || f.status === "IN_PROGRESS").length,
                closed: firs.filter(f => f.status === "CLOSED").length,
                pending: firs.filter(f => f.status === "PENDING" || f.status === "REGISTERED").length
              };
            }

            setStats(newStats);
            localStorage.setItem("sidebar_stats", JSON.stringify(newStats));
          }
        }
      } catch (err) {
        console.error("Sidebar stats fetch error:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [user, role]);

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

        {/* 🔹 TOP SECTION */}
        <div>
          {/* Logo */}
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
                }}
              />
            </div>

            <div>
              <h6 className="mb-0 text-white fw-semibold">SecureFile</h6>
              <small style={{ color: "#94a3b8" }}>Crime Records</small>
            </div>
          </div>

          {/* Navigation */}
          <nav className="d-flex flex-column">

            {role === "OFFICER" && (
              <>
                <Link to="/dashboard" style={linkStyle(isActive("/dashboard", true))}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>

                <Link to="/dashboard/fir" style={linkStyle(isActive("/dashboard/fir"))}>
                  <FileText size={18} /> FIR Portal
                </Link>

                <Link to="/dashboard/criminals" style={linkStyle(isActive("/dashboard/criminals"))}>
                  <Users size={18} /> Criminal Database
                </Link>

                <Link to="/dashboard/cases" style={linkStyle(isActive("/dashboard/cases"))}>
                  <Briefcase size={18} /> Case Investigation
                </Link>

                <Link to="/dashboard/settings" style={linkStyle(isActive("/dashboard/settings"))}>
                  <Settings size={18} /> Settings
                </Link>
              </>
            )}

            {role === "SHO" && (
              <>
                <Link to="/sho" style={linkStyle(isActive("/sho", true))}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>

                <Link to="/sho/fir-approvals" style={linkStyle(isActive("/sho/fir-approvals"))}>
                  <FileText size={18} /> FIR Approvals
                </Link>

                <Link to="/sho/case-assignment" style={linkStyle(isActive("/sho/case-assignment"))}>
                  <Briefcase size={18} /> Case Assignment
                </Link>

                <Link to="/sho/performance" style={linkStyle(isActive("/sho/performance"))}>
                  <Users size={18} /> Officer Performance
                </Link>

                <Link to="/sho/case-monitoring" style={linkStyle(isActive("/sho/case-monitoring"))}>
                  <Users size={18} /> Case Monitoring
                </Link>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <Link to="/admin/dashboard" style={linkStyle(isActive("/admin/dashboard", true))}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>

                <Link to="/admin/users" style={linkStyle(isActive("/admin/users"))}>
                  <Users size={18} /> User Management
                </Link>

                <Link to="/admin/audit" style={linkStyle(isActive("/admin/audit"))}>
                  <Briefcase size={18} /> System Audit
                </Link>

                <Link to="/admin/settings" style={linkStyle(isActive("/admin/settings"))}>
                  <Settings size={18} /> Settings
                </Link>
              </>
            )}
          </nav>

          {/* 🔹 WORKLOAD SECTION */}
          {(role === "OFFICER" || role === "SHO") && (
            <div className="mt-4 pt-4 border-top border-secondary" style={{ borderColor: "rgba(255,255,255,0.08) !important" }}>
              <h6 className="px-3 mb-3 text-secondary small fw-bold text-uppercase" style={{ letterSpacing: "1px", fontSize: "10px" }}>
                My Workload
              </h6>

              <div className="d-flex flex-column gap-2 px-1">
                {role === "SHO" && (
                  <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f59e0b" }}></div>
                      <span style={{ fontSize: "12px", color: "#cbd5f5" }}>Pending</span>
                    </div>
                    <span className="fw-bold" style={{ fontSize: "12px", color: "#f59e0b" }}>{stats.pending}</span>
                  </div>
                )}

                <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ background: "rgba(59, 130, 246, 0.1)" }}>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6" }}></div>
                    <span style={{ fontSize: "12px", color: "#cbd5f5" }}>Ongoing</span>
                  </div>
                  <span className="fw-bold" style={{ fontSize: "12px", color: "#3b82f6" }}>{stats.active}</span>
                </div>

                <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ background: "rgba(34, 197, 94, 0.1)" }}>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }}></div>
                    <span style={{ fontSize: "12px", color: "#cbd5f5" }}>Completed</span>
                  </div>
                  <span className="fw-bold" style={{ fontSize: "12px", color: "#22c55e" }}>{stats.closed}</span>
                </div>
              </div>
            </div>
          )}
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
                    <span style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Badge / Officer ID</span>
                    <span className="text-white small">#{user?.badgeNumber || user?.userId || "N/A"}</span>
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
                {user?.fullName || "User"}
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

export default Sidebar;