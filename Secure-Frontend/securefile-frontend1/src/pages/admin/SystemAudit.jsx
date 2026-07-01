import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ShieldAlert,
  UserCog,
  AlertTriangle,
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const SystemAudit = () => {

  const [auditLogs, setAuditLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const [stats, setStats] = useState({
    total: 0,
    adminActions: 0,
    failed: 0,
  });

  // ✅ Fetch audit logs from backend
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/audit`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch audit logs");
        }

        const data = await res.json();
        setAuditLogs(data);

        // 🔥 Calculate stats dynamically
        setStats({
          total: data.length,
          adminActions: data.filter(log => log.role === "ADMIN").length,
          failed: data.filter(log => log.status === "Failed").length,
        });

      } catch (err) {
        console.error("Audit fetch error:", err);
      }
    };

    fetchAuditLogs();
  }, []);

  const filteredLogs = auditLogs.filter((log) => {

    const matchesSearch =
      log.user?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.resource?.toLowerCase().includes(search.toLowerCase()) ||
      log.ip?.includes(search);

    const matchesAction =
      actionFilter === "ALL" || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background:
          "radial-gradient(160% 120% at 50% 0%, #0b1220 0%, #020617 65%, #020617 100%)",
        color: "#e5e7eb",
      }}
    >

      <div className="mb-4">
        <h3 style={{ color: "#f8fafc" }}>System Audit</h3>
        <p style={{ color: "#94a3b8" }}>
          Monitor, review, and investigate all system activities
        </p>
      </div>

      <div className="row g-4 mb-4">
        <StatCard
          icon={<ShieldAlert size={22} />}
          title="Total Events"
          value={stats.total}
          color="#60a5fa"
        />
        <StatCard
          icon={<UserCog size={22} />}
          title="Admin Actions"
          value={stats.adminActions}
          color="#34d399"
        />
        <StatCard
          icon={<AlertTriangle size={22} />}
          title="Failed Attempts"
          value={stats.failed}
          color="#f87171"
        />
      </div>

      <div
        style={{
          background:
            "linear-gradient(145deg, #0b1220, #020617)",
          border: "1px solid #1e293b",
          borderRadius: "18px",
          padding: "22px",
          boxShadow:
            "0 35px 80px rgba(0,0,0,0.85)",
        }}
      >

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h5 style={{ color: "#e2e8f0" }}>Audit Logs</h5>

          <div className="d-flex gap-3">

            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "6px 10px",
                minWidth: "220px",
              }}
            >
              <Search size={16} color="#94a3b8" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search logs..."
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#e5e7eb",
                  marginLeft: "8px",
                  width: "100%",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "6px 10px",
              }}
            >
              <Filter size={16} color="#94a3b8" />

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#e5e7eb",
                  marginLeft: "8px",
                }}
              >
                <option style={{ background: "#020617" }} value="ALL">
                  All Actions
                </option>
                <option style={{ background: "#020617" }} value="APPROVE">
                  APPROVE
                </option>
                <option style={{ background: "#020617" }} value="REJECT">
                  REJECT
                </option>
                <option style={{ background: "#020617" }} value="LOGIN">
                  LOGIN
                </option>
              </select>

            </div>

          </div>
        </div>

        <div style={{ maxHeight: "420px", overflow: "auto" }}>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >

            <thead>
              <tr
                style={{
                  color: "#94a3b8",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {[
                  "Time",
                  "User",
                  "Role",
                  "Action",
                  "Resource",
                  "Status",
                  "IP Address",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 14px",
                      textAlign: "left",
                      fontWeight: "500",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom:
                      "1px solid rgba(255,255,255,0.05)",
                  }}
                >

                  <td style={{ padding: "14px", fontFamily: "monospace" }}>
                    {log.time}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {log.user}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {log.role}
                  </td>

                  <td style={{ padding: "14px", fontWeight: "600" }}>
                    {log.action}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {log.resource}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {log.status}
                  </td>

                  <td style={{ padding: "14px", fontFamily: "monospace" }}>
                    {log.ip}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

          {filteredLogs.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                color: "#94a3b8",
              }}
            >
              No matching logs found
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="col-md-4">
    <div
      style={{
        background:
          "linear-gradient(145deg, #0b1220, #020617)",
        border: "1px solid #1e293b",
        borderRadius: "18px",
        padding: "22px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div style={{ color }}>{icon}</div>

      <div>
        <div style={{ color: "#94a3b8", fontSize: "13px" }}>
          {title}
        </div>
        <div
          style={{
            color,
            fontWeight: "600",
            fontSize: "18px",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  </div>
);

export default SystemAudit;
