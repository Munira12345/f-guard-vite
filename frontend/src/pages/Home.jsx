import React from "react";
import Card from "../components/Card";

function Home() {
  const cards = [
    {
      title: "New Alerts Today",
      value: "7",
      subtitle: "+2 from yesterday",
      type: "danger", // red tone
    },
    {
      title: "Total Hectares Saved",
      value: "1,247",
      subtitle: "+89 this month",
      type: "success", // green tone
    },
    {
      title: "Response Time (avg)",
      value: "23 min",
      subtitle: "-5 min improvement",
      type: "warning", // yellow tone
    },
    {
      title: "Partners Notified",
      value: "34",
      subtitle: "KWS, NGOs, Communities",
      type: "info", // blue tone
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
