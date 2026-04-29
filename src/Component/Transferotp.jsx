import React, { useState, useEffect } from "react";
import "./Transferotp.css";
import coin from "../assets/Cam2.png";
import logo from "../assets/logo.png";
import API from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";

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

const coinIcons = {
  btc: btc,
  eth: eth,
  bnb: bnb,
  sol: sol,
  xrp: xrp,
  doge: doge,
  ltc: ltc,
  trx: trx,
  usdtTron: usdt,
  usdtBnb: usdttether,
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  // WhatsApp and Telegram handlers
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20OTP%20verification%20for%20transfer%20on%20InstaCoinXPay.", "_blank");
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

const Transferotp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transferData, setTransferData] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedTransfer, setCompletedTransfer] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [receiptDetails, setReceiptDetails] = useState({
    amount: 0,
    usdAmount: 0,
    asset: "",
    assetName: "",
    toAddress: "",
    txId: "",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
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

  // ✅ Pass user email to Crisp when available
  useEffect(() => {
    const storedUserEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    
    if (storedUserEmail && window.$crisp) {
      window.$crisp.push(["set", "user:email", storedUserEmail]);
      if (userName) {
        window.$crisp.push(["set", "user:nickname", userName]);
      }
    }
  }, []);

  // Timer for resend button
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Get data from location state
  useEffect(() => {
    if (location.state) {
      const { transferData, userEmail, coinAmount, usdAmount, assetName, price } = location.state;
      
      if (transferData) {
        setTransferData(transferData);
        // Pre-populate receipt details from the transfer data
        setReceiptDetails({
          amount: coinAmount || transferData.amount,
          usdAmount: usdAmount || (coinAmount * price),
          asset: transferData.asset,
          assetName: assetName || transferData.asset.toUpperCase(),
          toAddress: transferData.toAddress,
          txId: transferData.transferId,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });
      }
      
      if (userEmail) {
        setUserEmail(userEmail);
        localStorage.setItem("userEmail", userEmail);
      } else {
        const savedEmail = localStorage.getItem("userEmail");
        if (savedEmail) {
          setUserEmail(savedEmail);
        }
      }
    } else {
      // If no state data, redirect back
      navigate("/dashboard");
    }
  }, [location, navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    // Auto focus previous input on backspace
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
      const otpArray = pastedData.split("").slice(0, 6);
      setOtp(otpArray);
      setTimeout(() => {
        document.getElementById(`otp-5`).focus();
      }, 0);
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setPopup({ show: true, message: "Please enter complete 6-digit code", success: false });
      return;
    }

    if (!transferData) {
      setPopup({ show: true, message: "Transfer data not found", success: false });
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post(
        "/transfer/verify-otp",
        {
          otp: otpCode,
          transferId: transferData.transferId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCompletedTransfer(res.data.data);
      
      // Update receipt details with actual transfer data from response
      if (res.data.data) {
        setReceiptDetails(prev => ({
          ...prev,
          txId: res.data.data._id || prev.txId,
          status: res.data.data.status || "completed",
        }));
      }
      
      // DIRECTLY SHOW RECEIPT AFTER SUCCESSFUL VERIFICATION
      setShowReceipt(true);

    } catch (error) {
      setPopup({
        show: true,
        message: error.response?.data?.error || "Invalid or expired OTP",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!transferData) {
      setPopup({ show: true, message: "Transfer data not found", success: false });
      return;
    }

    // Check if timer is active
    if (resendTimer > 0) {
      setPopup({
        show: true,
        message: `Please wait ${resendTimer} seconds before requesting again`,
        success: false,
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔄 Resending OTP for transfer:", transferData.transferId);
      
      const response = await API.post(
        "/transfer/resend-otp",
        {
          transferId: transferData.transferId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("✅ Resend OTP response:", response.data);

      // Show success message - BUT DO NOT REDIRECT
      setPopup({
        show: true,
        message: response.data.message || "New OTP sent to your email",
        success: true,
      });

      // Start 60 second timer
      setResendTimer(60);

      // Clear OTP inputs for new code
      setOtp(["", "", "", "", "", ""]);
      
      // Focus first input
      setTimeout(() => {
        document.getElementById(`otp-0`)?.focus();
      }, 100);

    } catch (error) {
      console.error("❌ Resend OTP error:", error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          "Failed to resend OTP. Please try again.";
      
      setPopup({
        show: true,
        message: errorMessage,
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTransaction = () => {
    if (completedTransfer && completedTransfer._id) {
      navigate(`/transaction/${completedTransfer._id}`);
    } else if (transferData && transferData.transferId) {
      navigate(`/transaction/${transferData.transferId}`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleClosePopup = () => {
    setPopup({ ...popup, show: false });
    // DO NOT navigate to dashboard - stay on OTP page
  };

  // If showReceipt is true, directly show the receipt (no OTP input)
  if (showReceipt) {
    const assetIcon = coinIcons[receiptDetails.asset] || coin;
    const formattedAmount = receiptDetails.amount.toFixed(8);
    const formattedUsdAmount = formatCurrency(receiptDetails.usdAmount);

    return (
      <>
        <div className="btc-send-page">
          <div className="btc-send-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="stx-popup-overlay">
            <div className="stx-popup stx-success">
              <div className="stx-icon-box stx-success">
                <svg viewBox="0 0 100 100" className="stx-icon">
                  <circle cx="50" cy="50" r="45" className="stx-circle" />
                  <path
                    className="stx-path"
                    d="M30 52 L45 65 L70 38"
                  />
                </svg>
              </div>

              <h2 className="stx-popup-title">
                Transaction Successful!
              </h2>

              <p className="stx-popup-text">
                Your amount will be credited after successful network confirmation
              </p>

              <button
                className="stx-popup-btn"
                onClick={handleViewTransaction}
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

  // Original OTP input page
  return (
    <>
      <div className="transfer-successful-container">
        <div className="transfer-successful-card">
          <span className="transferotp-back" onClick={() => navigate(-1)}>←</span> 
          
          <div className="transfer-successful-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="transfer-successful-coin-wrapper">
            <img src={coin} alt="bitcoin" />
          </div>

          <h2 className="transfer-successful-title">Transfer Verification</h2>
          <p className="transfer-successful-text">
            We have sent the verification code <br />
            to your email address. Please check your Spam or Junk folder if it doesn't appear shortly.
          </p>

          {/* Email display */}
          {userEmail && (
            <p className="transfer-successful-email">
              <strong>Email:</strong> {userEmail}
            </p>
          )}

          {/* OTP Inputs */}
          <div 
            className="transfer-successful-otp-boxes" 
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
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
            className="transfer-successful-submit-btn" 
            onClick={handleSubmit}
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify & Complete Transfer"}
          </button>

          <p className="transfer-successful-resend-text">
            Didn't receive code?{" "}
            <button 
              className="transfer-successful-resend-btn" 
              onClick={handleResendCode}
              disabled={isLoading || resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
            </button>
          </p>
        </div>

        {/* ANIMATED POPUP */}
        {popup.show && (
          <div className="transfer-successful-popup-overlay">
            <div className="transfer-successful-popup-card">
              <div className={`transfer-successful-icon-box ${popup.success ? "success" : "error"}`}>
                <svg viewBox="0 0 100 100" className="transfer-successful-icon">
                  <circle cx="50" cy="50" r="45" className="transfer-successful-circle" />
                  <path
                    className="transfer-successful-path"
                    d={
                      popup.success
                        ? "M30 52 L45 65 L70 38"
                        : "M35 35 L65 65 M65 35 L35 65"
                    }
                  />
                </svg>
              </div>

              <p className="transfer-successful-popup-text">{popup.message}</p>

              <button
                className="transfer-successful-ok-btn"
                onClick={handleClosePopup}
                disabled={isLoading}
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

export default Transferotp;