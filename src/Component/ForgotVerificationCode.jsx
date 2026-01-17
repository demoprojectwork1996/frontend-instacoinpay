import React, { useState, useEffect } from "react";
import "./VerificationCode.css";
import coin from "../assets/Cam2.png";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ForgotVerificationCode = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // 📧 Get email
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      localStorage.setItem("resetEmail", location.state.email);
    } else {
      const savedEmail = localStorage.getItem("resetEmail");
      if (savedEmail) setEmail(savedEmail);
    }

    // Start 30-second countdown for resend
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      setTimeout(() => {
        document.getElementById("otp-5").focus();
      }, 0);
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setPopup({
        show: true,
        message: "Please enter complete 6-digit code",
        success: false,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/auth/verify-reset-code",
        { 
          email, 
          resetCode: otpCode 
        }
      );

      if (response.data.success) {
        setPopup({
          show: true,
          message: "OTP verified successfully",
          success: true,
        });

        // ✅ Store verification data and redirect
        localStorage.setItem("verifiedResetCode", otpCode);
        
        setTimeout(() => {
          navigate("/newpassword", {
            state: { 
              email,
              resetCode: otpCode 
            }
          });
        }, 1500);
      }
    } catch (err) {
      setPopup({
        show: true,
        message: err.response?.data?.error || "Invalid or expired code",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setCanResend(false);
    setCountdown(30);

    try {
      const response = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/auth/forgot-password",
        { email }
      );

      if (response.data.success) {
        setPopup({
          show: true,
          message: "New reset code sent to your email",
          success: true,
        });

        // Start countdown again
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      setPopup({
        show: true,
        message: err.response?.data?.error || "Failed to resend code",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        {/* Logo */}
        <div className="verify-logo">
          <img src={logo} alt="logo" />
        </div>

        {/* Coin Image */}
        <div className="coin-wrapper">
          <img src={coin} alt="coin" />
        </div>

        <h2 className="verify-title">Verification Code</h2>
        <p className="verify-text">
          We have sent the verification code <br />
          to your email address
        </p>

        {email && (
          <p className="verify-email">
            <strong>Email:</strong> {email}
          </p>
        )}

        {/* OTP Inputs */}
        <div className="otp-boxes" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoFocus={index === 0}
              disabled={isLoading}
            />
          ))}
        </div>

        <button
          className={`submit-btn ${isLoading ? 'loading' : ''}`}
          onClick={handleSubmit}
          disabled={otp.join("").length !== 6 || isLoading}
        >
          {isLoading ? "Verifying..." : "Submit"}
        </button>

        <p className="resend-text">
          Didn't receive code?{" "}
          {canResend ? (
            <button 
              className="resend-btn" 
              onClick={handleResendCode}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend Code"}
            </button>
          ) : (
            <span className="countdown-text">
              Resend in {countdown}s
            </span>
          )}
        </p>
      </div>

      {/* ================= ANIMATED POPUP ================= */}
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
                ? "M30 52 L45 65 L70 38" // ✔
                : "M35 35 L65 65 M65 35 L35 65" // ❌
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

export default ForgotVerificationCode;