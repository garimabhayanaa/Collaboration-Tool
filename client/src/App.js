import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Editor from "./pages/Editor";
import SharedWithMe from "./pages/SharedWithMe";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/editor/:documentId" element={<Editor />} />
          <Route path="/shared-with-me" element={<SharedWithMe />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
