import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BitcoinWallet.css";
import btc from "../assets/btc.png";
import bnb from "../assets/bnb.png";
import usdt from "../assets/usdt.png";
import trx from "../assets/trx.png";
import usdttether from "../assets/usdttether.png";
import eth from "../assets/eth.png";
import sol from "../assets/sol.png";
import xrp from "../assets/xrp.png";
import doge from "../assets/doge.png";
import ltc from "../assets/ltc.png";
import { getCoinIcon } from "../utils/coinIcons";
import spinWheelIcon from "../assets/spinandwin.png";
import swapIcon from "../assets/swap.png";

/* ================= CANDLESTICK CHART COMPONENT ================= */
// Custom candlestick component that draws candlesticks on canvas with theme matching
const CandlestickChart = ({ data, width, height, colorPositive, colorNegative }) => {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas dimensions with device pixel ratio for sharp rendering
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    
    // Clear canvas with transparent background (matches card theme)
    ctx.clearRect(0, 0, width, height);
    
    // Calculate candle dimensions - adjusted for better visibility
    const candleWidth = Math.max(3, (width / data.length) * 0.65);
    const spacing = (width / data.length) * 0.35;
    const halfCandle = candleWidth / 2;
    
    // Find min and max prices for scaling with padding
    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const padding = 20; // Top and bottom padding for labels
    
    // Function to convert price to Y coordinate
    const priceToY = (price) => {
      return padding + ((maxPrice - price) / priceRange) * (height - padding * 2);
    };
    
    // Draw grid lines (themed to match the card)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 0.8;
    
    // Horizontal grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (i / gridLines) * (height - padding * 2);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Price label - themed to match text color
      const priceAtLine = maxPrice - (i / gridLines) * priceRange;
      ctx.fillStyle = 'rgba(207, 239, 255, 0.7)';
      ctx.font = '9px Arial';
      ctx.fillText(priceAtLine.toFixed(2), 4, y - 3);
    }
    
    // Draw each candlestick
    data.forEach((candle, index) => {
      const x = index * (candleWidth + spacing) + halfCandle;
      const openY = priceToY(candle.open);
      const closeY = priceToY(candle.close);
      const highY = priceToY(candle.high);
      const lowY = priceToY(candle.low);
      
      const isPositive = candle.close >= candle.open;
      const color = isPositive ? colorPositive : colorNegative;
      
      // Draw the wick (high to low)
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // Draw the body (open to close)
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(2, Math.abs(closeY - openY));
      
      ctx.fillStyle = color;
      ctx.fillRect(x - halfCandle + 1, bodyTop, candleWidth - 2, bodyHeight);
      
      // Add subtle border for better visibility
      ctx.strokeStyle = color;
      ctx.strokeRect(x - halfCandle + 1, bodyTop, candleWidth - 2, bodyHeight);
    });
    
    // Draw x-axis time labels (show every 4th label to avoid clutter)
    ctx.fillStyle = 'rgba(207, 239, 255, 0.6)';
    ctx.font = '8px Arial';
    data.forEach((candle, index) => {
      if (index % Math.ceil(data.length / 6) === 0 || index === data.length - 1) {
        const x = index * (candleWidth + spacing) + halfCandle;
        ctx.fillText(candle.time, x - 18, height - 5);
      }
    });
    
  }, [data, width, height, colorPositive, colorNegative]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        borderRadius: '12px'
      }}
    />
  );
};

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20my%20wallet%20on%20InstaCoinXPay.", "_blank");
  };

  return (
    <div className="bw-floating-support-buttons">
      <button className="bw-float-btn bw-telegram-float" onClick={handleTelegramClick} aria-label="Telegram Support">
        <svg className="bw-float-icon" viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.2-.07-.06-.18-.04-.26-.02-.11.02-1.86 1.18-5.26 3.48-.5.34-.95.51-1.35.5-.44-.01-1.3-.25-1.93-.46-.78-.26-1.4-.4-1.35-.84.03-.23.35-.47.96-.72 3.76-1.64 6.27-2.72 7.53-3.23 3.58-1.46 4.33-1.71 4.81-1.72.11 0 .35.02.51.16.13.11.17.26.19.4.01.06.02.19-.01.33z"/>
        </svg>
        <span className="bw-float-label">Telegram Support</span>
      </button>
      
      <button className="bw-float-btn bw-whatsapp-float" onClick={handleWhatsAppClick} aria-label="WhatsApp Support">
        <svg className="bw-float-icon" viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm0 18.22c-1.5 0-2.98-.4-4.26-1.17l-.3-.18-3.12.82.83-3.04-.2-.31c-.84-1.34-1.29-2.88-1.29-4.46 0-4.62 3.76-8.38 8.38-8.38 4.62 0 8.38 3.76 8.38 8.38 0 4.62-3.76 8.38-8.38 8.38zm4.59-6.27c-.25-.13-1.5-.74-1.73-.83-.23-.08-.4-.13-.57.13-.17.26-.65.83-.8 1-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.41-.44-.57-.45-.15-.01-.32-.01-.49-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.11 0 1.24.91 2.45 1.04 2.61.13.17 1.79 2.73 4.33 3.83.61.26 1.08.42 1.45.54.61.19 1.16.16 1.6.1.49-.07 1.5-.61 1.71-1.2.21-.59.21-1.09.15-1.2-.07-.1-.23-.17-.48-.3z"/>
        </svg>
        <span className="bw-float-label">WhatsApp Support</span>
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
    if (!document.querySelector('#bw-spin-wheel-nav-keyframes')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'bw-spin-wheel-nav-keyframes';
      styleSheet.textContent = `
        @keyframes bwSpinWheelNavPulse {
          0% {
            box-shadow: 0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4), 0 0 0 0 rgba(247, 147, 26, 0.7);
          }
          70% {
            box-shadow: 0 8px 35px rgba(247, 147, 26, 0.7), 0 0 30px rgba(200, 147, 10, 0.6), 0 0 0 15px rgba(247, 147, 26, 0);
          }
          100% {
            box-shadow: 0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4), 0 0 0 0 rgba(247, 147, 26, 0);
          }
        }
        
        @keyframes bwSpinWheelNavGlow {
          0% {
            filter: drop-shadow(0 0 5px #f7931a);
          }
          50% {
            filter: drop-shadow(0 0 15px #c8930a);
          }
          100% {
            filter: drop-shadow(0 0 5px #f7931a);
          }
        }
        
        @keyframes bwSpinWheelNavRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .bw-spin-wheel-nav-float {
          animation: ${pulseEffect ? 'bwSpinWheelNavPulse 2s infinite, bwSpinWheelNavGlow 3s infinite' : 'none'};
        }
        
        .bw-spin-wheel-nav-float:hover {
          transform: scale(1.15) rotate(10deg) !important;
          background: radial-gradient(circle at 30% 30%, #ffd700, #f7931a) !important;
          box-shadow: 0 10px 40px rgba(247, 147, 26, 0.8), 0 0 35px rgba(255, 215, 0, 0.7) !important;
        }
        
        .bw-spin-wheel-nav-float:hover .bw-wheel-icon-image {
          transform: scale(1.2) rotate(15deg) !important;
        }
        
        .bw-wheel-icon-image {
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
      className={`bw-spin-wheel-nav-float ${className}`}
      style={combinedStyles}
      aria-label="Go to Fortune Wheel"
      title="🎡 Spin & Win Rewards!"
    >
      <img 
        src={spinWheelIcon} 
        alt="Fortune Wheel"
        className="bw-wheel-icon-image"
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
        animation: 'bwSpinWheelNavRotate 4s linear infinite',
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

/* ================= ICON MAP ================= */
const iconMap = {
  BTC: btc,
  USDT_BNB: usdt,
  USDT_Tether: usdttether,
  SOL: sol,
  DOGE: doge,
  BNB: bnb,
  TRX: trx,
  ETH: eth,
  XRP: xrp,
  LTC: ltc,
};

/* ================= FORMATTERS ================= */
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const formatPercentage = (value = 0) => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(2)}%`;
};

/* ================= COMPONENT ================= */
const BitcoinWallet = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  /* ===== NORMALIZED ASSET ===== */
  const asset = {
    name: state?.name || "BTC",
    sub: state?.sub || "Bitcoin",
    icon: state?.icon || state?.iconPath || btc,
    originalAsset: state?.originalAsset || null,
  };

  /* ===== BALANCE STATES ===== */
  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [change24h, setChange24h] = useState(0);

  /* ===== CHART STATE ===== */
  const [candleData, setCandleData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartContainerSize, setChartContainerSize] = useState({ width: 0, height: 0 });
  const chartContainerRef = React.useRef(null);

  /* ===== TRANSACTIONS ===== */
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Observe container size for canvas rendering
  React.useEffect(() => {
    const updateSize = () => {
      if (chartContainerRef.current) {
        const { width, height } = chartContainerRef.current.getBoundingClientRect();
        setChartContainerSize({ width, height });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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

  /* ================= ICON ================= */
  const getIcon = () => {
    if (asset.icon) return asset.icon;
    const key =
      asset.name === "USDT" ? `${asset.name}_${asset.sub}` : asset.name;
    return iconMap[key] || btc;
  };

  /* ================= APPLY DASHBOARD DATA FIRST ================= */
  useEffect(() => {
    if (asset.originalAsset) {
      const {
        balance,
        balanceValue,
        currentPrice,
        priceChangePercentage24h,
      } = asset.originalAsset;

      setCoinBalance(balance || 0);
      setUsdBalance(balanceValue || 0);
      setPrice(currentPrice || 0);
      setChange24h(priceChangePercentage24h || 0);
    }
  }, []);

  /* ================= FIXED ASSET KEY ================= */
  const getAssetKey = () => {
    const name = asset.name?.toLowerCase().trim();
    const sub = asset.sub?.toLowerCase().trim() || "";

    console.log("[BitcoinWallet] getAssetKey - name:", asset.name, "| sub:", asset.sub);

    if (name === "usdt") {
      if (
        sub.includes("trc") ||
        sub.includes("tron") ||
        sub.includes("tether") ||
        sub === "usdttron" ||
        sub === "usdt_tether"
      ) {
        return "usdtTron";
      }

      if (
        sub.includes("bep") ||
        sub.includes("bnb") ||
        sub === "usdtbnb" ||
        sub === "usdt_bnb"
      ) {
        return "usdtBnb";
      }

      console.warn("[BitcoinWallet] USDT sub not matched:", asset.sub, "— defaulting to usdtTron");
      return "usdtTron";
    }

    return name;
  };

  /* ================= CONVERT PRICE DATA TO CANDLESTICKS ================= */
  const convertToCandlesticks = (pricesArray, intervalMinutes = 30) => {
    if (!Array.isArray(pricesArray) || pricesArray.length === 0) return [];
    
    const candles = [];
    const intervalMs = intervalMinutes * 60 * 1000;
    
    // Group prices by time intervals
    let currentCandle = null;
    let currentIntervalStart = null;
    
    pricesArray.forEach((pricePoint) => {
      const timestamp = pricePoint[0];
      const price = pricePoint[1];
      const date = new Date(timestamp);
      
      // Determine interval start
      const intervalStart = new Date(Math.floor(timestamp / intervalMs) * intervalMs);
      
      if (!currentCandle || intervalStart.getTime() !== currentIntervalStart?.getTime()) {
        // Save previous candle if exists
        if (currentCandle) {
          candles.push(currentCandle);
        }
        
        // Start new candle
        currentIntervalStart = intervalStart;
        currentCandle = {
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          open: price,
          high: price,
          low: price,
          close: price,
          fullDate: intervalStart
        };
      } else {
        // Update current candle
        currentCandle.high = Math.max(currentCandle.high, price);
        currentCandle.low = Math.min(currentCandle.low, price);
        currentCandle.close = price;
      }
    });
    
    // Add last candle
    if (currentCandle) {
      candles.push(currentCandle);
    }
    
    // Limit to last 48 candles for performance
    return candles.slice(-48);
  };

  /* ================= FETCH CHART DATA — FIXED ================= */
  const fetchChartData = async (currentPrice) => {
    const coinIdMap = {
      BTC: "bitcoin",
      ETH: "ethereum",
      BNB: "binancecoin",
      SOL: "solana",
      XRP: "ripple",
      DOGE: "dogecoin",
      LTC: "litecoin",
      TRX: "tron",
      USDT: "tether",
    };

    const coinId = coinIdMap[asset.name] || "bitcoin";

    // Helper: parse prices array and convert to candlesticks
    const parseAndSet = (prices) => {
      if (!Array.isArray(prices) || prices.length === 0) return false;
      const candles = convertToCandlesticks(prices, 30);
      if (candles.length > 0) {
        setCandleData(candles);
        setChartLoading(false);
        return true;
      }
      return false;
    };

    // ── Attempt 1: Pro API (only if key present) ──────────────────────────
    const API_KEY = process.env.REACT_APP_COINGECKO_API_KEY;
    if (API_KEY) {
      try {
        const res = await axios.get(
          `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
          {
            params: { vs_currency: "usd", days: 1 },
            headers: { "x-cg-pro-api-key": API_KEY },
            timeout: 8000,
          }
        );
        if (parseAndSet(res.data?.prices)) return;
      } catch (err) {
        console.warn("[BitcoinWallet] Pro API failed, trying free API:", err?.message);
      }
    }

    // ── Attempt 2: Free public CoinGecko API (no key needed) ─────────────
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
        {
          params: { vs_currency: "usd", days: 1 },
          timeout: 10000,
        }
      );
      if (parseAndSet(res.data?.prices)) return;
    } catch (err) {
      console.warn("[BitcoinWallet] Free API failed, using demo candlesticks:", err?.message);
    }

    // ── Attempt 3: Smooth demo fallback — generate realistic candlesticks ──
    const basePrice = currentPrice || price || 30000;
    const now = Date.now();
    const demoPrices = Array.from({ length: 96 }, (_, i) => {
      const ts = now - (95 - i) * 15 * 60 * 1000; // one point every 15min
      // Add some volatility to create realistic candles
      let price = basePrice;
      const hourOfDay = new Date(ts).getHours();
      // Simulate daily pattern
      if (hourOfDay >= 9 && hourOfDay <= 17) {
        price = basePrice * (1 + 0.005 * Math.sin(i * 0.2));
      } else {
        price = basePrice * (1 + 0.003 * Math.cos(i * 0.15));
      }
      // Add random noise
      price = price * (1 + 0.01 * (Math.random() - 0.5));
      return [ts, price];
    });
    
    const demoCandles = convertToCandlesticks(demoPrices, 30);
    setCandleData(demoCandles);
    setChartLoading(false);
  };

  /* ================= FETCH TRANSACTIONS ================= */
  const fetchAssetTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) return;

      const assetKey = getAssetKey();

      console.log("[BitcoinWallet] Fetching history for assetKey:", assetKey);

      const response = await axios.get(
        `https://backend-instacoinpay-1.onrender.com/api/history/asset/${assetKey}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 3 },
        }
      );

      if (response.data.success) {
        setRecentTransactions(response.data.data || []);
      }
    } catch (err) {
      console.error("[BitcoinWallet] History fetch error:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch chart on mount and auto-refresh every 30s
  useEffect(() => {
    setChartLoading(true);
    setCandleData([]);
    // Pass current price from originalAsset so fallback sparkline uses real base
    const currentPrice = asset.originalAsset?.currentPrice || 0;
    fetchChartData(currentPrice);
    const interval = setInterval(() => fetchChartData(currentPrice), 30000);
    return () => clearInterval(interval);
  }, [asset.name]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchAssetTransactions();
  }, [asset.name, asset.sub]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ================= FORMAT TX ================= */
  const formatTransaction = (tx) => ({
    id: tx.id,
    type: tx.type || "Unknown",
    coin: tx.coin || asset.name,
    to: tx.to || "—",
    amount: tx.amount,
    sub: tx.sub || `${tx.amount} ${tx.coin || asset.name}`,
    status: tx.status || "Pending",
    date: tx.createdAt || tx.date || "",
  });

  const displayTransactions =
    recentTransactions.length > 0
      ? recentTransactions.map(formatTransaction)
      : [];

  /* ================= HANDLE SWAP CLICK ================= */
  const handleSwapClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("[BitcoinWallet] No token found");
        return;
      }

      const balancesResponse = await axios.get(
        "https://backend-instacoinpay-1.onrender.com/api/wallet/balances",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (balancesResponse.data.success) {
        const assetKey = getAssetKey();
        const currentAssetData = balancesResponse.data.data.find(
          (a) => a.coin.toLowerCase() === assetKey.toLowerCase()
        );

        navigate("/swap", {
          state: {
            fromAsset: {
              name: asset.name,
              sub: asset.sub,
              icon: getIcon(),
              balance: currentAssetData?.balance || coinBalance,
              usdValue: currentAssetData?.balanceValue || usdBalance,
              price: currentAssetData?.currentPrice || price,
              priceChangePercentage24h: currentAssetData?.priceChangePercentage24h || 0,
            },
            allBalances: balancesResponse.data.data,
          },
        });
      } else {
        navigate("/swap", {
          state: {
            fromAsset: {
              name: asset.name,
              sub: asset.sub,
              icon: getIcon(),
              balance: coinBalance,
              usdValue: usdBalance,
              price: price,
            },
          },
        });
      }
    } catch (err) {
      console.error("[BitcoinWallet] Error fetching fresh balances:", err);
      navigate("/swap", {
        state: {
          fromAsset: {
            name: asset.name,
            sub: asset.sub,
            icon: getIcon(),
            balance: coinBalance,
            usdValue: usdBalance,
            price: price,
          },
        },
      });
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <div className="bw-wrapper">
        <div className="bw-card">

          {/* HEADER */}
          <div className="bw-header">
            <span className="bw-back" onClick={() => navigate(-1)}>←</span>
            <div className="bw-coin">
              <img src={getIcon()} alt={asset.name} />
              <h3>{asset.sub}</h3>
            </div>
          </div>

          {/* BALANCE */}
          <div className="bw-balance">
            <h1>
              {formatCurrency(usdBalance)} {asset.name}
            </h1>
            <p className="bw-price">
              {formatCurrency(price)} / {asset.name}
            </p>
            <p className={`bw-change ${change24h < 0 ? "bw-red" : "bw-green"}`}>
              {formatPercentage(change24h)} 24hr
            </p>
          </div>

          {/* ✅ CANDLESTICK CHART */}
          <div
            className="bw-chart"
            ref={chartContainerRef}
            style={{ width: "100%", height: 180, minHeight: 180, position: 'relative' }}
          >
            {chartLoading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#cfefff",
                  fontSize: "13px",
                }}
              >
                Loading chart...
              </div>
            ) : candleData.length > 0 && chartContainerSize.width > 0 && chartContainerSize.height > 0 ? (
              <CandlestickChart
                data={candleData}
                width={chartContainerSize.width}
                height={chartContainerSize.height}
                colorPositive="#00ff9d"
                colorNegative="#ff4d4f"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#cfefff",
                  fontSize: "13px",
                }}
              >
                Chart unavailable
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="bw-actions">
            <BwAction
              label="Send"
              icon="↗"
              onClick={() =>
                navigate("/send", {
                  state: {
                    name: asset.name,
                    sub: asset.sub,
                    icon: getIcon(),
                    originalAsset: asset.originalAsset,
                  },
                })
              }
            />
            <BwAction
              label="Receive"
              icon="↙"
              onClick={() =>
                navigate("/receive", {
                  state: {
                    name: asset.name,
                    sub: asset.sub,
                    icon: getIcon(),
                  },
                })
              }
            />
            <BwAction
              label="Swap"
              icon={
                <img
                  src={swapIcon}
                  alt="Swap"
                  style={{ width: "28px", height: "28px" }}
                />
              }
              onClick={handleSwapClick}
            />
            <BwAction
              label="History"
              icon="⟳"
              onClick={() => navigate("/history")}
            />
          </div>

          {/* TRANSACTIONS */}
          <div className="bw-transactions">
            {loading ? (
              <p>Loading transactions...</p>
            ) : error ? (
              <p>⚠️ {error}</p>
            ) : displayTransactions.length === 0 ? (
              <p>No recent transactions</p>
            ) : (
              displayTransactions.map((tx, i) => (
                <BwTransaction key={i} {...tx} />
              ))
            )}
          </div>

        </div>
      </div>

      {/* Floating Support Buttons */}
      <FloatingSupportButtons />

      {/* Spin Wheel Navigation Button */}
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

/* ================= SUB COMPONENTS WITH UNIQUE CLASSNAMES ================= */
const BwAction = ({ icon, label, onClick }) => (
  <div className="bw-action" onClick={onClick}>
    <div className="bw-action-icon">
      {typeof icon === "string" ? icon : icon}
    </div>
    <p>{label}</p>
  </div>
);

const BwTransaction = (tx) => {
  const navigate = useNavigate();

  const typeClass =
    tx.type?.toLowerCase() === "send" || tx.type?.toLowerCase() === "sent"
      ? "bw-sent"
      : tx.type?.toLowerCase() === "receive" ||
        tx.type?.toLowerCase() === "received"
      ? "bw-received"
      : "bw-pending";

  return (
    <div
      className="bw-tx bw-clickable"
      onClick={() =>
        navigate(`/transaction/${tx.id}`, {
          state: tx,
        })
      }
    >
      <div className="bw-tx-left">
        <div className="bw-tx-icon">
          <img
            src={getCoinIcon(tx.coin)}
            alt={tx.coin}
            className="bw-coin-img"
          />
        </div>

        <div>
          <strong className={`bw-tx-type ${typeClass}`}>
            {tx.type}
          </strong>
          {/* ❌ Removed amount text from left side */}
        </div>
      </div>

      <span className={`bw-tx-amount ${typeClass}`}>
        {tx.amount}
      </span>
    </div>
  );
};

export default BitcoinWallet;