import React, { useState, useEffect } from "react";
import "./Apps.css";

const PARTNER_APPS = [
  {
    id: "smallcase",
    name: "Smallcase",
    category: "investing",
    icon: "fa-solid fa-briefcase",
    iconColor: "#2e7d32",
    bgColor: "#e6f7ed",
    description: "Invest in diversified, thematic baskets of stocks and ETFs managed by SEBI registered experts.",
    scopes: ["View your holdings", "View your margin available", "Place and execute buy/sell orders"]
  },
  {
    id: "sensibull",
    name: "Sensibull",
    category: "options",
    icon: "fa-solid fa-chart-line",
    iconColor: "#1a73e8",
    bgColor: "#e8f0fe",
    description: "India's largest options trading platform. Analyze, backtest, and trade option strategies with ease.",
    scopes: ["View your holdings", "View your active positions", "Place options orders"]
  },
  {
    id: "streak",
    name: "Streak",
    category: "algorithmic",
    icon: "fa-solid fa-bolt",
    iconColor: "#7b1fa2",
    bgColor: "#f3e5f5",
    description: "Create, backtest, and deploy algorithmic trading strategies and scanners in minutes without writing code.",
    scopes: ["View your active positions", "Access historical transaction logs", "Place algorithmic order requests"]
  },
  {
    id: "goldenpi",
    name: "GoldenPi",
    category: "investing",
    icon: "fa-solid fa-coins",
    iconColor: "#e65100",
    bgColor: "#fff3e0",
    description: "India's first online platform for bonds and debentures. Earn steady yields on corporate debts.",
    scopes: ["View your margin available", "Place primary market bids"]
  },
  {
    id: "tijori",
    name: "Tijori Finance",
    category: "analysis",
    icon: "fa-solid fa-magnifying-glass-chart",
    iconColor: "#37474f",
    bgColor: "#eceff1",
    description: "Uncover fundamental insights, sector exposures, market share graphs, and forensic metrics for Indian stocks.",
    scopes: ["View your holdings", "View your transactions history"]
  }
];

const Apps = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [connectedApps, setConnectedApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [ssoStep, setSsoStep] = useState("auth"); // "auth", "loading", "success"

  useEffect(() => {
    // Read connected apps from localStorage on mount
    const saved = localStorage.getItem("tradeflow_connected_apps");
    if (saved) {
      try {
        setConnectedApps(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse connected apps:", e);
      }
    }
  }, []);

  const saveConnections = (newList) => {
    setConnectedApps(newList);
    localStorage.setItem("tradeflow_connected_apps", JSON.stringify(newList));
  };

  const handleConnectClick = (app) => {
    if (connectedApps.includes(app.id)) {
      // Disconnect
      const confirmDisconnect = window.confirm(`Are you sure you want to disconnect ${app.name}?`);
      if (confirmDisconnect) {
        const updated = connectedApps.filter((id) => id !== app.id);
        saveConnections(updated);
      }
    } else {
      // Initiate SSO Popup flow
      setSelectedApp(app);
      setSsoStep("auth");
      setConnecting(true);
    }
  };

  const handleAuthorize = () => {
    setSsoStep("loading");
    // Simulate API connection latency
    setTimeout(() => {
      setSsoStep("success");
      setTimeout(() => {
        const updated = [...connectedApps, selectedApp.id];
        saveConnections(updated);
        setConnecting(false);
        setSelectedApp(null);
      }, 1000);
    }, 1500);
  };

  const filteredApps = PARTNER_APPS.filter(
    (app) => activeCategory === "all" || app.category === activeCategory
  );

  return (
    <div className="apps-container">
      <div className="apps-header">
        <h6>Ecosystem Partner Apps</h6>
        <p>Authorize and launch third-party trading, backtesting, and research companion apps using your TradeFlow account credentials.</p>
        <hr className="divider" style={{ marginTop: "15px", marginBottom: "0", height: "0.8px" }} />
      </div>

      {/* Category Tabs */}
      <div className="apps-filters">
        <button
          className={`filter-btn ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All Applications
        </button>
        <button
          className={`filter-btn ${activeCategory === "investing" ? "active" : ""}`}
          onClick={() => setActiveCategory("investing")}
        >
          <i className="fa-solid fa-wallet me-1"></i> Investing
        </button>
        <button
          className={`filter-btn ${activeCategory === "options" ? "active" : ""}`}
          onClick={() => setActiveCategory("options")}
        >
          <i className="fa-solid fa-chart-pie me-1"></i> Derivatives
        </button>
        <button
          className={`filter-btn ${activeCategory === "algorithmic" ? "active" : ""}`}
          onClick={() => setActiveCategory("algorithmic")}
        >
          <i className="fa-solid fa-code me-1"></i> Algorithmic
        </button>
        <button
          className={`filter-btn ${activeCategory === "analysis" ? "active" : ""}`}
          onClick={() => setActiveCategory("analysis")}
        >
          <i className="fa-solid fa-magnifying-glass me-1"></i> Research
        </button>
      </div>

      {/* Grid of Apps */}
      <div className="apps-grid">
        {filteredApps.map((app) => {
          const isConnected = connectedApps.includes(app.id);

          return (
            <div className="app-card" key={app.id}>
              <div>
                <div className="app-card-top">
                  <div
                    className="app-icon"
                    style={{ backgroundColor: app.bgColor, color: app.iconColor }}
                  >
                    <i className={app.icon}></i>
                  </div>
                  <div className="app-details">
                    <h5 className="app-name">{app.name}</h5>
                    <span className={`app-badge ${app.category}`}>{app.category}</span>
                  </div>
                </div>
                <p className="app-description">{app.description}</p>
              </div>

              <div className="app-card-bottom">
                <button
                  onClick={() => handleConnectClick(app)}
                  className={`connect-btn ${isConnected ? "connected" : ""}`}
                >
                  {isConnected ? (
                    <span>
                      <i className="fa-solid fa-circle-check me-1"></i> Connected (Disconnect)
                    </span>
                  ) : (
                    "Connect App"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Single Sign-On Modal Overlay */}
      {connecting && selectedApp && (
        <div className="modal-overlay">
          <div className="sso-modal">
            {ssoStep === "auth" && (
              <>
                <div className="sso-logo-box">
                  <div style={{ width: "40px", height: "40px", backgroundColor: "#ebf3fe", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "600", color: "#4184f3" }}>
                    TF
                  </div>
                  <i className="fa-solid fa-arrow-right-arrow-left sso-connector"></i>
                  <div
                    className="sso-logo-item"
                    style={{ backgroundColor: selectedApp.bgColor, color: selectedApp.iconColor }}
                  >
                    <i className={selectedApp.icon}></i>
                  </div>
                </div>
                <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "var(--text-color, #333)" }}>
                  Link {selectedApp.name} to TradeFlow
                </h5>
                <p style={{ fontSize: "12px", color: "#777", marginBottom: "20px" }}>
                  Connect your account to allow {selectedApp.name} to query your portfolio and execute orders on your behalf.
                </p>
                <div className="sso-permissions">
                  <h6 className="fw-semibold" style={{ fontSize: '13px', marginBottom: '8px' }}>Requested Permissions:</h6>
                  <ul>
                    {selectedApp.scopes.map((scope, idx) => (
                      <li key={idx} style={{ marginBottom: "4px" }}>{scope}</li>
                    ))}
                  </ul>
                </div>

                <div className="sso-actions">
                  <button className="sso-btn cancel" onClick={() => setConnecting(false)}>
                    Cancel
                  </button>
                  <button className="sso-btn authorize" onClick={handleAuthorize}>
                    Authorize Access
                  </button>
                </div>
              </>
            )}

            {ssoStep === "loading" && (
              <div style={{ padding: "40px 0" }}>
                <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "36px", color: "#4184f3", marginBottom: "16px" }}></i>
                <h5 style={{ fontSize: "15px", fontWeight: "500", color: "var(--text-color, #555)", margin: 0 }}>
                  Connecting your TradeFlow account...
                </h5>
              </div>
            )}

            {ssoStep === "success" && (
              <div style={{ padding: "30px 0" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#e6f7ed", color: "#4caf50", fontSize: "24px", display: "flex", alignItems: "center", justifyContext: "center", margin: "0 auto 16px auto", justifyContent: "center" }}>
                  <i className="fa-solid fa-check"></i>
                </div>
                <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#2e7d32", margin: "0 0 4px 0" }}>
                  App Connected!
                </h5>
                <p style={{ fontSize: "12px", color: "#777", margin: 0 }}>
                  Account authorization successful.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Apps;