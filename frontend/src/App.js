import React, { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from "./Auth";
import API from "./api";

function App({ onLogin, onLogout }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      // Send Google credential to backend
      const res = await API.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
      onLogin?.(user);
      navigate("/home");
      console.log("User info:", user);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("token");
    onLogout?.();
    navigate("/");
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center flex-column"
      style={{
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        color: "white",
      }}
    >
      <h1 className="mb-4 fw-bold" style={{ fontSize: "2.5rem" }}>
        💰 AI Finance Tracker
      </h1>

      {!user ? (
        <div className="card shadow-lg p-5 text-center" style={{ borderRadius: "20px", width: "380px", background: "white", color: "#333" }}>
          <h3 className="mb-3 fw-semibold">Welcome 👋</h3>
          <p className="mb-4 text-muted">Track your finances smartly with AI insights.<br />Sign in with Google to continue.</p>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Login Failed")}
            width="300"
          />
        </div>
      ) : (
        <div className="card shadow-lg p-4 d-flex flex-row align-items-center gap-3" style={{ borderRadius: "20px", background: "white", color: "#333" }}>
          <img src={user.picture} alt="profile" className="rounded-circle" style={{ width: "55px", border: "2px solid #2a5298" }} />
          <div>
            <h5 className="mb-1 fw-bold">{user.name}</h5>
            <button className="btn btn-sm btn-outline-danger mt-2" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

const Home = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Auth />} />
    </Routes>
  </BrowserRouter>
);

export default Home;
