import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { FIR_API_URL } from "../../config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const CrimeTrendChart = () => {
  const [chartData, setChartData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${FIR_API_URL}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const firs = await res.json();
        if (!Array.isArray(firs)) return;

        // Calculate trends for last 6 months
        const monthsNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        const now = new Date();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          last6Months.push({
            name: monthsNames[d.getMonth()],
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            count: 0
          });
        }

        firs.forEach(fir => {
          if (!fir.incidentDate) return;
          const firDate = new Date(fir.incidentDate);
          if (isNaN(firDate.getTime())) return;

          const m = firDate.getMonth();
          const y = firDate.getFullYear();

          const bucket = last6Months.find(b => b.monthIndex === m && b.year === y);
          if (bucket) bucket.count++;
        });

        setChartData({
          labels: last6Months.map(m => m.name),
          datasets: [
            {
              label: "Total FIRs",
              data: last6Months.map(m => m.count),
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56,189,248,0.2)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#38bdf8",
              pointBorderColor: "#fff",
              pointHoverRadius: 6,
            },
          ],
        });

      } catch (err) {
        console.error("Error fetching crime analytics:", err);
      }
    };

    fetchData();
  }, [token]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#cbd5f5" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
};

export default CrimeTrendChart;
