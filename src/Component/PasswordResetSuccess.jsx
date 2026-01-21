import React, { useEffect } from "react";
import "./PasswordResetSuccess.css";
import success from "../assets/success.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  // 🔥 SEND MAIL AUTOMATICALLY AFTER PAGE LOAD
  useEffect(() => {
    const email = localStorage.getItem("resetEmail");

    if (email) {
      axios
        .post(
          "https://backend-instacoinpay-1.onrender.com/api/auth/password-reset-success-mail",
          { email }
        )
        .catch(() => {
          // silently fail (do not block UI)
        });
    }
  }, []);

  const handleConfirm = () => {
    localStorage.removeItem("resetEmail");
    localStorage.removeItem("verifiedResetCode");
    navigate("/login");
  };

  return (
    <div className="prs-container">
      <div className="prs-card">
        <div className="prs-logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="prs-icon">
          <img src={success} alt="success" />
        </div>

        <h2 className="prs-title">Password Reset Successful</h2>
        <p className="prs-text">
          Your password has been successfully reset. <br />
          You can now log in with your new password.
        </p>

        <button className="prs-confirm-btn" onClick={handleConfirm}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
