import React, { useState, useEffect } from "react";
import "../Alerts.css";
import apiService from "../services/api";

const filters = ["All Alerts", "New", "Investigating", "Resolved", "False Positive"];

export default function Alerts() {
  const [selectedFilter, setSelectedFilter] = useState("All Alerts");
  const [searchQuery, setSearchQuery] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, [selectedFilter, searchQuery]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAlerts({
        status: selectedFilter,
        search: searchQuery
      });
      setAlerts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusUpdate = async (alertId, newStatus) => {
    try {
      await apiService.updateAlert(alertId, { status: newStatus });
      // Refresh alerts after update
      fetchAlerts();
    } catch (err) {
      console.error('Error updating alert:', err);
      alert('Failed to update alert status');
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="alerts-page">
        <h1 className="alerts-title">All Alerts</h1>
        <p>Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="alerts-page">
      <h1 className="alerts-title">All Alerts</h1>
      <p className="alerts-count">{alerts.length} alerts found</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search + Filters Row */}
      <div className="alerts-toolbar">
        <input
          type="text"
          placeholder="Search by county or forest name..."
          className="alerts-search"
          value={searchQuery}
          onChange={handleSearchChange}
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
        {alerts.map((alert) => (
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

            <span className={`alert-status badge-${alert.status.toLowerCase().replace(' ', '-')}`}>
              {alert.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
