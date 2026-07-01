import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, LineChart, Line
} from "recharts";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const COLORS = ["#0B67DC", "#F59E0B", "#EF4444"];

export default function CrimeAnalytics() {

  const [monthlyData, setMonthlyData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [yearData, setYearData] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/admin/crime-analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await res.json();

        setMonthlyData(data.monthly || []);
        setPieData(data.pie || []);
        setYearData(data.yearly || []);

      } catch (err) {
        console.error("Analytics fetch error:", err);
      }
    };

    fetchAnalytics();
  }, [token]); // ✅ dependency added properly

  return (
    <section className="p-4 rounded" style={{ background: "#020617" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-light mb-0">
          Crime Analytics Dashboard
        </h4>

        <button
          className="btn btn-primary btn-sm"
          style={{ background: "#0B67DC" }}
        >
          Generate Monthly Report
        </button>
      </div>

      <div className="row g-4">

        <div className="col-lg-4">
          <div className="p-3 rounded h-100" style={{ background: "#0f172a" }}>
            <h6 className="text-light mb-3">Monthly Crime Trends</h6>

            <BarChart width={420} height={260} data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Theft" fill="#0B67DC" />
              <Bar dataKey="Assault" fill="#F59E0B" />
              <Bar dataKey="Cyber" fill="#EF4444" />
            </BarChart>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="p-3 rounded h-100" style={{ background: "#0f172a" }}>
            <h6 className="text-light mb-3">Top Crime Types</h6>

            <PieChart width={420} height={260}>
              <Pie data={pieData} dataKey="value" outerRadius={90} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="p-3 rounded h-100" style={{ background: "#0f172a" }}>
            <h6 className="text-light mb-3">Annual Comparison</h6>

            <LineChart width={420} height={260} data={yearData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cases"
                stroke="#10B981"
                strokeWidth={3}
              />
            </LineChart>
          </div>
        </div>

      </div>
    </section>
  );
}
