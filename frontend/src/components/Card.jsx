import React from "react";

export default function Card({ title, value, subtitle, type = "default" }) {
  return (
    <div className={`card card-${type}`}>
      <p className="card-title">{title}</p>
      <p className="card-value">{value}</p>
      <p className="card-subtitle">{subtitle}</p>
    </div>
  );
}
