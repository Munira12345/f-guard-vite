import React from "react";
import Card from "../components/Card";

function Home() {
  const cards = [
    { title: "New Alerts Today", value: "7", subtitle: "+2 from yesterday" },
    { title: "Total Hectares Saved", value: "1,247", subtitle: "+89 this month" },
    { title: "Response Time (avg)", value: "23 min", subtitle: "-5 min improvement" },
    { title: "Partners Notified", value: "34", subtitle: "KWS, NGOs, Communities" },
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="cards-container">
        {cards.map((c, i) => (
          <Card key={i} title={c.title} value={c.value} subtitle={c.subtitle} />
        ))}
      </div>
    </div>
  );
}

export default Home;
