// src/App.jsx
import React, { useState, useEffect } from "react";
import StudentList from "./components/StudentList";
import TeacherList from "./components/TeacherList";
import Notification from "./components/Notification";
import "./App.css"; // Keep your main app styles
import "./components/Notification.css"; // Import notification styles

function App() {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (type, message) => {
    const newNotification = { type, message, id: Date.now() }; // Add a unique ID
    setNotifications([...notifications, newNotification]);
    setTimeout(() => {
      setNotifications(
        notifications.filter((n) => n.id !== newNotification.id)
      );
    }, 3000); // Clear after 3 seconds
  };

  return (
    <div className="container">
      <h1>School Management System</h1>
      <div className="notification-container">
        {notifications.map((note) => (
          <Notification key={note.id} type={note.type} message={note.message} />
        ))}
      </div>
      <StudentList showNotification={showNotification} />
      <TeacherList showNotification={showNotification} />
    </div>
  );
}

export default App;
