import {
  Bell,
  FileText,
  AlertTriangle,
  CheckCircle,
  Gavel
} from "lucide-react";
import { useState, useEffect } from "react";
import { NOTIFICATION_API_URL } from "../../config";

const iconMap = {
  case: <FileText size={20} />,
  fir: <Bell size={20} />,
  urgent: <AlertTriangle size={20} />,
  closed: <CheckCircle size={20} />,
  court: <Gavel size={20} />,
};

const Notifications = () => {

  const [notifications, setNotifications] = useState([]);

  const userId = localStorage.getItem("userId");

  /* ================= FETCH ================= */

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${NOTIFICATION_API_URL}/user/${userId}`
      );

      if (!res.ok) {
        console.error("Failed to fetch notifications");
        return;
      }

      const data = await res.json();
      setNotifications(data);

    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {

    if (!userId) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);

  }, [userId]);

  /* ================= MARK ONE ================= */

  const markOneRead = async (id) => {
    try {
      await fetch(
        `${NOTIFICATION_API_URL}/read/${id}`,
        { method: "PUT" }
      );

      fetchNotifications();

    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  /* ================= MARK ALL ================= */

  const markAllRead = async () => {
    try {

      await Promise.all(
        notifications
          .filter(n => !n.read)
          .map(n =>
            fetch(
              `${NOTIFICATION_API_URL}/read/${n.id}`,
              { method: "PUT" }
            )
          )
      );

      fetchNotifications();

    } catch (err) {
      console.error("Mark all failed:", err);
    }
  };

  /* ================= CLEAR ALL ================= */

  const clearAll = async () => {
    try {
      await fetch(
        `${NOTIFICATION_API_URL}/user/${userId}`,
        { method: "DELETE" }
      );

      setNotifications([]);

    } catch (err) {
      console.error("Clear failed:", err);
    }
  };

  const unreadCount =
    notifications.filter(n => !n.read).length;

  return (
    <div style={{ padding: 30, color: "#fff" }}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <div>
          <h3>Notifications</h3>
          <small style={{ color: "#94a3b8" }}>
            {unreadCount} unread notifications
          </small>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={markAllRead} style={ghostBtn}>
            Mark all read
          </button>

          <button onClick={clearAll} style={dangerBtn}>
            Clear all
          </button>
        </div>
      </div>

      {notifications.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 80,
            color: "#94a3b8",
          }}
        >
          🔔 No notifications
        </div>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 20px",
            marginBottom: 14,
            borderRadius: 12,
            background: "#020617",
            border: !n.read
              ? "1px solid #2563eb"
              : "1px solid #1e293b",
          }}
        >

          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#38bdf8",
            }}
          >
            {iconMap[n.type] || <Bell size={20} />}
          </div>

          <div style={{ flex: 1 }}>
            <h6 style={{ margin: 0 }}>{n.title}</h6>

            <p
              style={{
                margin: "4px 0",
                color: "#cbd5f5",
                fontSize: 14,
              }}
            >
              {n.message}
            </p>

            <small style={{ color: "#94a3b8" }}>
              {new Date(n.createdAt).toLocaleString()}
            </small>
          </div>

          {!n.read && (
            <button
              onClick={() => markOneRead(n.id)}
              style={markReadBtn}
            >
              Mark Read
            </button>
          )}

        </div>
      ))}

    </div>
  );
};

/* ================= BUTTON STYLES ================= */

const markReadBtn = {
  background: "transparent",
  color: "#38bdf8",
  border: "1px solid #38bdf8",
  padding: "6px 14px",
  borderRadius: 20,
  fontSize: 13,
  cursor: "pointer",
};

const ghostBtn = {
  background: "transparent",
  border: "1px solid #334155",
  color: "#cbd5f5",
  padding: "6px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

const dangerBtn = {
  background: "rgba(239,68,68,0.15)",
  border: "1px solid rgba(239,68,68,0.5)",
  color: "#f87171",
  padding: "6px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

export default Notifications;