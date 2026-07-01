import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FIR_API_URL } from "../../config";

export default function CaseMonitoring() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);

  useEffect(() => {

    fetch(`${FIR_API_URL}/all`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {

        if (!Array.isArray(data)) {
          setCases([]);
          return;
        }

        const formatted = data.map(fir => ({

          fir: fir.id,

          officer: fir.assignedOfficerId || "-",

          crime: fir.ipcSections && fir.ipcSections.length > 0
            ? fir.ipcSections.join(", ")
            : "-",

          status: fir.status || "PENDING",

          progress:
            fir.status === "CLOSED" ? 100 :
              fir.status === "ASSIGNED" ? 60 :
                fir.status === "REGISTERED" ? 40 :
                  20,

          updated: fir.createdAt
            ? new Date(fir.createdAt).toLocaleDateString()
            : "-",

        }));

        setCases(formatted);

      })
      .catch(err => {
        console.error("Monitoring fetch failed:", err);
        setCases([]);
      });

  }, []);

  const badgeStyle = (status) => {
    if (status === "ASSIGNED")
      return { bg: "rgba(59,130,246,.15)", color: "#60a5fa" };

    if (status === "IN PROGRESS" || status === "REGISTERED")
      return { bg: "rgba(250,204,21,.15)", color: "#facc15" };

    return { bg: "rgba(34,197,94,.15)", color: "#4ade80" };
  };

  return (
    <div style={{ color: "#e5e7eb" }}>

      <div style={panelCard}>

        <div style={panelHeader}>
          <h6 className="mb-0 fw-semibold text-light">
            Case Monitoring
          </h6>
        </div>

        <div className="table-responsive">
          <table style={tableStyle}>

            <thead>
              <tr>
                <th style={th}>FIR No</th>
                <th style={th}>Officer</th>
                <th style={th}>Crime</th>
                <th style={th}>Status</th>
                <th style={th}>Progress</th>
                <th style={th}>Last Updated</th>
                <th style={{ ...th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((c) => {

                const badge = badgeStyle(c.status);

                return (
                  <tr key={c.fir} style={rowStyle}>

                    <td style={{ ...td, color: "#38bdf8", fontWeight: 600 }}>
                      {c.fir}
                    </td>

                    <td style={td}>{c.officer}</td>
                    <td style={td}>{c.crime}</td>

                    <td style={td}>
                      <span
                        style={{
                          ...badgeBase,
                          background: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                        <div style={progressTrack}>
                          <div
                            style={{
                              ...progressFill,
                              width: `${c.progress}%`,
                            }}
                          />
                        </div>

                        <small style={{ color: "#94a3b8" }}>
                          {c.progress}%
                        </small>

                      </div>
                    </td>

                    <td style={td}>{c.updated}</td>
                    <td style={{ ...td, textAlign: "center" }}>
                      <button
                        className="btn btn-sm btn-outline-info"
                        style={{ fontSize: "11px", borderRadius: "6px" }}
                        onClick={() => navigate(`/sho/fir/${c.fir}`)}
                      >
                        View
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}


const panelCard = {
  background: "linear-gradient(145deg,#0b1220,#020617)",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  boxShadow: "0 30px 80px rgba(0,0,0,.7)",
  overflow: "hidden",
};

const panelHeader = {
  padding: "18px 22px",
  borderBottom: "1px solid #1e293b",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  padding: "14px",
  textAlign: "left",
  fontSize: "13px",
  color: "#93c5fd",
  borderBottom: "1px solid #1e293b",
};

const td = {
  padding: "14px",
  borderBottom: "1px solid #1e293b",
};

const rowStyle = {
  background: "rgba(2,6,23,.45)",
};

const badgeBase = {
  padding: "5px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 600,
};

const progressTrack = {
  flex: 1,
  height: "8px",
  background: "#1f2937",
  borderRadius: "999px",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "linear-gradient(90deg,#38bdf8,#2563eb)",
};
