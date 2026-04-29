import React, { useState } from "react";
import "./ForgotPassword.css";
import logo from "../assets/logo.png";
import illustration from "../assets/forgot-illustration.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  // WhatsApp and Telegram handlers
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20password%20recovery%20on%20InstaCoinXPay.", "_blank");
  };

  return (
    <div className="floating-support-buttons">
      <button className="float-btn telegram-float" onClick={handleTelegramClick} aria-label="Telegram Support">
        <svg className="float-icon" viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.2-.07-.06-.18-.04-.26-.02-.11.02-1.86 1.18-5.26 3.48-.5.34-.95.51-1.35.5-.44-.01-1.3-.25-1.93-.46-.78-.26-1.4-.4-1.35-.84.03-.23.35-.47.96-.72 3.76-1.64 6.27-2.72 7.53-3.23 3.58-1.46 4.33-1.71 4.81-1.72.11 0 .35.02.51.16.13.11.17.26.19.4.01.06.02.19-.01.33z"/>
        </svg>
        <span className="float-label">Telegram Support</span>
      </button>
      
      <button className="float-btn whatsapp-float" onClick={handleWhatsAppClick} aria-label="WhatsApp Support">
        <svg className="float-icon" viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm0 18.22c-1.5 0-2.98-.4-4.26-1.17l-.3-.18-3.12.82.83-3.04-.2-.31c-.84-1.34-1.29-2.88-1.29-4.46 0-4.62 3.76-8.38 8.38-8.38 4.62 0 8.38 3.76 8.38 8.38 0 4.62-3.76 8.38-8.38 8.38zm4.59-6.27c-.25-.13-1.5-.74-1.73-.83-.23-.08-.4-.13-.57.13-.17.26-.65.83-.8 1-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.41-.44-.57-.45-.15-.01-.32-.01-.49-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.11 0 1.24.91 2.45 1.04 2.61.13.17 1.79 2.73 4.33 3.83.61.26 1.08.42 1.45.54.61.19 1.16.16 1.6.1.49-.07 1.5-.61 1.71-1.2.21-.59.21-1.09.15-1.2-.07-.1-.23-.17-.48-.3z"/>
        </svg>
        <span className="float-label">WhatsApp Support</span>
      </button>
    </div>
  );
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setPopup({ show: true, message: "Please enter your email", success: false });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setPopup({ show: true, message: "Please enter a valid email", success: false });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/auth/forgot-password",
        { email }
      );

      if (response.data.success) {
        setPopup({ show: true, message: "Reset code sent to your email!", success: true });

        // Store email for verification page
        localStorage.setItem("resetEmail", email);

        setTimeout(() => {
          navigate("/forgotverificationcode", { state: { email } });
        }, 1500);
      }
    } catch (err) {
      setPopup({
        show: true,
        message: err.response?.data?.error || "Failed to send reset code",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="forgot-container">
        <div className="forgot-card">
          <span className="getstarted-back" onClick={() => navigate(-1)}>←</span>
          <div className="forgot-logo">
            <img src={logo} alt="CoinXpay Logo" />
          </div>

          <div className="forgot-image">
            <img src={illustration} alt="Forgot Password" />
          </div>

          <h2 className="forgot-title">Forgot Password</h2>
          <p className="forgot-subtitle">
            Please enter your Email to recover the password
          </p>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            className="reset-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </div>

        {/* ================== ANIMATED POPUP ================== */}
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
                        ? "M30 52 L45 65 L70 38"
                        : "M35 35 L65 65 M65 35 L35 65"
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

      {/* Floating Support Buttons - Telegram & WhatsApp */}
      <FloatingSupportButtons />
    </>
  );
};

export default ForgotPassword;