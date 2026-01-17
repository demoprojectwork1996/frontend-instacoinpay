import React, { useState } from "react";
import "./LoginPage.css";
import logo from "../assets/logo.png";
import coin from "../assets/Cam3.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setPopup({
        show: true,
        message: "Please enter email and password",
        success: false,
      });
      return;
    }

    try {
      const res = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/auth/login",
        { email, password }
      );

      if (res.data.token) {
      localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", email); // ✅ STORE EMAIL
      }

      setPopup({
        show: true,
        message: res.data.message || "Login successful",
        success: true,
      });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setPopup({
        show: true,
        message:
          error.response?.data?.message || "Invalid email or password",
        success: false,
      });
    }
  };

  return (
    <div className="ca-container">
      <div className="ca-card">

        <div className="ca-top-logo-login">
          <img src={logo} alt="logo" />
        </div>

        <div className="ca-coin-wrapper-login">
          <img src={coin} alt="coin" />
        </div>

        <h2 className="ca-title">Login</h2>

        <div className="ca-form-box">
          <div className="ca-form-group">
            <label className="ca-label">Email</label>
            <input
              type="email"
              className="ca-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="ca-form-group">
            <label className="ca-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="ca-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "18px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <p className="ca-forgot-password">
  <button
    className="ca-link-btn-forgot"
    onClick={() => navigate("/forgotpassword")}
  >
    Forgot Password?
  </button>
</p>

          <button className="ca-login-btn" onClick={handleLogin}>
            Login
          </button>
        </div>
        

        <p className="ca-login-link">
          Don’t have an account?{" "}
          <button
            className="ca-link-btn"
            onClick={() => navigate("/getstarted")}
          >
            Sign up here
          </button>
        </p>
      </div>

      {/* ANIMATED POPUP */}
{popup.show && (
  <div className="ca-popup-overlay">
    <div className="ca-popup-card">
      <div className={`ca-icon-box ${popup.success ? "success" : "error"}`}>
        <svg viewBox="0 0 100 100" className="ca-icon">
          <circle cx="50" cy="50" r="45" className="ca-circle" />
          <path
            className="ca-path"
            d={
              popup.success
                ? "M30 52 L45 65 L70 38" // Checkmark
                : "M35 35 L65 65 M65 35 L35 65" // X mark
            }
          />
        </svg>
      </div>

      <p className="ca-popup-text">{popup.message}</p>

      <button
        className="ca-ok-btn"
        onClick={() => setPopup({ ...popup, show: false })}
      >
        OK
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default LoginPage;
