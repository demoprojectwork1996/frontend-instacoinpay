import React, { useState, useEffect } from "react";
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

  // ✅ Crisp Chat Integration
  useEffect(() => {
    // IMPORTANT: $crisp array and WEBSITE_ID must be set BEFORE the script tag loads
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = "b5635951-f13a-4b92-95d7-c1e3666f3abf";

    // Queue chat:show BEFORE script loads — Crisp reads this queue on init
    window.$crisp.push(["do", "chat:show"]);

    if (!document.querySelector('script[src="https://client.crisp.chat/l.js"]')) {
      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // Hide bubble when navigating away from this page
    return () => {
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:hide"]);
      }
    };
  }, []);

  // ✅ Pass user email to Crisp if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && window.$crisp) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.email) {
          window.$crisp.push(["set", "user:email", userData.email]);
          if (userData.name) {
            window.$crisp.push(["set", "user:nickname", userData.name]);
          }
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  // Telegram handler
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

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
        const user = res.data.data;

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userReferralCode", user.referralCode);

        // ✅ Pass user email to Crisp after successful login
        if (window.$crisp) {
          window.$crisp.push(["set", "user:email", user.email]);
          window.$crisp.push(["set", "user:nickname", user.name]);
        }
      }

      setPopup({
        show: true,
        message: "Login successful",
        success: true,
      });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setPopup({
        show: true,
        message:
          error.response?.data?.error || "Invalid email or password",
        success: false,
      });
    }
  };

  return (
    <>
      <div className="lp-container">
        <div className="lp-card">
          <span className="getstarted-back" onClick={() => navigate(-1)}>←</span>

          <div className="lp-top-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="lp-coin-wrapper">
            <img src={coin} alt="coin" />
          </div>

          <h2 className="lp-title">Login</h2>

          <div className="lp-form-box">
            <div className="lp-form-group">
              <label className="lp-label">Email</label>
              <input
                type="email"
                className="lp-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="lp-form-group">
              <label className="lp-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="lp-input"
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

            <p className="lp-forgot-password">
              <button
                className="lp-link-btn-forgot"
                onClick={() => navigate("/forgotpassword")}
              >
                Forgot Password?
              </button>
            </p>

            <button className="lp-login-btn" onClick={handleLogin}>
              Login
            </button>
          </div>

          <p className="lp-login-link">
            Don't have an account?{" "}
            <button
              className="lp-link-btn"
              onClick={() => navigate("/getstarted")}
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* ANIMATED POPUP */}
        {popup.show && (
          <div className="lp-popup-overlay">
            <div className="lp-popup-card">
              <div className={`lp-icon-box ${popup.success ? "success" : "error"}`}>
                <svg viewBox="0 0 100 100" className="lp-icon">
                  <circle cx="50" cy="50" r="45" className="lp-circle" />
                  <path
                    className="lp-path"
                    d={
                      popup.success
                        ? "M30 52 L45 65 L70 38" // Checkmark
                        : "M35 35 L65 65 M65 35 L35 65" // X mark
                    }
                  />
                </svg>
              </div>

              <p className="lp-popup-text">{popup.message}</p>
              <h2>{localStorage.getItem("userName")}</h2>

              <button
                className="lp-ok-btn"
                onClick={() => setPopup({ ...popup, show: false })}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FLOATING SUPPORT BUTTON - Telegram Only */}
      <div className="floating-support-buttons">
        <button className="float-btn telegram-float" onClick={handleTelegramClick} aria-label="Telegram Support">
          <svg className="float-icon" viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.2-.07-.06-.18-.04-.26-.02-.11.02-1.86 1.18-5.26 3.48-.5.34-.95.51-1.35.5-.44-.01-1.3-.25-1.93-.46-.78-.26-1.4-.4-1.35-.84.03-.23.35-.47.96-.72 3.76-1.64 6.27-2.72 7.53-3.23 3.58-1.46 4.33-1.71 4.81-1.72.11 0 .35.02.51.16.13.11.17.26.19.4.01.06.02.19-.01.33z"/>
          </svg>
          <span className="float-label">Telegram Support</span>
        </button>
      </div>
    </>
  );
};

export default LoginPage;