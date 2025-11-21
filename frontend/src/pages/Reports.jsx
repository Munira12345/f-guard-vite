import React, { useState, useEffect } from "react";
import "../Reports.css";
import apiService from "../services/api";

function Reports() {
  const [range, setRange] = useState("Month");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ranges = ["Week", "Month", "Year"];

  useEffect(() => {
    fetchReportStats();
  }, [range]);

  const fetchReportStats = async () => {
    try {
      setLoading(true);
      const data = await apiService.getReportStats(range);
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching report stats:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reports-page">
        <h1 className="reports-title">Reports & Analytics</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-page">
        <h1 className="reports-title">Reports & Analytics</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  const reportCards = [
    {
      title: "Total Alerts",
      value: stats?.total_alerts?.toLocaleString() || "0",
      change: stats?.alerts_change || "",
      changeColor: "#ff6b6b",
      icon: "📉",
      type: "danger",
    },
    {
      title: "Area Affected",
      value: stats?.area_affected || "0 ha",
      change: stats?.area_change || "",
      changeColor: "#00d47e",
      icon: "📍",
      type: "success",
    },
    {
      title: "Avg Response",
      value: stats?.avg_response || "0 min",
      change: stats?.response_change || "",
      changeColor: "#00d47e",
      icon: "⏱️",
      type: "warning",
    },
    {
      title: "Resolved",
      value: `${stats?.resolved_percentage || 0}%`,
      change: stats?.resolved_change || "",
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
        {reportCards.map((s, i) => (
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
