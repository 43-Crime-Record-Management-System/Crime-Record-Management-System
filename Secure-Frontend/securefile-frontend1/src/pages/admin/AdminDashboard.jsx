import { useState, useEffect } from "react";
import {
  FileText,
  Activity,
  CheckCircle,
  Building2,
  Users,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL, USER_API_URL, FIR_API_URL } from "../../config";

import CrimeTrendChart from "../../pages/admin/CrimeTrendChart";
import StationPerformanceTable from "../../pages/admin/StationPerformanceTable";

const AdminDashboard = () => {
  const location = useLocation();

  const [_selectedAlert, setSelectedAlert] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [officerCount, setOfficerCount] = useState(0);
  const [firStats, setFirStats] = useState({ active: 0, closed: 0, rejected: 0, total: 0 });

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };

    const fetchOfficers = async () => {
      try {
        const res = await fetch(`${USER_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Count everyone except admins, or just everyone registered? 
          // Usually "Registered Officers" in admin view means all managed users.
          setOfficerCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (err) {
        console.error("Error fetching officers:", err);
      }
    };

    const fetchFirCalculations = async () => {
      try {
        const res = await fetch(`${FIR_API_URL}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setFirStats({
              total: data.length,
              active: data.filter(f => f.status === "ASSIGNED" || f.status === "IN_PROGRESS").length,
              closed: data.filter(f => f.status === "CLOSED").length,
              rejected: data.filter(f => f.status === "REJECTED").length,
            });
          }
        }
      } catch (err) {
        console.error("Error calculating FIR stats:", err);
      }
    };

    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/operational-alerts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAlerts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching alerts:", err);
      }
    };

    fetchStats();
    fetchOfficers();
    fetchFirCalculations();
    fetchAlerts();
  }, [token]);

  const kpiData = [
    {
      label: "Total FIRs",
      value: firStats.total || stats?.totalFirs || 0,
      icon: <FileText size={24} />,
      color: "#38bdf8",
    },
    {
      label: "Active Cases",
      value: firStats.active || stats?.activeCases || 0,
      icon: <Activity size={24} />,
      color: "#facc15",
    },
    {
      label: "Closed Cases",
      value: firStats.closed || stats?.closedCases || 0,
      icon: <CheckCircle size={24} />,
      color: "#22c55e",
    },
    {
      label: "Rejected Cases",
      value: firStats.rejected || stats?.rejectedCases || 0,
      icon: <Building2 size={24} />,
      color: "#a78bfa",
    },
    {
      label: "Registered Officers",
      value: officerCount || stats?.officers || 0,
      icon: <Users size={24} />,
      color: "#fb7185",
    },
  ];

  return (
    <div style={pageBackground}>
      <div style={pageContent}>
        {/* KPI Section */}
        <div className="row g-4 mb-5">
          {kpiData.map((item, index) => (
            <div key={index} className="col-xl col-md-6">
              <div style={kpiCard}>
                <div style={kpiTopRow}>
                  <div
                    style={{
                      ...kpiIconBox,
                      background: `${item.color}22`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={kpiLabel}>{item.label}</span>
                </div>
                <div style={kpiValue}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4 mb-5">
          <div className="col-lg-8">
            <div style={panelCard}>
              <h5 style={panelTitle}>
                Crime Trends (Last 6 Months)
              </h5>
              <CrimeTrendChart />
            </div>
          </div>

          <div className="col-lg-4">
            <div style={panelCard}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 style={panelTitle}>Operational Alerts</h5>
                <span style={liveBadge}>LIVE</span>
              </div>

              {alerts.length === 0 && (
                <p style={{ color: "#94a3b8" }}>
                  No alerts available
                </p>
              )}

              {alerts.map((alert, index) => (
                <AlertCard
                  key={index}
                  type={alert.type}
                  badge={alert.type?.toUpperCase()}
                  title={alert.title}
                  desc={alert.description}
                  metric={alert.metric}
                  metricLabel={alert.metricLabel}
                  onViewClick={() => setSelectedAlert(alert)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-lg-12">
            <div style={panelCard}>
              <h5 style={panelTitle}>Station Performance</h5>
              <StationPerformanceTable />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

const pageBackground = {
  minHeight: "100vh",
  background:
    "radial-gradient(160% 120% at 50% 0%, #0b1220 0%, #020617 65%, #020617 100%)",
};

const pageContent = {
  padding: "30px",
};

const kpiCard = {
  background: "linear-gradient(145deg, #0b1220, #020617)",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "26px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.75)",
  height: "100%",
};

const kpiTopRow = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const kpiIconBox = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const kpiLabel = {
  color: "#94a3b8",
  fontSize: "14px",
  fontWeight: "500",
};

const kpiValue = {
  color: "#f8fafc",
  fontSize: "32px",
  fontWeight: "700",
  marginTop: "14px",
};

const panelCard = {
  background: "linear-gradient(145deg, #0b1220, #020617)",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 35px 80px rgba(0,0,0,0.85)",
};

const panelTitle = {
  color: "#e2e8f0",
  marginBottom: "18px",
  fontWeight: "600",
};

const liveBadge = {
  fontSize: "11px",
  color: "#22c55e",
  border: "1px solid rgba(34,197,94,0.4)",
  padding: "4px 10px",
  borderRadius: "999px",
};

