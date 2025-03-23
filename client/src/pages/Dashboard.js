import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Dashboard</h1>

      <button onClick={() => navigate("/documents")} style={{ margin: "10px", padding: "10px" }}>
        My Documents
      </button>

      <button onClick={() => navigate("/shared-with-me")} style={{ margin: "10px", padding: "10px" }}>
        Shared with Me
      </button>
    </div>
  );
};

export default Dashboard;



