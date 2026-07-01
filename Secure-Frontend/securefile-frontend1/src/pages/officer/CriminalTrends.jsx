import { useEffect, useState } from "react";

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

const STATUS_CONFIG = {
  total: { label: "Total Criminals", color: "#3b82f6", gradientId: "gradTotal" },
  wanted: { label: "Wanted", color: "#ef4444", gradientId: "gradWanted" },
  arrested: { label: "Arrested", color: "#f59e0b", gradientId: "gradArrested" },
  convicted: { label: "Convicted", color: "#10b981", gradientId: "gradConvicted" },
};

const CriminalTrends = ({ criminals = [], loading = false }) => {
  const processTrends = (data) => {
    if (!Array.isArray(data)) return [];
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("default", { month: "short" }),
        total: 0,
        wanted: 0,
        arrested: 0,
        convicted: 0,
      });
    }

    data.forEach((criminal) => {
      let dateStr = criminal.lastUpdated || criminal.createdAt || criminal.dateAdded;
      let date;
      if (!dateStr) date = new Date();
      else if (typeof dateStr === "string" && (dateStr.includes("/") || dateStr.includes("-"))) {
        const parts = dateStr.split(/[/-]/);
        if (parts[0].length === 4) date = new Date(dateStr);
        else {
          const [d, m, y] = parts;
          date = new Date(y, m - 1, d);
        }
      } else date = new Date(dateStr);
      if (isNaN(date.getTime())) date = new Date();

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const monthObj = months.find((m) => m.key === key);
      if (!monthObj) return;

      const status = (criminal.status || "").toUpperCase();
      monthObj.total += 1;
      if (status === "WANTED") monthObj.wanted += 1;
      if (status === "ARRESTED") monthObj.arrested += 1;
      if (status === "CONVICTED") monthObj.convicted += 1;
    });
    return months;
  };

  const trendData = processTrends(criminals);

  const maxValue = Math.max(
    ...trendData.flatMap((item) => [
      item.total,
      item.wanted,
      item.arrested,
      item.convicted,
    ]),
    5 // minimum scale of 5
  );

  const getPoints = (key, isArea = false) => {
    if (!trendData.length) return "";
    const width = 300;
    const height = 150;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - 40;

    const points = trendData.map((item, index) => {
      const x = padding + (index * chartWidth) / (trendData.length - 1);
      const y = height - 30 - (item[key] / maxValue) * chartHeight;
      return `${x},${y}`;
    });

    if (isArea) {
      const firstX = padding;
      const lastX = padding + chartWidth;
      const baseY = height - 30;
      return `${firstX},${baseY} ${points.join(" ")} ${lastX},${baseY}`;
    }

    return points.join(" ");
  };

  if (loading) {
    return (
      <div style={{ ...cardStyle, height: "300px" }} className="p-4 d-flex align-items-center justify-content-center">
        <p className="text-secondary">Loading Trends...</p>
      </div>
    );
  }

  return (
    <div style={cardStyle} className="p-4">
      <div style={headerStrip} className="d-flex justify-content-between align-items-center">
        <strong>Criminal Trends (Last 6 Months)</strong>
        <span className="badge bg-primary bg-opacity-10 text-primary small">Live Data</span>
      </div>

      <svg viewBox="0 0 320 180" width="100%" height="220" preserveAspectRatio="xMidYMid meet">
        <defs>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <linearGradient key={key} id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={config.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Grid Lines */}
        {[0, 0.5, 1].map((p) => (
          <line
            key={p}
            x1="40"
            y1={120 - p * 80 + 30}
            x2="280"
            y2={120 - p * 80 + 30}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="4"
          />
        ))}

        {/* Axes */}
        <line x1="40" y1="20" x2="40" y2="150" stroke="#1e293b" strokeWidth="1" />
        <line x1="40" y1="150" x2="280" y2="150" stroke="#1e293b" strokeWidth="1" />

        {/* Area & Lines for each status */}
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <g key={key}>
            <polyline
              fill={`url(#${config.gradientId})`}
              points={getPoints(key, true)}
              style={{ transition: "all 0.3s" }}
            />
            <polyline
              fill="none"
              stroke={config.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={getPoints(key)}
              style={{ transition: "all 0.3s" }}
            />
          </g>
        ))}

        {/* Labels */}
        {trendData.map((item, index) => {
          const x = 40 + (index * 240) / (trendData.length - 1);
          return (
            <text
              key={index}
              x={x}
              y="168"
              fill="#64748b"
              fontSize="10"
              textAnchor="middle"
              className="fw-medium"
            >
              {item.label}
            </text>
          );
        })}

        {/* Y Axis Max Label */}
        <text x="35" y="45" fill="#475569" fontSize="9" textAnchor="end">{maxValue}</text>
        <text x="35" y="150" fill="#475569" fontSize="9" textAnchor="end">0</text>
      </svg>

      <div className="row g-2 mt-2">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <div key={key} className="col-6 col-md-3 d-flex align-items-center gap-2">
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: config.color }}></div>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriminalTrends;