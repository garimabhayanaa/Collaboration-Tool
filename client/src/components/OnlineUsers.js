import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../stylesheets/OnlineUsers.css";

const OnlineUsers = ({ documentId, user }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.emit("join-document", documentId, user);

    socket.on("update-users", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.emit("leave-document", documentId, user);
      socket.disconnect();
    };
  }, [documentId, user]);

  // Function to get initials from email
  const getInitials = (email) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="online-users-container">
      <h3 className="online-users-title">Online Users</h3>
      {users.length > 0 ? (
        <ul className="online-users-list">
          {users.map((u) => (
            <li key={u.uid} className="online-users-item">
              <div className="online-users-avatar">
                {getInitials(u.email)}
              </div>
              <span className={u.uid === user.uid ? "online-users-name online-users-you" : "online-users-name"}>
                {u.email} {u.uid === user.uid ? "(You)" : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="online-users-empty">No one else is online.</p>
      )}
    </div>
  );
};

export default OnlineUsers;
