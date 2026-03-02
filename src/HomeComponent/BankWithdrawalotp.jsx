import React, { useState } from "react";
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

/* ================= WHATSAPP FLOAT ================= */
const WhatsAppFloat = ({
  phoneNumber = "15485825756",
  message = "Hello! I need assistance with withdrawal on InstaCoinXPay.",
  position = "right",
  bottom = "30px",
  right = "30px",
  left = "auto",
  size = "54px",
  iconSize = "28px",
  pulseEffect = true,
  className = "",
  style = {},
}) => {
  const formattedNumber = phoneNumber.replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
    message
  )}`;

  const positionStyles =
    position === "left"
      ? { left: left || "20px", right: "auto" }
      : { right: right || "20px", left: "auto" };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`whatsapp-float ${pulseEffect ? "pulse" : ""} ${className}`}
      style={{
        position: "fixed",
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#25d366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        zIndex: 10000,
        cursor: "pointer",
        textDecoration: "none",
        ...positionStyles,
        ...style,
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
};

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

        <WhatsAppFloat />
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

      <WhatsAppFloat />

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