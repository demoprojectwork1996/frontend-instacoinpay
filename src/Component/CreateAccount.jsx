import React, { useState, useEffect } from "react";
import "./CreateAccount.css";
import logo from "../assets/logo.png";
import coin from "../assets/Cam1.png";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CreateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get country and referral code from previous step
  const { country, referralCode: initialReferralCode } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const [isLoading, setIsLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      return "All fields are required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      setPopup({ show: true, message: validationError, success: false });
      return;
    }

    if (!country) {
      setPopup({
        show: true,
        message: "Please complete the 'Get Started' step first",
        success: false,
      });
      setTimeout(() => navigate("/get-started"), 2000);
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        country,
        referralCode: initialReferralCode || undefined,
      };

      const res = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/auth/register",
        registrationData
      );

      if (res.data.success) {
        // store email for verification page
        localStorage.setItem("verificationEmail", formData.email);

        setPopup({
          show: true,
          message: "OTP sent to your email. Please verify.",
          success: true,
        });

        setTimeout(() => {
          navigate("/verificationcode", {
            state: { email: formData.email },
          });
        }, 1500);
      }
    } catch (error) {
      let errorMessage = "Registration failed";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setPopup({ show: true, message: errorMessage, success: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="create-account-container">
        <div className="create-account-card">
          <span className="getstarted-back" onClick={() => navigate(-1)}>←</span>

          {/* Header Logo */}
          <div className="create-account-top-logo">
            <img src={logo} alt="InstaCoinXPay" />
          </div>

          <h1 className="create-account-title">CREATE ACCOUNT</h1>

          {/* Show selected country */}
          {country && (
            <div className="create-account-country-display">
              <span>Country: <strong>{country}</strong></span>
              {initialReferralCode && (
                <span> | Referral Code: <strong>{initialReferralCode}</strong></span>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="create-account-form-box">
            <div className="create-account-form-group">
              <label className="create-account-label">Full Name</label>
              <input
                className="create-account-input"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="create-account-form-group">
              <label className="create-account-label">Email</label>
              <input
                className="create-account-input"
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Password Field with Eye Icon */}
            <div className="create-account-form-group">
              <label className="create-account-label">Enter Password</label>
              <div className="password-input-container">
                <input
                  className="create-account-input password-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field with Eye Icon */}
            <div className="create-account-form-group">
              <label className="create-account-label">Re-enter Password</label>
              <div className="password-input-container">
                <input
                  className="create-account-input password-input"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button 
            className="create-account-continue-btn" 
            onClick={handleRegister} 
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Continue"}
          </button>

          {/* Login Link */}
          <p className="create-account-login-link">
            Already have an account?{" "}
            <button className="create-account-link-btn" onClick={() => navigate("/login")}>
              Login here
            </button>
          </p>

        </div>

        {/* ANIMATED POPUP */}
        {popup.show && (
          <div className="create-account-popup-overlay">
            <div className="create-account-popup-card">
              <div className={`create-account-icon-box ${popup.success ? "success" : "error"}`}>
                <svg viewBox="0 0 100 100" className="create-account-icon">
                  <circle cx="50" cy="50" r="45" className="create-account-circle" />
                  <path
                    className="create-account-path"
                    d={popup.success ? "M30 52 L45 65 L70 38" : "M35 35 L65 65 M65 35 L35 65"}
                  />
                </svg>
              </div>
              <p className="create-account-popup-text">{popup.message}</p>
              <button
                className="create-account-ok-btn"
                onClick={() => setPopup({ ...popup, show: false })}
                disabled={isLoading}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateAccount;