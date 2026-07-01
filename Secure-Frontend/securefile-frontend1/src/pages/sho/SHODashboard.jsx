import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FIR_API_URL, AUTH_API_URL, CRIMINAL_API_URL } from "../../config";


const pageWrapper = {
  background:
    "radial-gradient(160% 120% at 50% 0%, #0b1220 0%, #020617 70%, #020617 100%)",
  minHeight: "100vh",
};

const cardStyle = {
  background: "linear-gradient(145deg,#0b1220,#020617)",
  borderRadius: "18px",
  border: "1px solid #1e293b",
  boxShadow: "0 25px 70px rgba(0,0,0,.8)",
};

const headerStrip = {
  background: "#020617",
  padding: "10px 14px",
  borderRadius: "10px",
  marginBottom: "16px",
  border: "1px solid #1e293b",
};



const SHODashboard = () => {

  const navigate = useNavigate();

  const [firs, setFirs] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [criminals, setCriminals] = useState([]);


  useEffect(() => {

    fetch(`${FIR_API_URL}/all`)
      .then(res => res.json())
      .then(data => setFirs(Array.isArray(data) ? data : []))
      .catch(() => setFirs([]));

    fetch(`${AUTH_API_URL}/role/OFFICER`)
      .then(res => res.json())
      .then(data => setOfficers(Array.isArray(data) ? data : []))
      .catch(() => setOfficers([]));

    fetch(`${CRIMINAL_API_URL}/all`)
      .then(res => res.json())
      .then(data => setCriminals(Array.isArray(data) ? data : []))
      .catch(() => setCriminals([]));

  }, []);


  const totalFIRs = firs.length;
  const pendingApprovals = firs.filter(f => f.status === "PENDING").length;
  const activeCases = firs.filter(f => f.status === "ASSIGNED").length;
  const officerCount = officers.length;
  const wantedCount = criminals.filter(c => c.status === "WANTED").length;
  const solvedThisMonth = firs.filter(f => f.status === "CLOSED").length;

  const kpis = [
    { label: "Total FIRs", value: totalFIRs, icon: <FileText size={22} />, color: "#38bdf8" },
    { label: "Pending Approvals", value: pendingApprovals, icon: <Clock size={22} />, color: "#facc15" },
    { label: "Active Cases", value: activeCases, icon: <Activity size={22} />, color: "#22c55e" },
    { label: "Officers", value: officerCount, icon: <Users size={22} />, color: "#a78bfa" },
    { label: "Wanted", value: wantedCount, icon: <AlertTriangle size={22} />, color: "#ef4444" },
    { label: "Solved This Month", value: solvedThisMonth, icon: <CheckCircle size={22} />, color: "#4ade80" },
  ];

  const pendingFIRList = firs.filter(f => f.status === "PENDING").slice(0, 2);


  return (
    <div style={pageWrapper} className="container-fluid text-light py-4">

      <div className="row g-4 mb-4">
        {kpis.map((k, i) => (
          <div key={i} className="col-md-4 col-lg-2">
            <div style={cardStyle} className="p-4 h-100">

              <div className="d-flex justify-content-between align-items-center">
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: `${k.color}22`,
                    color: k.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {k.icon}
                </div>

                <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>
                  {k.value}
                </div>
              </div>

              <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 14 }}>
                {k.label}
              </div>

            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">

        <div className="col-md-8">
          <div style={cardStyle} className="p-4 h-100">

            <div style={headerStrip} className="d-flex justify-content-between align-items-center">
              <strong>Pending Approvals</strong>
              <span
                role="button"
                style={{ color: "#38bdf8", fontSize: "13px" }}
                onClick={() => navigate("/sho/fir-approvals")}
              >
                View All →
              </span>
            </div>

            {pendingFIRList.length === 0 ? (
              <div className="text-secondary small">
                No pending FIRs
              </div>
            ) : (
              pendingFIRList.map((fir) => (
                <div
                  key={fir.id}
                  className="d-flex justify-content-between align-items-center mb-3 p-3"
                  style={{
                    background: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                  }}
                >
                  <div>
                    <div className="fw-semibold text-light">{fir.id}</div>
                    <div className="small text-secondary">
                      {fir.description || "-"}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span
                      style={{
                        background: "rgba(250,204,21,.15)",
                        color: "#facc15",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                      }}
                    >
                      PENDING
                    </span>

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        navigate("/sho/fir-approvals", {
                          state: { firId: fir.id },
                        })
                      }
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

        <div className="col-md-4">
          <div style={cardStyle} className="p-4 h-100">
            <div style={headerStrip}>
              <strong>Officer Performance</strong>
            </div>

            {officers.map((o, i) => {

              const assigned = firs.filter(f => f.assignedOfficerId === o.email).length;
              const solved = firs.filter(f =>
                f.assignedOfficerId === o.email && f.status === "CLOSED"
              ).length;

              const percent = assigned > 0
                ? Math.round((solved / assigned) * 100)
                : 0;

              const color =
                percent >= 70 ? "#22c55e"
                : percent >= 40 ? "#facc15"
                : "#ef4444";

              return (
                <div
                  key={i}
                  className="mb-3 p-3"
                  style={{
                    background: "#020617",
                    borderRadius: "12px",
                    border: "1px solid #1e293b",
                  }}
                >
                  <div className="d-flex justify-content-between mb-1">
                    <strong>{o.fullName}</strong>
                    <span style={{ color }}>{percent}%</span>
                  </div>

                  <div className="small text-secondary mb-2">
                    Assigned: {assigned} • Solved: {solved}
                  </div>

                  <div className="progress bg-dark" style={{ height: "7px" }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${percent}%`,
                        background: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}

          </div>
        </div>

      </div>

    </div>
  );
};

export default SHODashboard;
