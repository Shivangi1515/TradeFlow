import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import axios from "axios";
import { API_URL, FRONTEND_URL } from "../config";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Keep local state in sync with DOM body class mutations (like from Settings page)
    const observer = new MutationObserver(() => {
      const isDark = document.body.classList.contains("dark-theme");
      setTheme(isDark ? "dark" : "light");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    // Initial check
    const isDark = document.body.classList.contains("dark-theme");
    setTheme(isDark ? "dark" : "light");

    return () => observer.disconnect();
  }, []);

  const toggleTheme = (e) => {
    e.stopPropagation();
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    // Call API in the background to update preferences in MongoDB
    axios.put(`${API_URL}/user/settings`, { theme: newTheme })
      .catch((err) => console.error("Error syncing theme to DB:", err));
  };

  const username = localStorage.getItem('username') || "User";
  const email = localStorage.getItem('email') || "";
  const initials = username.substring(0, 2).toUpperCase();

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    window.location.href = FRONTEND_URL;
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container" style={{ position: "relative" }}>
      <img src="/logo.png" style={{ width: "50px" }} alt="logo" />
      <div className="menus">
        <ul style={{ display: "flex", alignItems: "center" }}>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/settings"
              onClick={() => handleMenuClick(7)}
            >
              <p className={selectedMenu === 7 ? activeMenuClass : menuClass}>
                Settings
              </p>
            </Link>
        </ul>
        <button 
          onClick={toggleTheme} 
          style={{ 
            background: "transparent", 
            border: "none", 
            cursor: "pointer", 
            marginRight: "15px", 
            marginLeft: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme === "dark" ? "#ffc107" : "#555",
            outline: "none",
            padding: "8px",
            borderRadius: "50%",
            transition: "background 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <Brightness4 /> : <Brightness7 style={{ color: "#f59e0b" }} />}
        </button>
        <hr />
        <div className="profile" onClick={handleProfileClick} style={{ position: "relative" }}>
          <div className="avatar">{initials}</div>
          <p className="username" style={{ textTransform: "capitalize" }}>{username}</p>
        </div>

        {isProfileDropdownOpen && (
          <div className="profile-dropdown" style={{
            position: "absolute",
            right: "0",
            top: "60px",
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "12px",
            minWidth: "180px",
            zIndex: 9999,
            textAlign: "left"
          }}>
            <div style={{ marginBottom: "10px", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#333", textTransform: "capitalize" }}>{username}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#888", wordBreak: "break-all" }}>{email}</p>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#ea4335",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "12px",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#d33828"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#ea4335"}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;