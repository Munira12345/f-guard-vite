import React from "react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "Live Map", icon: "🗺️" },
    { name: "Alerts", icon: "⚠️" },
    { name: "Reports", icon: "📄" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="sidebar dark-sidebar">
      <h2 className="sidebar-title">ForestGuard KE</h2>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`sidebar-item ${
              activePage === item.name ? "active" : ""
            }`}
            onClick={() => setActivePage(item.name)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
