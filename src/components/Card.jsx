import React from "react";

function Card({ title, value, subtitle }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="value">{value}</p>
      <p className="subtitle">{subtitle}</p>
    </div>
  );
}

export default Card;
