import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Info, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

const NotificationContext = createContext();

const initialNotifications = [
  {
    id: 1,
    type: "case",
    title: "Case Update",
    message: "Case #CR-2024-001 assigned to you.",
    unread: true,
    route: "/dashboard/cases/CR-2024-001",
  },
  {
    id: 2,
    type: "fir",
    title: "New FIR Registered",
    message: "FIR #FIR-2024-156 registered.",
    unread: true,
    route: "/dashboard/fir",
  },
  {
    id: 3,
    type: "urgent",
    title: "Urgent Alert",
    message: "Wanted criminal spotted.",
    unread: true,
    route: "/dashboard/criminals",
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [modal, setModal] = useState(null); // { type: 'alert'|'confirm', title, message, resolve }

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = id => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, unread: false } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now(),
      unread: true,
      createdAt: new Date().toISOString(),
      ...notif,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  /* ---------------- CUSTOM ALERTS & CONFIRMS ---------------- */

  const showAlert = (message, title = "Notification", type = "info") => {
    return new Promise((resolve) => {
      setModal({ type: "alert", title, message, alertType: type, resolve });
    });
  };

  const showConfirm = (message, title = "Are you sure?") => {
    return new Promise((resolve) => {
      setModal({ type: "confirm", title, message, resolve });
    });
  };

  const handleModalClose = (value) => {
    if (modal && modal.resolve) {
      modal.resolve(value);
    }
    setModal(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        showAlert,
        showConfirm,
      }}
    >
      {children}

      {/* CUSTOM UI MODAL */}
      {modal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            zIndex: 9999,
            background: "rgba(2, 6, 23, 0.7)",
            backdropFilter: "blur(8px)",
            animation: "fadeIn 0.2s ease-out"
          }}
        >
          <div
            className="p-4 rounded-4"
            style={{
              width: "400px",
              background: "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(2,6,23,0.98))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              animation: "slideUp 0.3s ease-out"
            }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 42,
                  height: 42,
                  background: modal.type === "confirm" ? "rgba(59,130,246,0.15)" :
                    modal.alertType === "error" ? "rgba(239, 68, 68, 0.15)" :
                      modal.alertType === "success" ? "rgba(16, 185, 129, 0.15)" :
                        "rgba(59, 130, 246, 0.15)"
                }}
              >
                {modal.type === "confirm" ? <HelpCircle color="#3b82f6" /> :
                  modal.alertType === "error" ? <AlertCircle color="#ef4444" /> :
                    modal.alertType === "success" ? <CheckCircle color="#10b981" /> :
                      <Info color="#3b82f6" />}
              </div>
              <h5 className="mb-0 text-white fw-bold">{modal.title}</h5>
            </div>

            <p className="text-secondary mb-4" style={{ fontSize: "15px", lineHeight: "1.6" }}>
              {modal.message}
            </p>

            <div className="d-flex justify-content-end gap-2">
              {modal.type === "confirm" && (
                <button
                  className="btn px-4 py-2 text-secondary fw-semibold border-0 bg-transparent"
                  onClick={() => handleModalClose(false)}
                >
                  Cancel
                </button>
              )}
              <button
                className="btn px-4 py-2 rounded-3 fw-bold text-white"
                style={{
                  background: modal.alertType === "error" ? "#ef4444" :
                    modal.alertType === "success" ? "#10b981" :
                      "#2563eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                }}
                onClick={() => handleModalClose(true)}
              >
                {modal.type === "confirm" ? "Confirm" : "Got it"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
