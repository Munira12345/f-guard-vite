import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import apiService from "../services/api";

function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-wrapper">
        <h1 className="page-title">Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-wrapper">
        <h1 className="page-title">Dashboard</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  const cards = [
    {
      title: "New Alerts Today",
      value: stats?.new_alerts_today?.toString() || "0",
      subtitle: stats?.alerts_change || "",
      type: "danger",
    },
    {
      title: "Total Hectares Saved",
      value: stats?.total_hectares_saved?.toLocaleString() || "0",
      subtitle: stats?.hectares_change || "",
      type: "success",
    },
    {
      title: "Response Time (avg)",
      value: `${stats?.avg_response_time || 0} min`,
      subtitle: stats?.response_time_change || "",
      type: "warning",
    },
    {
      title: "Partners Notified",
      value: stats?.partners_notified?.toString() || "0",
      subtitle: stats?.partners_info || "",
      type: "info",
    },
  ];

  return (
    <div className="home-wrapper">
      <h1 className="page-title">Dashboard</h1>

      <div className="cards-container">
        {cards.map((c, i) => (
          <Card
            key={i}
            title={c.title}
            value={c.value}
            subtitle={c.subtitle}
            type={c.type}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
