import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AllTransactions.css";
import { getCoinIcon } from "../utils/coinIcons";
import bankWithdrawalIcon from "../assets/bank.png";
import paypalIcon from "../assets/paypal.png";
import spinWheelIcon from "../assets/spinandwin.png";
import tradeIcon from "../assets/trade.png";

/* ================= DISPLAY NAMES CONSTANT ================= */
const displayNames = {
  'BTC': 'Bitcoin',
  'BNB': 'Binance Coin',
  'USDT_TRC20': 'USDT (TRC20)',
  'TRX': 'TRON',
  'USDT_BEP20': 'USDT (BEP20)',
  'ETH': 'Ethereum',
  'SOL': 'Solana',
  'XRP': 'Ripple',
  'DOGE': 'Dogecoin',
  'LTC': 'Litecoin'
};

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20my%20transaction%20history%20on%20InstaCoinXPay.", "_blank");
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

/* ================= SPIN WHEEL NAVIGATION BUTTON ================= */
const SpinWheelNavButton = ({
  position = "right",
  bottom = "180px",
  right = "30px",
  left = "auto",
  size = "60px",
  pulseEffect = true,
  className = "",
  style = {}
}) => {
  const navigate = useNavigate();

  const positionStyles = position === "left"
    ? { left: left || "20px", right: "auto" }
    : { right: right || "20px", left: "auto" };

  const combinedStyles = {
    position: 'fixed',
    bottom: bottom,
    width: size,
    height: size,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #f7931a, #c8930a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4)',
    zIndex: 9998,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    border: '3px solid rgba(255, 215, 0, 0.6)',
    overflow: 'hidden',
    padding: '0px',
    ...positionStyles,
    ...style
  };

  React.useEffect(() => {
    if (!document.querySelector('#spin-wheel-nav-keyframes-transactions')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'spin-wheel-nav-keyframes-transactions';
      styleSheet.textContent = `
        @keyframes spinWheelNavPulse {
          0% { box-shadow: 0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4), 0 0 0 0 rgba(247, 147, 26, 0.7); }
          70% { box-shadow: 0 8px 35px rgba(247, 147, 26, 0.7), 0 0 30px rgba(200, 147, 10, 0.6), 0 0 0 15px rgba(247, 147, 26, 0); }
          100% { box-shadow: 0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4), 0 0 0 0 rgba(247, 147, 26, 0); }
        }
        @keyframes spinWheelNavGlow {
          0% { filter: drop-shadow(0 0 5px #f7931a); }
          50% { filter: drop-shadow(0 0 15px #c8930a); }
          100% { filter: drop-shadow(0 0 5px #f7931a); }
        }
        @keyframes spinWheelNavRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-wheel-nav-float {
          animation: ${pulseEffect ? 'spinWheelNavPulse 2s infinite, spinWheelNavGlow 3s infinite' : 'none'};
        }
        .spin-wheel-nav-float:hover {
          transform: scale(1.15) rotate(10deg) !important;
          background: radial-gradient(circle at 30% 30%, #ffd700, #f7931a) !important;
          box-shadow: 0 10px 40px rgba(247, 147, 26, 0.8), 0 0 35px rgba(255, 215, 0, 0.7) !important;
        }
        .spin-wheel-nav-float:hover .wheel-icon-image {
          transform: scale(1.2) rotate(15deg) !important;
        }
        .wheel-icon-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, [pulseEffect]);

  const handleClick = () => {
    navigate('/spinwheel');
  };

  return (
    <button
      onClick={handleClick}
      className={`spin-wheel-nav-float ${className}`}
      style={combinedStyles}
      aria-label="Go to Fortune Wheel"
      title="🎡 Spin & Win Rewards!"
    >
      <img
        src={spinWheelIcon}
        alt="Fortune Wheel"
        className="wheel-icon-image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          transition: 'transform 0.3s ease',
          transform: 'scale(1.1)'
        }}
      />
      <div style={{
        position: 'absolute',
        inset: '-6px',
        borderRadius: '50%',
        border: '3px solid rgba(255, 215, 0, 0.5)',
        borderTopColor: '#f7931a',
        borderRightColor: '#ffd700',
        borderBottomColor: '#f7931a',
        borderLeftColor: '#ffd700',
        opacity: 0.9,
        animation: 'spinWheelNavRotate 4s linear infinite',
        pointerEvents: 'none',
        boxShadow: '0 0 15px rgba(247, 147, 26, 0.6)'
      }} />
      <div style={{
        position: 'absolute',
        inset: '2px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />
    </button>
  );
};

/* ================= HELPERS ================= */
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const normalizeStatus = (tx) => {
  const status = tx.status?.toLowerCase();
  if (status === "completed") return "Successful";
  if (status === "failed") return "Failed";
  return "Pending";
};

const isReferralReward = (tx) => {
  try {
    const notes = typeof tx.notes === "string" ? JSON.parse(tx.notes) : tx.notes;
    return notes?.type === "REFERRAL_REWARD";
  } catch {
    return false;
  }
};

const getTypeLabel = (type, tx) => {
  if (isReferralReward(tx)) return "Referral Reward";
  const t = type?.toLowerCase();
  if (t === "send") return "Send";
  if (t === "receive") return "Receive";
  if (t === "buy") return "Buy";
  if (t === "sell") return "Sell";
  if (t === "paypal_withdrawal") return "PayPal Withdrawal";
  if (t === "bank_withdrawal") return "Bank Withdrawal";
  if (t === "pending") return "Pending";
  return type || "Unknown";
};

const getAmountClass = (type) => {
  const t = type?.toLowerCase();
  if (t === "receive") return "tx-amount-unique received";
  if (t === "sell") return "tx-amount-unique received";
  if (t === "send" || t === "paypal_withdrawal" || t === "bank_withdrawal")
    return "tx-amount-unique sent";
  if (t === "buy") return "tx-amount-unique buy";
  return "tx-amount-unique pending";
};

const getTypeClass = (type) => {
  const t = type?.toLowerCase();
  if (t === "receive") return "tx-type-unique received";
  if (t === "sell") return "tx-type-unique received";
  if (t === "send" || t === "paypal_withdrawal" || t === "bank_withdrawal")
    return "tx-type-unique sent";
  if (t === "buy") return "tx-type-unique buy";
  return "tx-type-unique pending";
};

/* ================= COMPONENT ================= */
const AllTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const fetchGroupedTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      
      // If no token, redirect to login (don't clear data, just redirect)
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("🔍 Fetching transactions from backend...");
      const res = await axios.get(
        "https://backend-instacoinpay-1.onrender.com/api/history/grouped/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Backend response:", res.data?.data?.length || 0, "transactions");

      // Normalize API dates with formatDate
      const normalized = (res.data?.data || []).map((group) => ({
        date: formatDate(group.date),
        items: (group.items || []).map((tx, index) => ({
          id:            tx.id || `${group.date}-${index}`,
          type:          tx.type || "Unknown",
          coin:          tx.coin || "N/A",
          to:            tx.to || "—",
          fullAddress:   tx.fullAddress,
          amount:        tx.amount,
          sub:           tx.sub || "",
          status:        normalizeStatus(tx),
          confirmations: tx.confirmations || null,
          notes:         tx.notes || null,
        })),
      }));

      // Load trading history from localStorage (cached trades from current session)
      const localHistory = JSON.parse(localStorage.getItem("crypto_history") || "[]");
      console.log("📦 Local history (cached):", localHistory.length, "trades");

      // Group local history by date
      const groupedLocal = {};

      localHistory.forEach(trade => {
        const date = formatDate(trade.date);
        if (!groupedLocal[date]) groupedLocal[date] = [];

        const tradeTypeLower = trade.type?.toLowerCase();
        const formattedAmount = tradeTypeLower === "buy"
          ? `-$${trade.total}`
          : `+$${trade.total}`;

        groupedLocal[date].push({
          id: trade.id,
          type: trade.type,
          coin: trade.symbol,
          to: "Trading Panel",
          fullAddress: "Trading Panel",
          amount: formattedAmount,
          sub: `${trade.coinAmount} ${trade.displayName || trade.symbol}`,
          status: "Successful",
          confirmations: null,
          notes: null,
          isTrading: true,
          originalTrade: {
            id:          trade.id,
            type:        trade.type,
            symbol:      trade.symbol,
            displayName: trade.displayName || trade.symbol,
            coinAmount:  trade.coinAmount,
            price:       trade.price       ?? 0,
            total:       trade.total       ?? "0.00",
            time:        trade.time        || "",
            date:        trade.date,
            status:      trade.status      || "completed",
          }
        });
      });

      const formattedLocal = Object.keys(groupedLocal).map(date => ({
        date,
        items: groupedLocal[date]
      }));

      // Merge both sources
      const mergedMap = {};

      [...formattedLocal, ...normalized].forEach(group => {
        if (!mergedMap[group.date]) {
          mergedMap[group.date] = [];
        }
        mergedMap[group.date].push(...group.items);
      });

      const allTransactions = Object.keys(mergedMap).map(date => ({
        date,
        items: mergedMap[date],
      }));

      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("✅ Total transactions displayed:", allTransactions.length);
      setTransactions(allTransactions);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err);
      
      // Handle unauthorized error - just redirect, don't clear data
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedTransactions();
  }, []);

  return (
    <>
      <div className="tx-wrapper-unique">
        <div className="tx-card-unique">
          <div className="tx-header-unique">
            <span className="tx-back-unique" onClick={() => navigate(-1)}>←</span>
            <h2>All Transactions</h2>
          </div>

          {loading && <p className="tx-loading-unique">Loading...</p>}
          {error   && <p className="tx-error-unique">{error}</p>}

          {transactions.map((group) => (
            <div key={group.date}>
              <p className="tx-date-unique">{group.date}</p>

              {group.items.map((tx) => {
                const isBankWithdrawal =
                  tx.type === "BANK_WITHDRAWAL" ||
                  tx.fullAddress === "BANK_WITHDRAWAL";

                const isPaypalWithdrawal =
                  tx.type === "PAYPAL_WITHDRAWAL" ||
                  tx.to === "PayPal" ||
                  tx.fullAddress === "PayPal";

                const isTradingTransaction = tx.isTrading === true;
                const isReferral = isReferralReward(tx);

                return (
                  <div
                    key={tx.id}
                    className="tx-row-unique clickable"
                    onClick={() => {
                      if (isTradingTransaction) {
                        if (tx.originalTrade && tx.originalTrade.symbol) {
                          navigate('/trading-receipt', { state: tx.originalTrade });
                        } else {
                          const fallbackTrade = {
                            id:          tx.id,
                            type:        tx.type,
                            symbol:      tx.coin,
                            displayName: displayNames[tx.coin] || tx.coin,
                            coinAmount:  tx.sub?.split(" ")[0] || "0",
                            price:       0,
                            total:       String(tx.amount).replace(/[^0-9.]/g, "") || "0.00",
                            date:        new Date().toISOString(),
                            status:      "completed",
                          };
                          navigate('/trading-receipt', { state: fallbackTrade });
                        }
                        return;
                      }

                      if (isBankWithdrawal) {
                        navigate("/bankwithdrawalreceipt", {
                          state: { transferId: tx.id },
                        });
                        return;
                      }

                      if (isPaypalWithdrawal) {
                        const payload = {
                          transferId:    tx.id,
                          transactionId: tx.id,
                          asset:         tx.coin?.toLowerCase() || "btc",
                          amount:        Number(tx.sub?.split(" ")[0]) || 0,
                          usdAmount:     Number(String(tx.amount).replace(/[^0-9.]/g, "")) || 0,
                          paypalEmail:   tx.to || "—",
                          confirmations: tx.confirmations || [false, false, false, false],
                        };
                        sessionStorage.setItem("paypalReceipt", JSON.stringify(payload));
                        navigate("/paypalwithdrawalreceipt", { state: payload });
                        return;
                      }

                      navigate(`/transaction/${tx.id}`, { state: tx });
                    }}
                  >
                    <div className="tx-left-unique">
                      <div className="tx-icon-unique">
                        {isReferral ? (
                          <span style={{ fontSize: "28px", lineHeight: 1 }}>🎁</span>
                        ) : isTradingTransaction ? (
                          // Use trade.jpg icon for all trading transactions
                          <img
                            src={tradeIcon}
                            alt="Trading"
                            className="tx-coin-img-unique"
                            style={{
                              width: '32px',
                              height: '32px',
                              objectFit: 'cover',
                              borderRadius: '50%'
                            }}
                          />
                        ) : (
                          <img
                            src={
                              isBankWithdrawal
                                ? bankWithdrawalIcon
                                : isPaypalWithdrawal
                                ? paypalIcon
                                : getCoinIcon(tx.coin, tx.sub)
                            }
                            alt={tx.coin}
                            className="tx-coin-img-unique"
                          />
                        )}
                      </div>

                      <div>
                        <strong className={getTypeClass(tx.type)}>
                          {getTypeLabel(tx.type, tx)}
                        </strong>

                        <span>
                          {isReferral
                            ? `TxID: ${tx.to}`
                            : isTradingTransaction
                            ? `${tx.type?.toLowerCase() === "buy" ? "Bought" : "Sold"} ${tx.sub}`
                            : tx.type?.toLowerCase() === "receive"
                            ? `From: ${tx.to}`
                            : `To: ${tx.to}`}
                        </span>
                      </div>
                    </div>

                    <div className="tx-right-unique">
                      <span className={getAmountClass(tx.type)}>
                        {tx.amount}
                      </span>

                      {tx.sub && <small>{tx.sub}</small>}

                      <small className={`tx-status-unique ${tx.status.toLowerCase()}`}>
                        {tx.status}
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <FloatingSupportButtons />
      <SpinWheelNavButton
        position="right"
        bottom="180px"
        right="30px"
        pulseEffect={true}
        size="60px"
      />
    </>
  );
};

export default AllTransactions;