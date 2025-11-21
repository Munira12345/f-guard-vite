import React, { useState } from "react";
import "../Settings.css";

function Settings() {
  const [profile, setProfile] = useState({
    name: "John Kamau",
    organization: "Kenya Wildlife Service",
    email: "john.kamau@kws.go.ke",
    countryFlag: "🇰🇪",
    phone: "+254 712 345678",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [language, setLanguage] = useState("English");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>
      <p className="settings-subtitle">Manage your account and notification preferences</p>

      {/* Profile Information */}
      <section className="section">
        <h2>Profile Information</h2>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Organization
          <input
            type="text"
            name="organization"
            value={profile.organization}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Country Flag
          <input
            type="text"
            name="countryFlag"
            value={profile.countryFlag}
            onChange={handleInputChange}
            maxLength={2}
          />
        </label>
        <label>
          Phone
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
          />
        </label>
        <button className="save-btn">Save Changes</button>
      </section>

      {/* Notification Preferences */}
      <section className="section">
        <h2>Notification Preferences</h2>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="email"
            checked={notifications.email}
            onChange={handleNotificationChange}
          />
          Receive alerts via email
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="sms"
            checked={notifications.sms}
            onChange={handleNotificationChange}
          />
          Get urgent alerts via SMS
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="push"
            checked={notifications.push}
            onChange={handleNotificationChange}
          />
          Real-time browser alerts
        </label>
        <button className="preview-btn">Preview Notifications</button>
      </section>

      {/* Language */}
      <section className="section">
        <h2>Language</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="English">English</option>
          <option value="Kiswahili">Kiswahili</option>
        </select>
      </section>

      {/* Progressive Web App */}
      <section className="section">
        <h2>Progressive Web App</h2>
        <p>Install ForestGuard KE on your device for quick access and offline functionality.</p>
        <button className="install-btn">Install App</button>
      </section>

      {/* Subscription */}
      <section className="section subscription-section">
        <h2>Subscription</h2>
        <p className="subscription-plan">Premium Plan</p>
        <p>Advanced alerts & analytics</p>
        <p className="subscription-status">Active</p>
        <p>Billing Cycle</p>
        <p>Monthly</p>
        <p>Next Billing</p>
        <p>Dec 17, 2025</p>
        <button className="manage-subscription-btn">Manage Subscription</button>
      </section>

      {/* Danger Zone */}
      <section className="section danger-zone">
        <h2>Danger Zone</h2>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button className="delete-btn">Delete Account</button>
      </section>
    </div>
  );
}

export default Settings;
