import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import logo from "../assets/logo.png";
import chip from "../assets/silver_qr.png";
import sendarrow from "../assets/send.png";
import receivearrow from "../assets/recieve-arrow.png";
import buyarrow from "../assets/buy.png";
import historyarrow from "../assets/history.png";
import tradearrow from "../assets/trade.png"; // ✅ NEW: trade icon
import Card from "../assets/cards-dashboard/Card";
import { getCryptoIcon } from "../config/cryptoIcons";
import spinWheelIcon from "../assets/spinandwin.png";
import { logout, clearUserData } from "../utils/authUtils"; // ✅ ADD THIS IMPORT

// Static fallback data
const STATIC_ASSETS = [
  {
    name: "BTC",
    symbol: "btc",
    sub: "Bitcoin",
    price: 85966.43,
    balance: 0.0665,
    change: -0.17,
    balanceValue: 5713.45
  },
  {
    name: "USDT",
    symbol: "usdtBnb",
    sub: "Tether BEP-20",
    price: 1.0,
    balance: 8766.42,
    change: 0.0,
    balanceValue: 8766.42
  }
];

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20my%20dashboard%20on%20InstaCoinXPay.", "_blank");
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
    if (!document.querySelector('#spin-wheel-nav-keyframes-dashboard')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'spin-wheel-nav-keyframes-dashboard';
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

  const handleClick = () => navigate('/spinwheel');

  return (
    <button
      onClick={handleClick}
      className={`spin-wheel-nav-float ${className}`}
      style={combinedStyles}
      aria-label="Spin the Fortune Wheel"
      title="🎡 Spin & Win Rewards!"
    >
      <img 
        src={spinWheelIcon} 
        alt="Fortune Wheel"
        className="wheel-icon-image"
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', transition: 'transform 0.3s ease', transform: 'scale(1.1)' }}
      />
      <div style={{
        position: 'absolute', inset: '-6px', borderRadius: '50%',
        border: '3px solid rgba(255, 215, 0, 0.5)',
        borderTopColor: '#f7931a', borderRightColor: '#ffd700',
        borderBottomColor: '#f7931a', borderLeftColor: '#ffd700',
        opacity: 0.9, animation: 'spinWheelNavRotate 4s linear infinite',
        pointerEvents: 'none', boxShadow: '0 0 15px rgba(247, 147, 26, 0.6)'
      }} />
      <div style={{
        position: 'absolute', inset: '2px', borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.3)', opacity: 0.5, pointerEvents: 'none'
      }} />
    </button>
  );
};

const getDisplayName = (symbol = "") => {
  const s = symbol.toLowerCase();
  if (s.startsWith("usdt")) return "USDT";
  return s.toUpperCase();
};

const mapCardType = (cardType = "") => {
  const t = cardType.toLowerCase();
  if (t.includes("merchant")) return "merchant";
  if (t.includes("classic")) return "classic";
  if (t.includes("prime")) return "prime";
  if (t.includes("platinum")) return "platinum";
  if (t.includes("elite")) return "elite";
  return "classic";
};

// ✅ Map dashboard symbol → TradingPanel symbol key
const mapDashboardSymbolToTrading = (symbol = "") => {
  const s = symbol.toLowerCase();
  if (s === "btc") return "BTC";
  if (s === "eth") return "ETH";
  if (s === "bnb") return "BNB";
  if (s === "sol") return "SOL";
  if (s === "xrp") return "XRP";
  if (s === "doge") return "DOGE";
  if (s === "ltc") return "LTC";
  if (s === "trx") return "TRX";
  if (s.startsWith("usdt") && s.includes("trc")) return "USDT_TRC20";
  if (s.startsWith("usdt")) return "USDT_BEP20";
  return s.toUpperCase();
};

const ADMIN_EMAIL = "bitabox860@gmail.com";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [tickerData, setTickerData] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [loading, setLoading] = useState({
    dashboard: false,
    ticker: false,
    portfolio: false,
    balance: false,
  });
  const [userProfile, setUserProfile] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [totalBalance, setTotalBalance] = useState("$0");
  const [userAssets, setUserAssets] = useState([]);
  const [dataSource, setDataSource] = useState("live");
  const [lastUpdate, setLastUpdate] = useState("");
  
  const [cardData, setCardData] = useState(() => {
    const savedCard = localStorage.getItem("userCardData");
    return savedCard ? JSON.parse(savedCard) : null;
  });

  const isAdmin = userEmail === ADMIN_EMAIL;

  // ✅ ADD THIS: Handle logout function
  const handleLogout = async () => {
    await logout(navigate);
  };

  // ✅ ADD THIS: Handle logout from sidebar (closes sidebar first)
  const handleSidebarLogout = async () => {
    closeSidebar();
    await logout(navigate);
  };

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
      if (window.$crisp) window.$crisp.push(["do", "chat:hide"]);
    };
  }, []);

  useEffect(() => {
    if (userEmail && window.$crisp) {
      window.$crisp.push(["set", "user:email", userEmail]);
      if (userProfile?.fullName) {
        window.$crisp.push(["set", "user:nickname", userProfile.fullName]);
      }
    }
  }, [userEmail, userProfile]);

  /* ================= FETCH DEBIT CARD ================= */
  const fetchDebitCard = async () => {
    try {
      if (!userEmail) return;
      const res = await axios.get(
        `https://backend-instacoinpay-1.onrender.com/api/debit-card/by-email/${userEmail}`,
        { withCredentials: true }
      );
      if (res.data.success && res.data.data) {
        setCardData(res.data.data);
        localStorage.setItem("userCardData", JSON.stringify(res.data.data));
      }
    } catch (err) {
      if (err.response?.status === 404) {
        if (!localStorage.getItem("userCardData")) setCardData(null);
      } else {
        console.error("Error fetching debit card:", err);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(amount);
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;

      const res = await axios.get(
        `https://backend-instacoinpay-1.onrender.com/api/auth/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setUserProfile(res.data.data);
        localStorage.setItem("userProfile", JSON.stringify(res.data.data));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  // ✅ FIXED: Persist real dashboard balances with protection against trade overwrite
  const persistBalancesForTrading = (assets, totalUsdValue) => {
    try {
      const existingBalance = localStorage.getItem('dashboard_trading_usd_balance');
      const lastTradeSync = localStorage.getItem('dashboard_trading_last_sync');

      // 🧠 Prevent overwrite if trade happened recently
      if (existingBalance && lastTradeSync) {
        const lastSyncTime = new Date(lastTradeSync).getTime();
        const now = new Date().getTime();
        const secondsAgo = (now - lastSyncTime) / 1000;

        if (secondsAgo < 120) {
          console.log('⛔ Skipping dashboard overwrite (recent trade)');
          return;
        }
      }

      // ✅ Normal sync
      const tradingPortfolio = {};
      assets.forEach(asset => {
        const tradingKey = mapDashboardSymbolToTrading(asset.symbol);
        const coinBalance = asset.balance ?? 0;
        if (coinBalance > 0) {
          tradingPortfolio[tradingKey] = coinBalance;
        }
      });

      localStorage.setItem('dashboard_trading_portfolio', JSON.stringify(tradingPortfolio));
      localStorage.setItem('dashboard_trading_usd_balance', totalUsdValue.toString());
      localStorage.setItem('dashboard_trading_last_sync', new Date().toISOString());

      console.log('✅ Dashboard sync updated');
    } catch (err) {
      console.error('Sync error:', err);
    }
  };

  // ================= FETCH DASHBOARD DATA =================
  const fetchDashboardData = async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      const token = localStorage.getItem("token");
      if (!token) return applyStaticData();

      const response = await axios.get(
        "https://backend-instacoinpay-1.onrender.com/api/crypto/dashboard",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) return applyStaticData();

      const assets = response.data.data.assets || [];

      const mappedAssets = assets.map(asset => ({
        icon: getCryptoIcon(asset.symbol),
        name: getDisplayName(asset.symbol),
        symbol: asset.symbol.toLowerCase(),
        sub: asset.name,
        price: formatCurrency(asset.currentPrice),
        rawChange: asset.priceChangePercentage24h,
        change: formatPercentage(asset.priceChangePercentage24h),
        balanceText: formatCurrency(asset.balance * asset.currentPrice),
        usdValue: asset.balanceValue,
        originalAsset: asset
      }));

      setUserAssets(mappedAssets);

      const totalUsd = assets.reduce((sum, a) => sum + (a.balanceValue || 0), 0);
      setTotalBalance(formatCurrency(totalUsd));
      setLastUpdate(new Date().toLocaleTimeString());
      setDataSource("live");

      // ✅ Sync real balances to localStorage for TradingPanel
      persistBalancesForTrading(assets, totalUsd);

    } catch (err) {
      applyStaticData();
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  // Use static data as fallback — also sync to localStorage
  const applyStaticData = () => {
    setDataSource("static");
    setLastUpdate(new Date().toLocaleTimeString());

    const assetsWithIcons = STATIC_ASSETS.map(asset => ({
      ...asset,
      icon: getCryptoIcon(asset.symbol),
      price: formatCurrency(asset.price),
      balanceValue: asset.balanceValue,
      change: formatPercentage(asset.change)
    }));

    setUserAssets(assetsWithIcons);

    const total = STATIC_ASSETS.reduce((sum, asset) => sum + asset.balanceValue, 0);
    setTotalBalance(formatCurrency(total));

    // Sync static portfolio for TradingPanel
    const staticPortfolio = {};
    STATIC_ASSETS.forEach(asset => {
      const tradingKey = mapDashboardSymbolToTrading(asset.symbol);
      staticPortfolio[tradingKey] = asset.balance;
    });
    localStorage.setItem('dashboard_trading_portfolio', JSON.stringify(staticPortfolio));
    localStorage.setItem('dashboard_trading_usd_balance', total.toString());
  };

  // Fetch Live Ticker Data
  const fetchTickerData = async () => {
    try {
      setLoading(prev => ({ ...prev, ticker: true }));
      const token = localStorage.getItem("token");

      const makeStaticTicker = () => STATIC_ASSETS.map(asset => ({
        symbol: asset.name, name: asset.sub, price: asset.price,
        change: 0, changePercent: asset.change, volume: 0, marketCap: 0
      }));

      if (!token) { setTickerData(makeStaticTicker()); return; }

      const response = await axios.get("https://backend-instacoinpay-1.onrender.com/api/crypto/ticker", {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        timeout: 8000
      });

      if (response.data.success && response.data.data) {
        setTickerData(response.data.data);
        localStorage.setItem('cryptoPrices', JSON.stringify(response.data.data));
      } else {
        setTickerData(makeStaticTicker());
      }
    } catch (error) {
      console.log("Error fetching ticker:", error.message);
      setTickerData(STATIC_ASSETS.map(asset => ({
        symbol: asset.name, name: asset.sub, price: asset.price,
        change: 0, changePercent: asset.change, volume: 0, marketCap: 0
      })));
    } finally {
      setLoading(prev => ({ ...prev, ticker: false }));
    }
  };

  // Fetch Wallet Balance
  const fetchWalletBalance = async () => {
    try {
      setLoading(prev => ({ ...prev, balance: true }));
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("https://backend-instacoinpay-1.onrender.com/api/transfer/balance", {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        setWalletBalance(response.data.data);
        localStorage.setItem('walletBalance', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.log("Error fetching wallet balance:", error.message);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
  }, []);

  const refreshAllData = () => {
    fetchDashboardData();
    fetchTickerData();
    fetchWalletBalance();
  };

  useEffect(() => {
    refreshAllData();
    fetchDebitCard();
    fetchUserProfile();

    const intervalId = setInterval(() => {
      fetchDashboardData();
      fetchTickerData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [userEmail]);

  const openWallet = (asset) => {
    const assetToPass = {
      ...asset,
      iconPath: asset.icon,
      originalAsset: asset.originalAsset || {
        key: asset.symbol.toLowerCase(),
        balance: asset.originalAsset?.balance || 0,
        balanceValue: asset.originalAsset?.balanceValue || asset.usdValue || 0,
        currentPrice: asset.originalAsset?.currentPrice || 
                     (typeof asset.price === 'string' 
                       ? parseFloat(asset.price.replace(/[^0-9.-]+/g, "")) 
                       : asset.price),
        symbol: asset.symbol,
        name: asset.sub
      }
    };
    navigate("/bitcoinwallet", { state: assetToPass });
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleReceive = () => navigate("/balreceive");
  const handleSend = () => {
    if (userAssets && userAssets.length > 0) {
      navigate("/sendbtc", {
        state: {
          ...userAssets[0],
          name: userAssets[0].name,
          sub: userAssets[0].sub,
          balance: userAssets[0].balance,
          icon: userAssets[0].icon
        }
      });
    } else {
      navigate("/sendbtc");
    }
  };
  const handleBuy = () => navigate("/walletoption");
  const handleTrade = () => navigate("/tradingpanel"); // ✅ NEW
  const handleHistory = () => navigate("/history");

  const displayAssets = userAssets.length > 0 ? userAssets : STATIC_ASSETS.map(asset => ({
    ...asset,
    price: formatCurrency(asset.price),
    balanceValue: formatCurrency(asset.balanceValue),
    change: formatPercentage(asset.change)
  }));

  const getCardStatus = () => {
    if (cardData?.status) return cardData.status;
    const savedCard = localStorage.getItem("userCardData");
    if (savedCard) return JSON.parse(savedCard).status;
    return "INACTIVE";
  };

  return (
    <>
      <div className={`dashboard ${sidebarOpen ? 'blur-background' : ''}`}>
        <header className="header">
          <img src={logo} alt="logo" />
          <div className="menu" onClick={toggleSidebar}>☰</div>
        </header>

        <div className="top-section">
          <div className="balance-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="connect">
                <Link className="Connect-link" to="/walletoption">Connect Wallet</Link>
              </span>
            </div>
            <p>Your Balance</p>
            <h2>{totalBalance}</h2>

            <div style={{
              fontSize: '11px', color: '#888', marginBottom: '15px',
              display: 'flex', justifyContent: 'space-between'
            }}>
              <span>Last updated: {lastUpdate || '--:--'}</span>
            </div>

            <div className="actions">
              {/* ✅ Updated sequence: Receive, Send, Buy, Trade, History */}
              <div onClick={handleReceive}>
                <div className="action-box">
                  <img src={receivearrow} alt="Receive" style={{ width: '48px', height: '40px' }} />
                </div>
                <span>Receive</span>
              </div>
              <div onClick={handleSend}>
                <div className="action-box">
                  <img src={sendarrow} alt="Send" style={{ width: '48px', height: '48px' }} />
                </div>
                <span>Send</span>
              </div>
              <div onClick={handleBuy}>
                <div className="action-box">
                  <img src={buyarrow} alt="Buy" style={{ width: '48px', height: '48px' }} />
                </div>
                <span>Buy</span>
              </div>
              <div onClick={handleTrade}>
                <div className="action-box">
                  <img src={tradearrow} alt="Trade" style={{ width: '48px', height: '48px' }} />
                </div>
                <span>Trade</span>
              </div>
              <div onClick={handleHistory}>
                <div className="action-box">
                  <img src={historyarrow} alt="History" style={{ width: '48px', height: '48px' }} />
                </div>
                <span>History</span>
              </div>
            </div>
          </div>

          <div className="visa-container">
            <Card
              type={mapCardType(cardData?.cardType)}
              number={cardData?.cardNumber || "XXXX XXXX XXXX XXXX"}
              holder={cardData?.fullName || userProfile?.fullName || "CARD HOLDER"}
              expiry={cardData?.expiry || "XX/XX"}
              cvv={cardData?.cvv || "XXX"}
              status={getCardStatus()}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 className="assets-title">Assets</h3>
          {loading.dashboard && (
            <small style={{ color: '#ff9800', fontSize: '11px' }}>Loading...</small>
          )}
        </div>

        <div className="assets">
          {displayAssets.map((item, i) => (
            <div
              className="asset-card"
              key={i}
              onClick={() => openWallet(item)}
              style={{ cursor: "pointer" }}
            >
              <img src={item.icon} alt={item.name} />
              <div className="asset-info">
                <strong>{item.name}</strong>
                <span>{item.sub}</span>
              </div>
              <div className="asset-price">
                <strong>{item.price}</strong>
                <span className={item.rawChange >= 0 ? "green" : "red"}>
                  {item.change} 24hr
                </span>
              </div>
              <div className="asset-balance">
                {item.balanceText}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      ></div>

      <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="logo" className="sidebar-logo" />
          <Link to="/userprofile" className="user-profile-btn" onClick={closeSidebar}>
            User Profile
          </Link>
          <button className="close-sidebar" onClick={closeSidebar}>×</button>
        </div>

        <div className="sidebar-menu">
          {isAdmin && (
            <div className="sidebar-item">
              <Link to="/admin-panel" onClick={closeSidebar}>Admin Panel</Link>
            </div>
          )}
          <div className="sidebar-item">
            <Link to="/dashboard" onClick={closeSidebar}>Dashboard</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/withdrawal" onClick={closeSidebar}>Withdrawal</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/creditcards" onClick={closeSidebar}>Activate Debit Card</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/walletoption" onClick={closeSidebar}>Connect Trust Wallet</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/support" onClick={closeSidebar}>Support</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/report" onClick={closeSidebar}>Report</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/referearn" onClick={closeSidebar}>Referral Link</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/spinwheel" onClick={closeSidebar}>Spin Wheel</Link>
          </div>
          {/* ✅ NEW: Trade sidebar item */}
          <div className="sidebar-item">
            <Link to="/tradingpanel" onClick={closeSidebar}>Trade</Link>
          </div>
          {/* ✅ UPDATED: Logout with proper function */}
          <div className="sidebar-item logout-item">
            <button onClick={handleSidebarLogout} className="logout-button">
              Logout
            </button>
          </div>
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

export default Dashboard;