import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5001/api/documents/user/${user.uid}`)
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch((err) => console.error("Error fetching documents:", err));
  }, []);

  const createDocument = async (type) => {
    const title = prompt("Enter document title:");
    if (!title) return;

    const response = await fetch("http://localhost:5001/api/documents/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type, owner: user.uid }),
    });

    const newDoc = await response.json();
    setDocuments([...documents, newDoc]);
  };

  const deleteDocument = async (id) => {
    await fetch(`http://localhost:5001/api/documents/delete/${id}`, { method: "DELETE" });
    setDocuments(documents.filter((doc) => doc._id !== id));
  };

  const openDocument = (docId) => {
    navigate(`/editor/${docId}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>My Documents</h1>
      <button onClick={() => createDocument("doc")}>New Doc</button>
      <button onClick={() => createDocument("code")}>New Code Editor</button>
      <button onClick={() => createDocument("spreadsheet")}>New Spreadsheet</button>
      <button onClick={() => createDocument("pdf")}>New PDF</button>

      <ul>
        {documents.map((doc) => (
          <li key={doc._id}>
            {doc.title} ({doc.type}) 
            <button onClick={() => openDocument(doc._id)}>Open</button>
            <button onClick={() => deleteDocument(doc._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Documents;