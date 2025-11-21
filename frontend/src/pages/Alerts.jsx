import React, { useState } from "react";
import "../Alerts.css";



const filters = ["All Alerts", "New", "Investigating", "Resolved", "False Positive"];

const sampleAlerts = [
  {
    id: 1,
    image: "/images/alert1.jpg",
    title: "Mau Complex, Nakuru County",
    coords: "-0.4833, 35.6167",
    date: "2025-11-17",
    time: "09:23 AM",
    confidence: 94,
    area: "12.4 ha",
    status: "New",
  },
  {
    id: 2,
    image: "/images/alert2.jpg",
    title: "Aberdare Range, Nyandarua County",
    coords: "-0.4000, 36.7167",
    date: "2025-11-17",
    time: "07:15 AM",
    confidence: 87,
    area: "8.2 ha",
    status: "Investigating",
  },
  {
    id: 3,
    image: "/images/alert3.jpg",
    title: "Kakamega Forest, Kakamega County",
    coords: "0.2667, 34.8667",
    date: "2025-11-16",
    time: "03:42 PM",
    confidence: 91,
    area: "15.6 ha",
    status: "New",
  },
];

export default function Alerts() {
  const [selectedFilter, setSelectedFilter] = useState("All Alerts");

  const filteredAlerts =
    selectedFilter === "All Alerts"
      ? sampleAlerts
      : sampleAlerts.filter((a) => a.status === selectedFilter);

  return (
    <div className="alerts-page">

      <h1 className="alerts-title">All Alerts</h1>
      <p className="alerts-count">{filteredAlerts.length} alerts found</p>

      {/* Search + Filters Row */}
      <div className="alerts-toolbar">
        <input
          type="text"
          placeholder="Search by county or forest name..."
          className="alerts-search"
        />

        <div className="alerts-filter-group">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${selectedFilter === filter ? "active" : ""}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <button className="export-btn">⬇ Export Report</button>
      </div>

      {/* ALERT LIST */}
      <div className="alerts-list">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="alert-card">

            <img src={alert.image} className="alert-image" alt="alert" />

            <div className="alert-info">
              <h3 className="alert-title">{alert.title}</h3>

              <div className="alert-meta">
                <p>📍 {alert.coords}</p>
                <p>📅 {alert.date}</p>
                <p>⏱ {alert.time}</p>
              </div>
            </div>

            <div className="alert-stats">
              <p className="confidence">
                Confidence <span>{alert.confidence}%</span>
              </p>
              <p className="area">
                Area <span>{alert.area}</span>
              </p>
            </div>

            <span className={`alert-status badge-${alert.status.toLowerCase()}`}>
              {alert.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
