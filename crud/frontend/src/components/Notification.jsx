// src/components/Notification.jsx
import React from "react";
import "./Notification.css"; // Import the CSS file

const Notification = ({ type, message }) => {
  let style = "notification";
  let icon;

  switch (type) {
    case "success":
      style += " notification-success";
      icon = (
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className="notification-icon"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 13l4 4L19 7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
      break;
    case "info":
      style += " notification-info";
      icon = (
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className="notification-icon"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
      break;
    case "warning":
      style += " notification-warning";
      icon = (
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className="notification-icon"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
      break;
    case "error":
      style += " notification-error";
      icon = (
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className="notification-icon"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 9v2m0 4h.01m21-12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
      break;
    default:
      return null;
  }

  return (
    <div role="alert" className={style}>
      {icon}
      <p className="notification-message">{message}</p>
    </div>
  );
};

export default Notification;
