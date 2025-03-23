import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SharedWithMe = () => {
  const [documents, setDocuments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5001/api/documents/collaborator/${user.email}`)
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch((err) => console.error("Error fetching shared documents:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Shared with Me</h1>
      {documents.length > 0 ? (
        documents.map((doc) => {
          const permission = doc.collaborators.find((c) => c.email === user.email)?.permission;
          return (
            <button key={doc._id} onClick={() => navigate(`/editor/${doc._id}`)} style={{ margin: "10px", padding: "10px" }}>
              Open {doc.title} ({permission})
            </button>
          );
        })
      ) : (
        <p>No shared documents.</p>
      )}
    </div>
  );
};

export default SharedWithMe;
