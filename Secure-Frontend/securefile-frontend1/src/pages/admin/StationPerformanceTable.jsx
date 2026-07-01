import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const StationPerformanceTable = () => {

  const [stations, setStations] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/admin/station-performance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch station data");
        }

        const data = await res.json();
        setStations(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Station performance fetch error:", err);
      }
    };

    fetchStations();
  }, [token]); // ✅ proper dependency

  const getStatus = (percentage) => {
    if (percentage >= 70) return "good";
    if (percentage >= 40) return "average";
    return "poor";
  };

  return (
    <div style={{ width: "100%" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "#e5e7eb",
          fontSize: "14px"
        }}
      >
        <thead>
          <tr
            style={{
              color: "#94a3b8",
              borderBottom: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <th style={{ textAlign: "left", padding: "12px" }}>
              Police Station
            </th>
            <th>Total FIRs</th>
            <th>Solved %</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {stations.map((s, index) => {

            const percent =
              s.firs > 0
                ? Math.round((s.solved / s.firs) * 100)
                : 0;

            const status = getStatus(percent);

            return (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.05)"
                }}
              >
                <td style={{ padding: "12px", fontWeight: "600" }}>
                  {s.name}
                </td>

                <td>{s.firs}</td>

                <td>{percent}%</td>

                <td>
                  {status === "good" && (
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        color: "#22c55e",
                        background: "rgba(34,197,94,0.15)",
                        border: "1px solid rgba(34,197,94,0.4)"
                      }}
                    >
                      Good
                    </span>
                  )}

                  {status === "average" && (
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        color: "#eab308",
                        background: "rgba(234,179,8,0.15)",
                        border: "1px solid rgba(234,179,8,0.4)"
                      }}
                    >
                      Average
                    </span>
                  )}

                  {status === "poor" && (
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        color: "#ef4444",
                        background: "rgba(239,68,68,0.15)",
                        border: "1px solid rgba(239,68,68,0.4)"
                      }}
                    >
                      Needs Attention
                    </span>
                  )}
                </td>
              </tr>
            );

          })}
        </tbody>
      </table>
    </div>
  );
};

export default StationPerformanceTable;
