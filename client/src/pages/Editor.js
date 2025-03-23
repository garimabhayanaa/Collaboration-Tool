import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ThemeToggle from "../components/ThemeToggle";
import Chat from "../components/Chat";
import ChangeLog from "../components/ChangeLog";
import Collaborators from "../components/Collaborators";
import OnlineUsers from "../components/OnlineUsers";
import "../stylesheets/Editor.css";

const socket = io("http://localhost:5001");

const Editor = () => {
  const { documentId } = useParams();
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [permission, setPermission] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    socket.emit("join-document", documentId);

    socket.on("receive-changes", (newContent) => {
      setContent(newContent);
    });

    socket.on("user-typing", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000); // Reset typing status after 1 sec
    });

    // Fetch document content first
    fetch(`http://localhost:5001/api/documents/${documentId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          setContent(data.content);
        }
        
        // Check if current user is the owner
        if (data.owner === user.uid) {
          setPermission("owner");
          return;
        }
        
        // If not the owner, check if they're a collaborator (by email)
        const collaborator = data.collaborators.find(
          c => c.email.toLowerCase() === user.email.toLowerCase()
        );
        
        if (collaborator) {
          setPermission(collaborator.permission);
        } else {
          setPermission("no-access");
        }
      })
      .catch(err => {
        console.error("Error fetching document:", err);
        setPermission("no-access");
      });

    return () => {
      socket.off("receive-changes");
      socket.off("user-typing");
    };
  }, [documentId, user.uid, user.email]);

  // Debounce function to reduce API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const emitChanges = useCallback(
    debounce((newText) => {
      socket.emit("send-changes", { documentId, content: newText });
    }, 500),
    [documentId]
  );

  const handleChange = (e) => {
    setContent(e.target.value);
    socket.emit("user-typing", { documentId });
    emitChanges(e.target.value);
  };

  const handleSave = async () => {
    try {
      // Save document content to database
      await fetch(`http://localhost:5001/api/documents/update/${documentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      // Log the change
      await fetch("http://localhost:5001/api/changelog/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          user: user.uid,
          userEmail: user.email,
          changes: `Saved document: "${content.substring(0, 50)}..."`,
        }),
      });

      alert("Document saved!");
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Error saving document");
    }
  };

  if (permission === null) {
    return <p>Loading...</p>;
  }

  if (permission === "no-access") {
    return <h2>You don't have access to this document.</h2>;
  }

  return (
    <div className="editor-container">
      <ThemeToggle />
      <h1 className="editor-title">Real-Time Editor</h1>
      
      <div className="editor-workspace">
        {(permission === "edit" || permission === "owner") ? (
          <textarea 
            value={content} 
            onChange={handleChange} 
            className="editor-textarea"
          />
        ) : (
          <div className="editor-readonly">
            {content}
          </div>
        )}
        
        <p className={isTyping ? "editor-status typing" : "editor-status"}>
          {isTyping ? "Someone is typing..." : "Synced"}
        </p>

        {(permission === "edit" || permission === "owner") && (
          <button onClick={handleSave} className="editor-save-btn">Save</button>
        )}
      </div>
      
      <div className="editor-components">
        <OnlineUsers documentId={documentId} user={user} />
        <Collaborators documentId={documentId} />
        <Chat documentId={documentId} user={user} />
        <ChangeLog documentId={documentId} />
      </div>
    </div>
  );
};

export default Editor;
