import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("INR");
  const [chartType, setChartType] = useState("candle");
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "";
  const initials = username.substring(0, 2).toUpperCase();

  useEffect(() => {
    // Fetch settings from the backend
    axios
      .get("http://localhost:3002/user/settings")
      .then((res) => {
        setTheme(res.data.theme || "light");
        setCurrency(res.data.currency || "INR");
        setChartType(res.data.chartType || "candle");
        setNotifications(res.data.notifications !== false);
        setLoading(false);

        // Apply theme immediately on load
        if (res.data.theme === "dark") {
          document.body.classList.add("dark-theme");
        } else {
          document.body.classList.remove("dark-theme");
        }
      })
      .catch((err) => {
        console.error("Error loading settings:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    axios
      .put("http://localhost:3002/user/settings", {
        theme,
        currency,
        chartType,
        notifications,
      })
      .then((res) => {
        setSaving(false);
        setSuccessMsg("Settings saved successfully!");
        
        // Apply theme class to body
        if (theme === "dark") {
          document.body.classList.add("dark-theme");
        } else {
          document.body.classList.remove("dark-theme");
        }

        setTimeout(() => setSuccessMsg(""), 3000);
      })
      .catch((err) => {
        console.error("Error saving settings:", err);
        setSaving(false);
        alert("Failed to save settings. Please try again.");
      });
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h4 style={{ fontWeight: "300", color: "#888" }}>Loading settings...</h4>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 20px", maxWidth: "800px" }}>
      <div className="username">
        <h6 style={{ textTransform: "capitalize" }}>Hi, {username}! / Settings</h6>
        <hr className="divider" />
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "12px 20px",
          borderRadius: "6px",
          marginBottom: "20px",
          fontSize: "14px",
          fontWeight: "500",
          border: "1px solid #c3e6cb",
          display: "flex",
          alignItems: "center"
        }}>
          <i className="fa-solid fa-circle-check" style={{ marginRight: "10px", fontSize: "16px" }}></i>
          {successMsg}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", marginTop: "20px" }}>
        
        {/* Profile Card */}
        <div style={{
          flex: "1 1 250px",
          backgroundColor: "var(--card-bg, #fff)",
          border: "1px solid var(--border-color, #e0e0e0)",
          borderRadius: "12px",
          padding: "24px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "rgb(252, 229, 252)",
            color: "rgb(221, 139, 221)",
            fontSize: "24px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto"
          }}>
            {initials}
          </div>
          <h4 style={{ margin: "0 0 4px 0", textTransform: "capitalize", color: "var(--text-color, #333)" }}>{username}</h4>
          <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#888" }}>{email}</p>
          <div style={{ borderTop: "1px solid var(--border-color, #f0f0f0)", paddingTop: "16px", textAlign: "left" }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "var(--text-color, #555)" }}>
              <strong>Status:</strong> <span style={{ color: "#4caf50", fontWeight: "600" }}>Active Trader</span>
            </p>
            <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "var(--text-color, #555)" }}>
              <strong>Account:</strong> Standard Individual
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <div style={{
          flex: "2 1 400px",
          backgroundColor: "var(--card-bg, #fff)",
          border: "1px solid var(--border-color, #e0e0e0)",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <h5 style={{ margin: "0 0 20px 0", color: "var(--text-color, #333)", fontWeight: "500" }}>Preferences</h5>
          
          <form onSubmit={handleSave}>
            {/* Theme Preference */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--text-color, #555)" }}>
                Theme Selection
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: theme === "light" ? "2px solid #4184f3" : "1px solid #ccc",
                    backgroundColor: theme === "light" ? "#ebf3fe" : "#fff",
                    color: theme === "light" ? "#4184f3" : "#555",
                    fontWeight: theme === "light" ? "600" : "normal",
                    cursor: "pointer",
                    flex: "1"
                  }}
                >
                  <i className="fa-solid fa-sun" style={{ marginRight: "8px" }}></i>
                  Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: theme === "dark" ? "2px solid #ff5722" : "1px solid #ccc",
                    backgroundColor: theme === "dark" ? "#fff3ee" : "#fff",
                    color: theme === "dark" ? "#ff5722" : "#555",
                    fontWeight: theme === "dark" ? "600" : "normal",
                    cursor: "pointer",
                    flex: "1"
                  }}
                >
                  <i className="fa-solid fa-moon" style={{ marginRight: "8px" }}></i>
                  Dark Mode
                </button>
              </div>
            </div>

            {/* Preferred Currency */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--text-color, #555)" }}>
                Preferred Currency
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: currency === "INR" ? "2px solid #4184f3" : "1px solid #ccc",
                    backgroundColor: currency === "INR" ? "#ebf3fe" : "#fff",
                    color: currency === "INR" ? "#4184f3" : "#555",
                    fontWeight: currency === "INR" ? "600" : "normal",
                    cursor: "pointer",
                    flex: "1"
                  }}
                >
                  ₹ INR (Indian Rupee)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: currency === "USD" ? "2px solid #4184f3" : "1px solid #ccc",
                    backgroundColor: currency === "USD" ? "#ebf3fe" : "#fff",
                    color: currency === "USD" ? "#4184f3" : "#555",
                    fontWeight: currency === "USD" ? "600" : "normal",
                    cursor: "pointer",
                    flex: "1"
                  }}
                >
                  $ USD (US Dollar)
                </button>
              </div>
            </div>

            {/* Default Chart Type */}
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="chartType" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--text-color, #555)" }}>
                Default Chart Type
              </label>
              <select
                id="chartType"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "var(--input-bg, #fff)",
                  color: "var(--text-color, #333)",
                  outline: "none"
                }}
              >
                <option value="candle">Candlestick Chart</option>
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>

            {/* Notifications Switch */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", padding: "10px 0" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-color, #555)", marginBottom: "4px" }}>
                  Email Notifications
                </label>
                <span style={{ fontSize: "12px", color: "#888" }}>Receive daily summary and trade confirmations</span>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4184f3",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#3570d4"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#4184f3"}
            >
              {saving ? "Saving Changes..." : "Save Preferences"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
