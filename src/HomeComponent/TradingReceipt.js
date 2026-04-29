import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TradingReceipt.css";

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20my%20trading%20transaction%20on%20InstaCoinXPay.", "_blank");
  };

  return (
    <div className="tr-floating-support-buttons">
      <button className="tr-float-btn tr-telegram-float" onClick={handleTelegramClick} aria-label="Telegram Support">
        <svg className="tr-float-icon" viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.2-.07-.06-.18-.04-.26-.02-.11.02-1.86 1.18-5.26 3.48-.5.34-.95.51-1.35.5-.44-.01-1.3-.25-1.93-.46-.78-.26-1.4-.4-1.35-.84.03-.23.35-.47.96-.72 3.76-1.64 6.27-2.72 7.53-3.23 3.58-1.46 4.33-1.71 4.81-1.72.11 0 .35.02.51.16.13.11.17.26.19.4.01.06.02.19-.01.33z"/>
        </svg>
        <span className="tr-float-label">Telegram Support</span>
      </button>
      
      <button className="tr-float-btn tr-whatsapp-float" onClick={handleWhatsAppClick} aria-label="WhatsApp Support">
        <svg className="tr-float-icon" viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm0 18.22c-1.5 0-2.98-.4-4.26-1.17l-.3-.18-3.12.82.83-3.04-.2-.31c-.84-1.34-1.29-2.88-1.29-4.46 0-4.62 3.76-8.38 8.38-8.38 4.62 0 8.38 3.76 8.38 8.38 0 4.62-3.76 8.38-8.38 8.38zm4.59-6.27c-.25-.13-1.5-.74-1.73-.83-.23-.08-.4-.13-.57.13-.17.26-.65.83-.8 1-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.41-.44-.57-.45-.15-.01-.32-.01-.49-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.11 0 1.24.91 2.45 1.04 2.61.13.17 1.79 2.73 4.33 3.83.61.26 1.08.42 1.45.54.61.19 1.16.16 1.6.1.49-.07 1.5-.61 1.71-1.2.21-.59.21-1.09.15-1.2-.07-.1-.23-.17-.48-.3z"/>
        </svg>
        <span className="tr-float-label">WhatsApp Support</span>
      </button>
    </div>
  );
};

/* ================= HELPER FUNCTIONS ================= */

const formatCoinDisplay = (symbol) => {
  if (!symbol) return "";
  
  const symbolLower = symbol.toLowerCase();
  
  if (symbolLower === "usdt_trc20") return "USDT-TRC20";
  if (symbolLower === "usdt_bep20") return "USDT-BEP20";
  if (symbolLower === "btc") return "BTC";
  if (symbolLower === "eth") return "ETH";
  if (symbolLower === "bnb") return "BNB";
  if (symbolLower === "sol") return "SOL";
  if (symbolLower === "xrp") return "XRP";
  if (symbolLower === "doge") return "DOGE";
  if (symbolLower === "ltc") return "LTC";
  if (symbolLower === "trx") return "TRX";
  
  return symbol.toUpperCase();
};

// ✅ Helper to safely format numbers
const safeToFixed = (value, decimals = 2) => {
  if (value === undefined || value === null) return "0.00";
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00";
  return num.toFixed(decimals);
};

/* ================= MAIN COMPONENT ================= */

const TradingReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [trade, setTrade] = useState(null);
  const [copied, setCopied] = useState("");

  // ✅ Crisp Chat Integration
  useEffect(() => {
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = "b5635951-f13a-4b92-95d7-c1e3666f3abf";
    window.$crisp.push(["do", "chat:show"]);

    if (!document.querySelector('script[src="https://client.crisp.chat/l.js"]')) {
      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      document.head.appendChild(script);
    }

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
    // Get trade data from location state
    const tradeData = location.state;
    
    if (tradeData && tradeData.symbol) {
      setTrade(tradeData);
    } else {
      // Try to get from localStorage as fallback
      const savedTrade = localStorage.getItem("lastTrade");
      if (savedTrade) {
        const parsed = JSON.parse(savedTrade);
        if (parsed.symbol) {
          setTrade(parsed);
        } else {
          navigate("/tradingpanel");
        }
      } else {
        navigate("/tradingpanel");
      }
    }
  }, [location, navigate]);

  const copy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1200);
  };

  // ✅ SAFETY GUARD - Check if trade data is valid
  if (!trade || !trade.symbol) {
    return (
      <div className="tr-trading-receipt-page">
        <div className="tr-receipt-card">
          <h2 className="tr-receipt-title">No Trade Data</h2>
          <p style={{ color: '#9ca3af', textAlign: 'center', margin: '20px 0' }}>
            Unable to load trade details. Please try again.
          </p>
          <button
            className="tr-receipt-back-btn"
            onClick={() => navigate("/history")}
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const {
    id,
    type,
    symbol,
    coinAmount,
    price,
    total,
    date,
    status = "completed"
  } = trade;

  const formattedCoin = formatCoinDisplay(symbol);
  
  // ✅ Safely format numbers with fallbacks
  const formattedCoinAmount = safeToFixed(coinAmount, 8);
  const formattedPrice = safeToFixed(price, 2);
  const formattedTotal = safeToFixed(total, 2);
  
  const formattedDate = date
    ? new Date(date).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "--";

  return (
    <>
      <div className="tr-trading-receipt-page">
        <div className="tr-receipt-card">
          <h2 className="tr-receipt-title">
            Trading Receipt
          </h2>
          
          <div className={`tr-receipt-amount ${type === "Buy" ? "tr-buy" : "tr-sell"}`}>
            {type === "Buy" ? "+" : "-"} {formattedCoinAmount} {formattedCoin}
          </div>

          {/* STATUS */}
          <div className={`tr-status-wrapper ${status}`}>
            {status === "pending" && <div className="tr-loader" />}
            {status === "completed" && (
              <div className="tr-status-icon tr-success">✔</div>
            )}
            {status === "failed" && (
              <div className="tr-status-icon tr-failed">✖</div>
            )}
            <div className="tr-status-text">
              {status === "completed"
                ? "Trade Executed Successfully"
                : status === "failed"
                ? "Trade Failed"
                : "Processing"}
            </div>
          </div>

          {/* STATUS MESSAGE */}
          <div className="tr-receipt-info">
            {status === "completed" && (
              type === "Buy"
                ? `You have successfully purchased ${formattedCoinAmount} ${formattedCoin}.`
                : `You have successfully sold ${formattedCoinAmount} ${formattedCoin}.`
            )}
            {status === "pending" &&
              "Your trade is being processed."}
            {status === "failed" &&
              "Your trade failed. Please try again or contact support."}
          </div>

          <div className="tr-receipt-divider" />

          {/* TRADE TYPE BADGE */}
          <div className="tr-receipt-row tr-trade-type-row">
            <span>Trade Type</span>
            <strong className={type === "Buy" ? "tr-buy-type" : "tr-sell-type"}>
              {type}
            </strong>
          </div>

          {/* TRANSACTION ID */}
          <div className="tr-receipt-row">
            Transaction ID
            <strong>
              {id || "N/A"}
              {id && (
                <button onClick={() => copy(id.toString(), "txid")}>
                  📋
                </button>
              )}
              {copied === "txid" && (
                <span className="tr-copy-toast">Copied!</span>
              )}
            </strong>
          </div>

          {/* ASSET DETAILS */}
          <div className="tr-receipt-row">
            Asset
            <strong>
              {formattedCoin}
            </strong>
          </div>

          {/* AMOUNT DETAILS */}
          <div className="tr-receipt-row">
            Amount
            <strong>
              {formattedCoinAmount} {formattedCoin}
            </strong>
          </div>

          {/* PRICE */}
          <div className="tr-receipt-row">
            Price
            <strong>
              ${formattedPrice}
            </strong>
          </div>

          {/* TOTAL VALUE */}
          <div className="tr-receipt-row">
            Total Value
            <strong>
              ${formattedTotal} USD
            </strong>
          </div>

          {/* ✅ NO TRADING FEE SECTION - ZERO FEES */}

          {/* DATE */}
          <div className="tr-receipt-row">
            Date & Time
            <strong>
              {formattedDate}
            </strong>
          </div>

          {/* ZERO FEE NOTIFICATION */}
          <div className="tr-zero-fee-notice">
            <span className="tr-zero-fee-icon">✨</span>
            <span className="tr-zero-fee-text">0% Trading Fee - No charges applied</span>
          </div>

          <div className="tr-receipt-buttons">
            <button
              className="tr-receipt-back-btn"
              onClick={() => navigate("/tradingpanel")}
            >
              Back to Trading
            </button>
            <button
              className="tr-receipt-history-btn"
              onClick={() => navigate("/history")}
            >
              View All Transactions
            </button>
          </div>
        </div>
      </div>

      {/* Floating Support Buttons - Telegram & WhatsApp */}
      <FloatingSupportButtons />
    </>
  );
};

export default TradingReceipt;