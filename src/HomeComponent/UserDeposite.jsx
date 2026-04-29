import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./UserDeposit.css";

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  // WhatsApp and Telegram handlers
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20my%20deposit%20on%20InstaCoinXPay.", "_blank");
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

export default function UserDeposit() {
  const [wallet, setWallet] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const selected = localStorage.getItem("SELECTED_CURRENCY");

    if (!selected) {
      window.location.href = "/select-deposit-currency";
      return;
    }

    setCurrency(selected);

    const fetchWallet = async () => {
      try {
        const res = await axios.get(
          `https://backend-instacoinpay-1.onrender.com/api/deposit-wallet/${selected}`
        );
        setWallet(res.data.wallet.address);
      } catch {
        setWallet("");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const copyAddress = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setShowPopup(true);
  };

  return (
    <>
      <div className="page">
        <div className="card">
          <span onClick={() => navigate(-1)} className="backBtn">←</span>

          <h2 className="heading">{currency} Deposit</h2>

          {loading && <p>Loading wallet...</p>}

          {!loading && !wallet && (
            <p style={{ color: "red", marginTop: "10px" }}>
              Deposit wallet not available. Contact support.
            </p>
          )}

          <div
            className="timerBox"
            style={{
              background:
                timeLeft <= 60
                  ? "#fee2e2"
                  : timeLeft <= 300
                  ? "#fef3c7"
                  : "#dbeafe",
            }}
          >
            <div className="timerLabel">Pay Within</div>
            <div
              className="timerValue"
              style={{
                color:
                  timeLeft <= 60
                    ? "#dc2626"
                    : timeLeft <= 300
                    ? "#d97706"
                    : "#2563eb",
              }}
            >
              {timeLeft > 0 ? formatTime(timeLeft) : "EXPIRED"}
            </div>
            {timeLeft <= 0 && (
              <div className="expiredText">Please refresh and try again</div>
            )}
          </div>

          {!loading && wallet && (
            <>
              <div className="qrContainer">
                <QRCodeCanvas value={wallet} size={100} />
              </div>

              <p style={{ marginTop: "15px", color: "#64748b", fontSize: "14px" }}>
                <b>Network:</b> {currency}
              </p>

              <div className="addressBox">{wallet}</div>

              <button
                className="copyBtn"
                style={{
                  opacity: timeLeft <= 0 ? 0.5 : 1,
                  cursor: timeLeft <= 0 ? "not-allowed" : "pointer",
                  background: copied ? "#10b981" : "#2563eb",
                }}
                onClick={copyAddress}
                disabled={timeLeft <= 0}
              >
                {copied ? "Copied ✓" : "Copy Address"}
              </button>

              <button
                className="copyBtn"
                style={{
                  opacity: timeLeft <= 0 ? 0.5 : 1,
                  cursor: timeLeft <= 0 ? "not-allowed" : "pointer",
                }}
                onClick={handleConfirmPayment}
                disabled={timeLeft <= 0}
              >
                Confirm Payment
              </button>
            </>
          )}

          {showPopup && (
            <div className="popupOverlay">
              <div className="popupCard">
                <div style={{ marginBottom: "15px" }}>
                  {/* SVG unchanged */}
                </div>

                <h3 className="popupTitle">Payment in Review</h3>

                <p className="popupText">
                  Your payment is under pending review.
                  <br /><br />
                  Send a Payment Screenshot to our WhatsApp Chat Support or Email:
                  <br />
                  <b>instacoinxpay@gmail.com</b>
                  <br />
                  <b>contact@instacoinxpay.com</b>
                </p>

                <button 
                  onClick={() => {
                    setShowPopup(false);
                    navigate("/dashboard");
                  }} 
                  className="popupBtn"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Support Buttons - Telegram & WhatsApp */}
      <FloatingSupportButtons />
    </>
  );
}