import { useNavigate } from "react-router-dom";
import { FileText, Scale, Users, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import CriminalTrends from "./CriminalTrends";
import { useRecords } from "../../context/RecordsContext";

/* ---------------- STYLES ---------------- */

const cardStyle = {
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95))",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.6)",
};

const headerStrip = {
  background: "rgba(2,6,23,0.85)",
  padding: "10px 14px",
  borderRadius: "12px",
  marginBottom: "14px",
};

const pulseStyle = `
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
`;

/* ===================================================== */

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const { firs, criminals, isLoadingFirs, isLoadingCriminals } = useRecords();

  const loading = isLoadingFirs;
  const criminalsLoading = isLoadingCriminals;

  /* ---------------- CALCULATIONS ---------------- */

  const activeCases = firs.filter(
    f => f.status === "ASSIGNED" || f.status === "IN_PROGRESS"
  );

  const totalFIRs = firs.length;
  const activeCasesCount = activeCases.length;
  const totalCriminals = criminals.length;
  const wantedCount = criminals.filter(c => (c.status || "").toUpperCase() === "WANTED").length;

  const recentFIRs = [...firs].slice(-2).reverse();
  const activeCase = activeCases[0];
  const wantedList = criminals.filter(c => (c.status || "").toUpperCase() === "WANTED").slice(0, 3);

  /* ===================================================== */

  return (
    <div className="container-fluid text-white py-4">
      <style>{pulseStyle}</style>

      {/* ---------------- HEADER BAR ---------------- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Officer Overview</h4>
          <p className="small text-secondary mb-0">Real-time case intelligence & criminal stats</p>
        </div>
        <div>
        </div>
      </div>

      {/* ---------------- STATS ---------------- */}
      <div className="row g-4 mb-4">
        <Stat title="My FIRs" value={totalFIRs} type="firs" />
        <Stat title="Active Cases" value={activeCasesCount} type="active" />
        <Stat title="Criminals in DB" value={totalCriminals} type="criminals" />
        <Stat title="Wanted" value={wantedCount} type="wanted" />
      </div>

      {/* ---------------- RECENT + ACTIVE ---------------- */}
      <div className="row g-4 mb-4">

        <div className="col-md-8">
          <div style={cardStyle} className="p-4 h-100">

            <div style={headerStrip} className="d-flex justify-content-between">
              <strong>Recent Assigned FIRs</strong>
              <span
                role="button"
                className="text-info small"
                onClick={() => navigate("/dashboard/fir")}
              >
                View All
              </span>
            </div>

            {loading ? (
              <p className="text-secondary small">Loading...</p>
            ) : recentFIRs.length === 0 ? (
              <p className="text-secondary small">No FIRs assigned yet</p>
            ) : (
              recentFIRs.map(fir => (
                <div key={fir.id} className="mb-2">
                  <strong>{fir.id}</strong>
                  <p className="small text-secondary mb-0">
                    {fir.description || "-"}
                  </p>
                </div>
              ))
            )}

          </div>
        </div>

        <div className="col-md-4">
          <div style={cardStyle} className="p-4 h-100">

            <div style={headerStrip} className="d-flex justify-content-between">
              <strong>Active Case</strong>
              <span
                role="button"
                className="text-info small"
                onClick={() => navigate("/dashboard/cases")}
              >
                View All
              </span>
            </div>

            {activeCase ? (
              <>
                <strong>{activeCase.id}</strong>
                <div className="progress my-3" style={{ height: 7 }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: "50%" }}
                  />
                </div>
                <small className="text-secondary">
                  Investigation Ongoing
                </small>
              </>
            ) : (
              <p className="text-secondary small">
                No active case assigned
              </p>
            )}

          </div>
        </div>

      </div>

      {/* ---------------- CRIMINAL TRENDS ---------------- */}
      <div className="row g-4">

        <div className="col-md-8">
          <CriminalTrends criminals={criminals} loading={criminalsLoading} />
        </div>

        {/* ---------------- ALERTS ---------------- */}
        <div className="col-md-4">
          <div style={cardStyle} className="p-4 h-100">

            <div style={headerStrip}>
              <strong>Criminal Alerts</strong>
            </div>

            {criminalsLoading ? (
              <p className="text-secondary small">Loading alerts...</p>
            ) : wantedList.length === 0 ? (
              <p className="text-secondary small">No wanted criminals found</p>
            ) : (
              wantedList.map((c, index) => (
                <div
                  key={c.id}
                  className={`d-flex justify-content-between align-items-center pb-3 mb-3 ${index !== wantedList.length - 1
                    ? "border-bottom border-secondary"
                    : ""
                    }`}
                >
                  <div className="fw-semibold">{c.name}</div>
                  <span className="badge rounded-pill bg-danger bg-opacity-25 text-danger">
                    Wanted
                  </span>
                </div>
              ))
            )}

          </div>
        </div>

      </div>

      <Outlet />
    </div>
  );
};

/* ---------------- STAT CARD ---------------- */

const Stat = ({ title, value, type }) => {

  const iconMap = {
    firs: <FileText size={18} />,
    active: <Scale size={18} />,
    criminals: <Users size={18} />,
    wanted: <AlertTriangle size={18} />,
  };

  const danger = type === "wanted";

  return (
    <div className="col-md-3">
      <div style={cardStyle} className="p-4 h-100">

        <div className="d-flex align-items-center gap-3 mb-2">
          <div
            className={`rounded d-flex align-items-center justify-content-center ${danger
              ? "bg-danger bg-opacity-25 text-danger"
              : "bg-primary bg-opacity-25 text-info"
              }`}
            style={{ width: 42, height: 42 }}
          >
            {iconMap[type]}
          </div>
          <span className="small text-secondary">{title}</span>
        </div>

        <h3 className={danger ? "text-danger" : ""}>{value}</h3>

      </div>
    </div>
  );
};

export default OfficerDashboard;