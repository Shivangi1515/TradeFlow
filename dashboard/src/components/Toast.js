import React from "react";
import "./Toast.css";

const Toast = ({ show, message, title }) => {
  return (
    <div className="toast-container">
      <div className={`toast ${show ? "show" : ""}`}>
        <div className="toast-icon">
          <svg viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
        <div className="toast-content">
          <p className="toast-title">{title || "Success"}</p>
          <p className="toast-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
