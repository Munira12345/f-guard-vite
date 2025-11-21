import React from "react";

function AlertItem({ location, date, time, status, confidence, area }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-3">
      <div className="flex justify-between mb-1">
        <span className="font-semibold">{location}</span>
        <span className="text-sm text-gray-500">{date} {time}</span>
      </div>
      <div className="text-sm text-gray-600">
        Status: {status} | Confidence: {confidence}% | Area: {area} ha
      </div>
    </div>
  );
}

export default AlertItem;
