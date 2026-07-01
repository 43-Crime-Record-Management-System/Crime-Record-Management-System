import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { AUTH_API_URL, FIR_API_URL } from "../../config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function OfficerPerformance() {

  const [officers, setOfficers] = useState([]);
  const [monthFilter, setMonthFilter] = useState("ALL");


  useEffect(() => {

    const loadPerformance = async () => {
      try {

        const res = await fetch(`${AUTH_API_URL}/role/OFFICER`);
        const officerList = await res.json();

        if (!Array.isArray(officerList)) return;

        const performanceData = await Promise.all(
          officerList.map(async (officer) => {

            let url = `${FIR_API_URL}/performance/${officer.email}`;

            if (monthFilter !== "ALL") {
              url += `?month=${monthFilter}`;
            }

            const perfRes = await fetch(url);
            const perf = await perfRes.json();

            const assigned = perf.totalAssigned || 0;
            const closed = perf.closed || 0;

            const percentage =
              assigned === 0 ? 0 : Math.round((closed / assigned) * 100);

            return {
              name: officer.fullName,
              assigned,
              inProgress: perf.ongoing || 0,
              closed,
              percentage,
            };

          })
        );

        setOfficers(performanceData);

      } catch (err) {
        console.error("Performance load failed:", err);
      }
    };

    loadPerformance();

  }, [monthFilter]);


  const topScore = Math.max(...officers.map(o => o.percentage), 0);


  const barData = {
    labels: officers.map(o => o.name),
    datasets: [
      {
        label: "Cases Closed",
        data: officers.map(o => o.closed),
        backgroundColor: "#38bdf8",
        borderRadius: 10,
        barThickness: 40,
      },
    ],
  };

  const donutData = {
    labels: ["Closed", "In Progress"],
    datasets: [
      {
        data: [
          officers.reduce((a, o) => a + o.closed, 0),
          officers.reduce((a, o) => a + o.inProgress, 0),
        ],
        backgroundColor: ["#22c55e", "#facc15"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div style={{ color: "#e5e7eb" }}>

      <div style={{ marginBottom: "16px" }}>
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          style={{
            background: "#020617",
            color: "#f8fafc",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            padding: "6px 10px",
          }}
        >
          <option value="ALL">All Time</option>
          <option value="2026-02">This Month</option>
          <option value="2026-01">Last Month</option>
        </select>
      </div>

      <div style={panelCard}>

        <div style={panelHeader}>
          <h6 className="mb-0 fw-semibold text-light">
            Officer Case Summary
          </h6>
        </div>

        <div className="table-responsive">
          <table style={tableStyle}>

            <thead>
              <tr>
                <th style={th}>Officer</th>
                <th style={th}>Assigned</th>
                <th style={th}>In Progress</th>
                <th style={th}>Closed</th>
                <th style={th}>Performance %</th>
              </tr>
            </thead>

            <tbody>
              {officers.map((o) => (
                <tr key={o.name} style={rowStyle}>

                  <td style={{ ...td, color: "#38bdf8", fontWeight: 600 }}>
                    {o.name}
                    {o.percentage === topScore && topScore > 0 && (
                      <span style={{
                        marginLeft: 8,
                        background: "gold",
                        color: "black",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontWeight: 700,
                      }}>
                        🏆 Top
                      </span>
                    )}
                  </td>

                  <td style={td}>{o.assigned}</td>

                  <td style={td}>
                    <span style={yellowBadge}>{o.inProgress}</span>
                  </td>

                  <td style={td}>
                    <span style={greenBadge}>{o.closed}</span>
                  </td>

                  <td style={td}>
                    <strong>{o.percentage}%</strong>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>


      <div className="row g-4 mt-4">

        <div className="col-lg-8">
          <div style={panelCard}>
            <div style={panelHeader}>
              <h6 className="mb-0 fw-semibold text-light">
                Cases Closed By Officer
              </h6>
            </div>
            <div style={{ height: "280px", padding: "16px" }}>
              <Bar data={barData} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div style={panelCard}>
            <div style={panelHeader}>
              <h6 className="mb-0 fw-semibold text-light">
                Overall Case Status
              </h6>
            </div>
            <div style={{ height: "280px", padding: "16px" }}>
              <Doughnut data={donutData} />
            </div>
          </div>
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
  padding: "16px 22px",
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

const greenBadge = {
  background: "rgba(34,197,94,.15)",
  color: "#4ade80",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 600,
};

const yellowBadge = {
  background: "rgba(250,204,21,.15)",
  color: "#facc15",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 600,
};
