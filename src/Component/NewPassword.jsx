import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NewPassword.css";
import resetImg from "../assets/reset.png";
import logo from "../assets/logo.png";
import axios from "axios";

const NewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 Animated popup state (same as GetStarted)
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const email =
    location.state?.email || localStorage.getItem("resetEmail");
  const resetCode =
    location.state?.resetCode ||
    localStorage.getItem("verifiedResetCode");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword || formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!email || !resetCode) {
      setPopup({
        show: true,
        message: "Session expired. Please restart reset process.",
        success: false,
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/auth/reset-password",
        {
          email,
          resetCode,
          newPassword: formData.newPassword,
        }
      );

      if (res.data.success) {
        setPopup({
          show: true,
          message: "Password reset successfully!",
          success: true,
        });

        localStorage.removeItem("resetEmail");
        localStorage.removeItem("verifiedResetCode");

        setTimeout(() => {
          navigate("/passwordresetsuccess");
        }, 1500);
      }
    } catch (err) {
      setPopup({
        show: true,
        message:
          err.response?.data?.error ||
          "Failed to reset password",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-container">
      <div className="password-card">
        <div className="password-logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="password-image">
          <img src={resetImg} alt="reset" />
        </div>

        <h2 className="password-title">SET A NEW PASSWORD</h2>

        <p className="password-subtitle">
          Create a new password. Ensure it differs from previous ones.
        </p>

        <label className="input-label">Enter Password</label>
        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Enter Password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            👁️
          </span>
        </div>
        {errors.newPassword && (
          <div className="input-error">{errors.newPassword}</div>
        )}

        <label className="input-label">Re-enter Password</label>
        <div className="input-box">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Re-enter Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            👁️
          </span>
        </div>
        {errors.confirmPassword && (
          <div className="input-error">
            {errors.confirmPassword}
          </div>
        )}

        <button
          className="update-btn"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* 🔥 SAME GETSTARTED ANIMATED POPUP */}
      {popup.show && (
        <div className="ca-popup-overlay">
          <div className="ca-popup-card">
            <div
              className={`ca-icon-box ${
                popup.success ? "success" : "error"
              }`}
            >
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
              onClick={() =>
                setPopup({ ...popup, show: false })
              }
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPassword;
