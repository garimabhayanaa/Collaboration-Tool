import React from "react";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user) {
        const uid = user.uid;
        const email = user.email;

        try {
          // Create or fetch user in MongoDB
          const response = await fetch("http://localhost:5001/api/user/create-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, email }),
          });
          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem("user", JSON.stringify(userData));
            navigate("/dashboard");
          } else {
            alert("Error creating user.");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          alert("Error connecting to the server.");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>CoCreate</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
