import { Search, Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const Topbar = ({ title, subtitle, showTime }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const [time, setTime] = useState(new Date());


  useEffect(() => {
    if (showTime) {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showTime]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSettings = () => {
     if (user?.role === "OFFICER") {
    navigate("/dashboard/settings");
  } else if (user?.role === "SHO") {
    navigate("/sho/settings");
  } else if (user?.role === "ADMIN") {
    navigate("/admin/settings");
  }
  };
  const handleNotifications = () => {
  if (user?.role === "OFFICER") {
    navigate("/dashboard/notifications");
  } else if (user?.role === "SHO") {
    navigate("/sho/notifications");
  } else if (user?.role === "ADMIN") {
    navigate("/admin/notifications");
  }
};

  const placeholderStyle = `
    .topbar-search::placeholder {
      color: #ffffff !important;
      opacity: 0.6;
    }
  `;

  return (
    <div
      className="position-fixed top-0 end-0 d-flex justify-content-between align-items-center px-5"
      style={{
        left: "240px",
        height: "72px",
        background: "#020617",
        borderBottom: "1px solid #1e293b",
        zIndex: 1050,
      }}
    >
      <style>{placeholderStyle}</style>

      <div className="py-2">
        <h5 className="mb-1 text-light fw-semibold">
          {title || `Welcome back, ${user?.role}`}
        </h5>
        <small className="text-secondary">
          {showTime ? time.toLocaleString() : subtitle}
        </small>
      </div>

      <div className="d-flex align-items-center gap-4">

       

        <span
          className="badge rounded-pill px-3 py-2 text-uppercase"
          style={{
            background:
              user?.role === "ADMIN"
                ? "rgba(34,197,94,0.15)"
                : user?.role === "SHO"
                ? "rgba(245,158,11,0.15)"
                : "rgba(59,130,246,0.15)",
            color:
              user?.role === "ADMIN"
                ? "#4ade80"
                : user?.role === "SHO"
                ? "#fbbf24"
                : "#60a5fa",
            letterSpacing: "0.5px",
          }}
        >
          {user?.role}
        </span>

        <div
          className="position-relative d-flex align-items-center justify-content-center rounded-3"
          style={{
            width: "42px",
            height: "42px",
            background: "#0f172a",
            cursor: "pointer",
            color: "#94a3b8",
          }} onClick={handleNotifications}
        >
          <Bell size={18} />

          {unreadCount > 0 && (
            <span
              className="position-absolute top-0 end-0 translate-middle bg-danger rounded-circle"
              style={{ width: "8px", height: "8px" }}
            />
          )}
        </div>

        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{
            width: "42px",
            height: "42px",
            background: "#0f172a",
            cursor: "pointer",
            color: "#94a3b8",
          }}
          onClick={handleSettings}
        >
          <Settings size={18} />
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-primary btn-sm px-4 py-2"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Topbar;