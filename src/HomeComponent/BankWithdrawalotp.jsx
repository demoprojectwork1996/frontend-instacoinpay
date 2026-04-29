import React, { useState, useEffect } from "react";
import "./BankWithdrawalotp.css";
import coin from "../assets/Cam2.png";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Coin icons for receipt
import btc from "../assets/btc.png";
import eth from "../assets/eth.png";
import bnb from "../assets/bnb.png";
import sol from "../assets/sol.png";
import xrp from "../assets/xrp.png";
import doge from "../assets/doge.png";
import ltc from "../assets/ltc.png";
import trx from "../assets/trx.png";
import usdt from "../assets/usdt.png";
import usdttether from "../assets/usdttether.png";

const VERIFY_OTP_API = "https://backend-instacoinpay-1.onrender.com/api/withdrawals/verify-bank-otp";

const coinIcons = {
  btc,
  eth,
  bnb,
  sol,
  xrp,
  doge,
  ltc,
  trx,
  usdtTron: usdt,
  usdtBnb: usdttether,
};

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  // WhatsApp and Telegram handlers
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20bank%20withdrawal%20OTP%20verification%20on%20InstaCoinXPay.", "_blank");
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

const BankWithdrawalotp = () => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const transferData = location.state || {
    asset: "btc",
    amount: 0.01,
    usdAmount: 500,
    transferId: "TXN-DEMO-123456",
  };

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

  // ✅ Pass user email to Crisp when available
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    
    if (userEmail && window.$crisp) {
      window.$crisp.push(["set", "user:email", userEmail]);
      if (userName) {
        window.$crisp.push(["set", "user:nickname", userName]);
      }
    }
  }, []);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5)
      document.getElementById(`otp-${index + 1}`).focus();
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      return alert("Enter a valid 6-digit OTP");
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        VERIFY_OTP_API,
        {
          otp: enteredOtp,
          transferId: transferData.transferId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setVerifiedData(res.data.data);
        setShowReceipt(true);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || "Invalid or expired reset code"
      );
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (showReceipt) {
    return (
      <>
        <div className="btc-send-page">
          <div className="btc-send-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="bw-otp-popup-overlay">
            <div className="bw-otp-popup-card">
              <div className="bw-otp-icon-box success">
                <svg viewBox="0 0 100 100" className="bw-otp-icon">
                  <circle cx="50" cy="50" r="45" />
                  <path d="M30 52 L45 65 L70 38" />
                </svg>
              </div>

              <h2 className="bw-otp-popup-title">
                Transaction Successful!
              </h2>

              <p className="bw-otp-popup-text">
                Your amount will be credited after successful network confirmation
              </p>

              <button
                className="bw-otp-ok-btn"
                onClick={() =>
                  navigate("/bankwithdrawalreceipt", {
                    state: {
                      ...transferData,
                      ...verifiedData,
                      transferId: verifiedData.transferId,
                    },
                  })
                }
              >
                View Transaction
              </button>
            </div>
          </div>
        </div>

        {/* Floating Support Buttons - Telegram & WhatsApp */}
        <FloatingSupportButtons />
      </>
    );
  }

  return (
    <>
      <div className="bw-otp-container">
        <div className="bw-otp-card">
          <span
            className="bw-otp-back"
            onClick={() => navigate(-1)}
          >
            ←
          </span>

          <div className="bw-otp-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="bw-otp-coin-wrapper">
            <img src={coin} alt="coin" />
          </div>

          <h2 className="bw-otp-title">
            Withdrawal Verification
          </h2>
          <p className="bw-otp-text">
            Enter the 6-digit code sent to your email
          </p>

          <div className="bw-otp-boxes">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
              />
            ))}
          </div>

          <button
            className="bw-otp-submit-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify & Complete Transfer"}
          </button>
        </div>
      </div>

      {/* Floating Support Buttons - Telegram & WhatsApp */}
      <FloatingSupportButtons />

      {showErrorPopup && (
        <div className="bw-otp-popup-overlay">
          <div className="bw-otp-popup-card">
            <div className="bw-otp-icon-box error">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" />
                <path d="M35 35 L65 65 M65 35 L35 65" />
              </svg>
            </div>

            <p className="bw-otp-popup-text">
              {errorMessage}
            </p>

            <button
              className="bw-otp-ok-btn"
              onClick={() => setShowErrorPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BankWithdrawalotp;