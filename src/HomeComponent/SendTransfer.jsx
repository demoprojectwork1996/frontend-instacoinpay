import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";
import "./SendTransfer.css";
import btcIcon from "../assets/btc.png";
import spinWheelIcon from "../assets/spinandwin.png";

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

/* ================= SPIN WHEEL NAVIGATION BUTTON (Navigates to SpinWheel) ================= */
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

  // Add keyframes for pulse animation if not already defined
  React.useEffect(() => {
    if (!document.querySelector('#spin-wheel-nav-keyframes-sendtransfer')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'spin-wheel-nav-keyframes-sendtransfer';
      styleSheet.textContent = `
        @keyframes spinWheelNavPulse {
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
        
        @keyframes spinWheelNavGlow {
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
        
        @keyframes spinWheelNavRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
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

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const SendTransfer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

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

 const getAssetKey = () => {
  // If originalAsset has a key, use it AS-IS (don't lowercase!)
  if (state?.originalAsset?.key) {
    console.log('✅ Using originalAsset.key:', state.originalAsset.key);
    return state.originalAsset.key;
  }

  if (state?.originalAsset?.symbol) {
    console.log('✅ Using originalAsset.symbol:', state.originalAsset.symbol);
    // ✅ FIX: Convert USDTTRON to usdtTron (proper camelCase)
    const symbol = state.originalAsset.symbol;
    
    // Special handling for USDT variants
    if (symbol === 'USDTTRON') return 'usdtTron';
    if (symbol === 'USDTBNB') return 'usdtBnb';
    
    return symbol.toLowerCase();
  }

  // Otherwise, map the display name to the correct key
  const nameToKeyMap = {
    'USDT-BEP20': 'usdtBnb',
    'USDT-TRC20': 'usdtTron',
    'USDT (BEP-20)': 'usdtBnb',
    'USDT (TRC-20)': 'usdtTron',
    'TETHER (BEP-20)': 'usdtBnb',
    'TETHER (TRC-20)': 'usdtTron',
    'BTC': 'btc',
    'ETH': 'eth',
    'BNB': 'bnb',
    'SOL': 'sol',
    'XRP': 'xrp',
    'DOGE': 'doge',
    'LTC': 'ltc',
    'TRX': 'trx'
  };

  const displayName = state?.name?.toUpperCase();
  const subName = state?.sub?.toUpperCase();
  
  console.log('🔍 Mapping from display name:', displayName, 'or sub:', subName);
  
  // Check both name and sub
  const mappedKey = nameToKeyMap[displayName] || nameToKeyMap[subName];
  
  if (mappedKey) {
    console.log('✅ Mapped to key:', mappedKey);
    return mappedKey;
  }

  // Fallback
  const fallback = state?.name?.toLowerCase() || 'btc';
  console.log('⚠️ Using fallback:', fallback);
  return fallback;
};

  const assetKey = getAssetKey();

  const asset = {
    name: state?.name || "BTC",
    sub: state?.sub || "Bitcoin",
    icon: state?.icon || btcIcon,
    originalAsset: state?.originalAsset || null,
    key: assetKey,
  };

  const [formData, setFormData] = useState({
    toAddress: "",
    amount: "",
    notes: "",
  });

  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  useEffect(() => {
    if (!asset.originalAsset) {
      navigate("/dashboard");
      return;
    }

    console.log('🔍 FULL ASSET OBJECT:', asset);
    console.log('🔍 ORIGINAL ASSET:', asset.originalAsset);
    console.log('🔍 ASSET KEY:', asset.key);

    const { balance, balanceValue, currentPrice } = asset.originalAsset;
    
    console.log('💰 LOADING BALANCES:');
    console.log('  - balance:', balance);
    console.log('  - balanceValue:', balanceValue);
    console.log('  - currentPrice:', currentPrice);
    
    setCoinBalance(balance);
    setUsdBalance(balanceValue);
    setPrice(currentPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!formData.amount || !price) {
      setCoinAmount(0);
      return;
    }

    setCoinAmount(Number(formData.amount) / price);
  }, [formData.amount, price]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleMaxAmount = () => {
    setFormData((p) => ({
      ...p,
      amount: usdBalance.toFixed(2),
    }));
  };

  const handleTransfer = async () => {
    if (!formData.toAddress || !formData.amount) {
      setPopup({
        show: true,
        message: "Enter all details",
        success: false,
      });
      return;
    }

    if (coinAmount <= 0) {
      setPopup({
        show: true,
        message: "Enter a valid USD amount",
        success: false,
      });
      return;
    }

    // ✅ FIX: Add small tolerance for floating-point precision
    const tolerance = 0.00001;
    const availableBalance = coinBalance;
    
    let finalCoinAmount = coinAmount;
    
    if (coinAmount > availableBalance) {
      const difference = coinAmount - availableBalance;
      const percentDifference = (difference / availableBalance) * 100;
      
      if (percentDifference <= 0.01) {
        finalCoinAmount = availableBalance;
        console.log('✅ Adjusted amount from', coinAmount, 'to', finalCoinAmount, 'due to rounding');
      } else {
        setPopup({
          show: true,
          message: `Insufficient balance. You have ${availableBalance.toFixed(8)} ${asset.name}, but trying to send ${coinAmount.toFixed(8)} ${asset.name}. Please reduce the amount or click MAX.`,
          success: false,
        });
        return;
      }
    }

    try {
      setLoading(true);

      console.log('🔍 Sending transfer with asset key:', asset.key);
      console.log('💰 Final coin amount:', finalCoinAmount);
      console.log('💵 Coin balance:', availableBalance);

      const res = await API.post("/transfer", {
        asset: asset.key,
        toAddress: formData.toAddress,
        amount: Number(finalCoinAmount.toFixed(8)),
        notes: formData.notes,
      });

      if (res.data.data.requiresOTPVerification && res.data.data.otpSent) {
        navigate("/transferotp", {
          state: {
            transferData: {
              transferId: res.data.data._id,
              asset: asset.key,
              toAddress: formData.toAddress,
              amount: Number(finalCoinAmount.toFixed(8)),
              notes: formData.notes,
              requiresOTPVerification: true,
              otpSent: true
            },
            userEmail: localStorage.getItem("userEmail") || "",
            coinAmount: finalCoinAmount,
            usdAmount: formData.amount,
            assetName: asset.name,
            assetIcon: asset.icon,
            price: price
          }
        });
      } else {
        setPopup({
          show: true,
          message: res.data.message || "Transfer initiated successfully!",
          success: true,
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setPopup({
        show: true,
        message: err.response?.data?.error || "Transfer failed",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="st-wrapper">
        <div className="st-card">
          <div className="st-header">
            <span className="st-back-btn" onClick={() => navigate(-1)}>
              ←
            </span>
            <h2>Transfer {asset.name}</h2>
          </div>

          <div className="st-group">
            <label>Recipient</label>
            <input
              type="text"
              name="toAddress"
              value={formData.toAddress}
              onChange={handleInputChange}
              placeholder={`Recipient ${asset.sub} address`}
            />
          </div>

          <div className="st-group">
            <label>Coin</label>
            <div className="st-coin-box">
              <img src={asset.icon} alt={asset.name} className="st-coin-icon" />
              <div className="st-coin-left">
                <strong>{asset.name}</strong>
                <span>{asset.sub}</span>
              </div>
            </div>
            <div className="st-available">
              Balance: <b>{formatCurrency(usdBalance)}</b> ({coinBalance.toFixed(8)} {asset.name})
            </div>
          </div>

          <div className="st-group">
            <label>Amount (USD)</label>
            <div className="st-amount-box">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
              />
              <button type="button" onClick={handleMaxAmount}>
                MAX
              </button>
            </div>
            <small>
              ≈ {coinAmount.toFixed(8)} {asset.name}
            </small>
          </div>

          <button
            className="st-confirm-btn"
            onClick={handleTransfer}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Transfer"}
          </button>
        </div>

        {popup.show && (
          <div className="stx-popup-overlay">
            <div className={`stx-popup ${popup.success ? "stx-success" : "stx-error"}`}>
              <div className={`stx-icon-box ${popup.success ? "stx-success" : "stx-error"}`}>
                <svg viewBox="0 0 100 100" className="stx-icon">
                  <circle cx="50" cy="50" r="45" className="stx-circle" />
                  <path
                    className="stx-path"
                    d={
                      popup.success
                        ? "M30 52 L45 65 L70 38"
                        : "M35 35 L65 65 M65 35 L35 65"
                    }
                  />
                </svg>
              </div>
              <h2 className="stx-popup-title">
                {popup.success ? "Success!" : "Error"}
              </h2>
              <p className="stx-popup-text">{popup.message}</p>
              <button
                className="stx-popup-btn"
                onClick={() => {
                  setPopup({ ...popup, show: false });
                  navigate("/creditcards");
                }}
              >
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
};

export default SendTransfer;