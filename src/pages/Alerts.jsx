import React from "react";
import AlertItem from "../components/AlertItem";

function Alerts() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Alerts</h2>
      <AlertItem location="Mau Complex, Nakuru County" date="2025-11-17" time="09:23 AM" status="New" confidence="94" area="12.4" />
      <AlertItem location="Aberdare Range, Nyandarua County" date="2025-11-17" time="07:15 AM" status="Investigating" confidence="87" area="8.2" />
    </div>
  );
}

export default Alerts;
