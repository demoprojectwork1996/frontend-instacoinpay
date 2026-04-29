import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SendBTC.css";
import logo from "../assets/logo.png";
import spinWheelIcon from "../assets/spinandwin.png";

// Coin icons
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

const API = "https://backend-instacoinpay-1.onrender.com/api/transfer";

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  // WhatsApp and Telegram handlers
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20sending%20crypto%20on%20InstaCoinXPay.", "_blank");
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
  bottom = "180px", // Positioned above WhatsApp button
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
    zIndex: 9998, // Lower than support buttons (9999)
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
    if (!document.querySelector('#spin-wheel-nav-keyframes-sendbtc')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'spin-wheel-nav-keyframes-sendbtc';
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

/* ================= COINS ================= */
const coins = [
  { key: "btc",      label: "Bitcoin",      symbol: "BTC",         icon: btc },
  { key: "eth",      label: "Ethereum",     symbol: "ETH",         icon: eth },
  { key: "bnb",      label: "BNB",          symbol: "BNB",         icon: bnb },
  { key: "sol",      label: "Solana",       symbol: "SOL",         icon: sol },
  { key: "xrp",      label: "XRP",          symbol: "XRP",         icon: xrp },
  { key: "doge",     label: "Dogecoin",     symbol: "DOGE",        icon: doge },
  { key: "ltc",      label: "Litecoin",     symbol: "LTC",         icon: ltc },
  { key: "trx",      label: "TRX",          symbol: "TRX",         icon: trx },
  { key: "usdtTron", label: "USDT (TRON)",  symbol: "USDT-TRC20",  icon: usdttether },
  { key: "usdtBnb",  label: "USDT (BNB)",   symbol: "USDT-BEP20",  icon: usdt },
];

// ✅ ALL possible key variants the API might use for each coin
const BALANCE_KEY_MAP = {
  btc:      ["btc", "BTC"],
  eth:      ["eth", "ETH"],
  bnb:      ["bnb", "BNB"],
  sol:      ["sol", "SOL"],
  xrp:      ["xrp", "XRP"],
  doge:     ["doge", "DOGE"],
  ltc:      ["ltc", "LTC"],
  trx:      ["trx", "TRX"],
  usdtTron: ["usdtTron", "usdtTRON", "usdttron", "USDTTRON", "usdt_tron", "USDT_TRON", "usdtTrc20", "USDT-TRC20"],
  usdtBnb:  ["usdtBnb",  "usdtBNB",  "usdtbnb",  "USDTBNB",  "usdt_bnb",  "USDT_BNB",  "usdtBep20", "USDT-BEP20"],
};

const resolveBalance = (balances, coinKey) => {
  const variants = BALANCE_KEY_MAP[coinKey] || [coinKey];
  for (const v of variants) {
    if (balances[v] !== undefined) {
      console.log(`✅ Balance found under key "${v}":`, balances[v]);
      return balances[v];
    }
  }
  console.warn(`⚠️ No balance found for "${coinKey}". API keys:`, Object.keys(balances));
  return 0;
};

/* ================= FORMAT ================= */
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

export default function SendBTC() {
  const navigate = useNavigate();

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [open, setOpen] = useState(false);

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [availableBTC, setAvailableBTC] = useState("0.00000000");

  /* ================= POPUP ================= */
  const [popup, setPopup] = useState({
    show: false,
    success: false,
    message: "",
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
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    
    if (userEmail && window.$crisp) {
      window.$crisp.push(["set", "user:email", userEmail]);
      if (userName) {
        window.$crisp.push(["set", "user:nickname", userName]);
      }
    }
  }, []);

  /* ================= FETCH BALANCE ================= */
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const balances = res.data.data.walletBalances || {};

      // ✅ Use the key-variant resolver instead of direct lookup
      const bal = resolveBalance(balances, selectedCoin.key);
      setCoinBalance(bal);

      // ✅ Stablecoins are always 1:1 with USD — skip price API entirely
      const STABLECOINS = ["usdtTron", "usdtBnb"];
      if (STABLECOINS.includes(selectedCoin.key)) {
        setPrice(1.00);
        setUsdBalance(bal);
        console.log(`✅ Stablecoin shortcut: usdBalance = ${bal}`);
        return;
      }

      // Get price for non-stablecoins
      try {
        const priceRes = await axios.get(
          `https://backend-instacoinpay-1.onrender.com/api/crypto/price/${selectedCoin.key}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (priceRes.data.success) {
          const currentPrice = priceRes.data.data.price;
          setPrice(currentPrice);
          setUsdBalance(bal * currentPrice);
          if (selectedCoin.key === "btc") setAvailableBTC(bal.toFixed(8));
        }
      } catch {
        const coinId = getCoinGeckoId(selectedCoin.key);
        const priceRes = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price",
          { params: { ids: coinId, vs_currencies: "usd" } }
        );
        const currentPrice = priceRes.data[coinId]?.usd || 0;
        setPrice(currentPrice);
        setUsdBalance(bal * currentPrice);
        if (selectedCoin.key === "btc") setAvailableBTC(bal.toFixed(8));
      }

    } catch (err) {
      console.error("Balance fetch error:", err);
      try {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.walletBalances) {
            // ✅ Also use resolver for localStorage fallback
            const bal = resolveBalance(profile.walletBalances, selectedCoin.key);
            setCoinBalance(bal);
            const STABLECOINS = ["usdtTron", "usdtBnb"];
            const staticPrice = STABLECOINS.includes(selectedCoin.key) ? 1.00 : getStaticPrice(selectedCoin.key);
            setPrice(staticPrice);
            setUsdBalance(bal * staticPrice);
            if (selectedCoin.key === "btc") setAvailableBTC(bal.toFixed(8));
          }
        }
      } catch (e) {
        console.error("LocalStorage fallback error:", e);
      }
    }
  };

  const getCoinGeckoId = (coinKey) => {
    const map = {
      btc: "bitcoin", eth: "ethereum", bnb: "binancecoin",
      sol: "solana", xrp: "ripple", doge: "dogecoin",
      ltc: "litecoin", trx: "tron", usdtTron: "tether", usdtBnb: "tether",
    };
    return map[coinKey] || coinKey;
  };

  const getStaticPrice = (coinKey) => {
    const staticPrices = {
      btc: 85966.43, eth: 2296.54, bnb: 596.78, sol: 172.45,
      xrp: 0.52, doge: 0.12, ltc: 81.34, trx: 0.104,
      usdtTron: 1.00, usdtBnb: 1.00,
    };
    return staticPrices[coinKey] || 0;
  };

  useEffect(() => {
    fetchBalance();
  }, [selectedCoin]);

  /* ================= USD → COIN ================= */
  useEffect(() => {
    if (!amount || !price) { setCoinAmount(0); return; }
    setCoinAmount(Number(amount) / price);
  }, [amount, price]);

  /* ================= MAX ================= */
  const handleMax = () => setAmount(usdBalance.toFixed(2));

  /* ================= WITHDRAW ================= */
  const handleWithdraw = async () => {
    if (!address || !amount) {
      setPopup({ show: true, success: false, message: "Enter address & amount" });
      return;
    }
    if (coinAmount > coinBalance) {
      setPopup({ show: true, success: false, message: "Insufficient balance" });
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        API,
        {
          asset: selectedCoin.key,
          toAddress: address,
          amount: Number(coinAmount.toFixed(8)),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/transferotp", {
        state: {
          transferData: {
            transferId: res.data.data._id,
            asset: selectedCoin.key,
            toAddress: address,
            amount: Number(coinAmount.toFixed(8)),
            requiresOTPVerification: true,
            otpSent: true
          },
          userEmail: localStorage.getItem("userEmail") || "",
          coinAmount,
          usdAmount: amount,
          assetName: selectedCoin.symbol,
          assetIcon: selectedCoin.icon,
          price,
        }
      });
      setAddress("");
      setAmount("");
      fetchBalance();
    } catch (err) {
      setPopup({
        show: true,
        success: false,
        message: err.response?.data?.error || "Transfer Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <div className="cryptotransfer-container">
        <div className="cryptotransfer-logo-box">
          <img src={logo} alt="logo" />
        </div>

        <div className="cryptotransfer-card">
          <span className="sendbtc-back" onClick={() => navigate(-1)}>←</span>
          <h2 className="cryptotransfer-title">SEND</h2>

          <div className="cryptotransfer-input-group">
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Wallet Address"
            />
          </div>

          <div className="cryptotransfer-input-group">
            <label>Network</label>
            <div className="cryptotransfer-network-selector" onClick={() => setOpen(!open)}>
              <div className="cryptotransfer-selected-network">
                <img src={selectedCoin.icon} alt="" />
                <span>{selectedCoin.symbol}</span>
              </div>
              <span className={`cryptotransfer-dropdown-arrow ${open ? "cryptotransfer-arrow-rotated" : ""}`}>▼</span>
            </div>
            {open && (
              <div className="cryptotransfer-network-options">
                {coins.map((coin) => (
                  <div
                    key={coin.key}
                    className="cryptotransfer-network-option"
                    onClick={() => { setSelectedCoin(coin); setOpen(false); }}
                  >
                    <div className="cryptotransfer-coin-preview">
                      <img src={coin.icon} alt={coin.symbol} />
                      <div className="cryptotransfer-coin-details">
                        <strong>{coin.symbol}</strong>
                        <small>{coin.label}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cryptotransfer-input-group">
            <label>Withdrawal Amount</label>
            <div className="cryptotransfer-amount-wrapper">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              <div className="cryptotransfer-amount-buttons">
                <span>USD</span>
                <span className="cryptotransfer-max-amount" onClick={handleMax}>MAX</span>
              </div>
            </div>
            <small>≈ {coinAmount.toFixed(8)} {selectedCoin.symbol}</small>
          </div>

          <div className="cryptotransfer-balance-info">
            <span>Available</span>
            <span>{formatCurrency(usdBalance)} {selectedCoin.symbol}</span>
          </div>

          {selectedCoin.key === "btc" && (
            <div className="cryptotransfer-balance-info" style={{ marginTop: "5px", fontSize: "12px", color: "#666" }}>
              <span>≈ {availableBTC} BTC</span>
            </div>
          )}

          <p className="cryptotransfer-note">
            * Make sure the address matches the selected network.
          </p>

          <div className="cryptotransfer-btn-container">
            <button
              className="cryptotransfer-proceed-btn"
              onClick={handleWithdraw}
              disabled={loading}
            >
              {loading ? "Processing..." : "Transfer Amount"}
            </button>
          </div>
        </div>

        {popup.show && (
          <div className="cryptotransfer-popup-overlay">
            <div className="cryptotransfer-popup-card">
              <div className={`cryptotransfer-icon-box ${popup.success ? "success" : "error"}`}>
                <svg viewBox="0 0 100 100" className="cryptotransfer-icon">
                  <circle cx="50" cy="50" r="45" className="cryptotransfer-circle" />
                  {popup.success ? (
                    <path className="cryptotransfer-path" d="M30 52 L45 65 L70 38" />
                  ) : (
                    <>
                      <path className="cryptotransfer-path" d="M35 35 L65 65" />
                      <path className="cryptotransfer-path" d="M65 35 L35 65" />
                    </>
                  )}
                </svg>
              </div>
              <p className="cryptotransfer-popup-text">{popup.message}</p>
              <button className="cryptotransfer-ok-btn" onClick={() => setPopup({ ...popup, show: false })}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Support Buttons - Telegram & WhatsApp (Bottom) */}
      <FloatingSupportButtons />
      
      {/* Spin Wheel Navigation Button - Positioned ABOVE WhatsApp button */}
      <SpinWheelNavButton 
        position="right"
        bottom="180px"
        right="30px"
        pulseEffect={true}
        size="60px"
      />
    </>
  );
}