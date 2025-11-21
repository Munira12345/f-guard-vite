import React, { useState } from "react";
import "../Reports.css";

function Reports() {
  const [range, setRange] = useState("Month");

  const ranges = ["Week", "Month", "Year"];

  const stats = [
    {
      title: "Total Alerts",
      value: "342",
      change: "↓ 12% from last period",
      changeColor: "#ff6b6b",
      icon: "📉",
      type: "danger",
    },
    {
      title: "Area Affected",
      value: "1,247 ha",
      change: "↓ 8% improvement",
      changeColor: "#00d47e",
      icon: "📍",
      type: "success",
    },
    {
      title: "Avg Response",
      value: "23 min",
      change: "↓ 18% improvement",
      changeColor: "#00d47e",
      icon: "⏱️",
      type: "warning",
    },
    {
      title: "Resolved",
      value: "89%",
      change: "↑ 5% increase",
      changeColor: "#4ab0ff",
      icon: "📈",
      type: "info",
    },
  ];

  return (
    <div className="reports-page">
      <h1 className="reports-title">Reports & Analytics</h1>
      <p className="reports-subtitle">
        Comprehensive insights into forest degradation trends
      </p>

      {/* Top controls */}
      <div className="reports-header">
        <div className="range-selector">
          {ranges.map((r) => (
            <button
              key={r}
              className={`range-btn ${range === r ? "active" : ""}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="report-actions">
          <button className="action-btn">⚙️ Filter</button>
          <button className="action-btn">📄 PDF</button>
          <button className="excel-btn">⬇️ Excel</button>
        </div>
      </div>

      {/* Cards */}
      <div className="report-cards">
        {stats.map((s, i) => (
          <div key={i} className={`report-card report-${s.type}`}>
            <div className="report-card-icon">{s.icon}</div>
            <div>
              <p className="report-card-title">{s.title}</p>
              <p className="report-card-value">{s.value}</p>
              <p
                className="report-card-change"
                style={{ color: s.changeColor }}
              >
                {s.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reports;
