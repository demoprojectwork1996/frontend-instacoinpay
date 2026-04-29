import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReferEarn.css";
import logo from "../assets/logo.png";
import spinWheelIcon from "../assets/spinandwin.png";

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  // WhatsApp and Telegram handlers
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20the%20referral%20program%20on%20InstaCoinXPay.", "_blank");
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
    if (!document.querySelector('#spin-wheel-nav-keyframes-refer')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'spin-wheel-nav-keyframes-refer';
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

const ReferEarn = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

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

  const user = JSON.parse(localStorage.getItem("user"));
  const referralCode = user?.referralCode || localStorage.getItem("userReferralCode");
  const referralUrl = user
    ? `${window.location.origin}/signup?referralCode=${user.referralCode}`
    : `https://yourdomain.com/signup?referralCode=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const text = `Join CoinXPay and get 50 USDT (BEP20) welcome bonus! Use my referral code: ${referralCode}. Sign up here: ${referralUrl}`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=Join CoinXPay & Get 50 USDT Bonus!&body=${encodeURIComponent(text)}`);
        break;
      case 'social':
        if (navigator.share) {
          navigator.share({
            title: 'Join CoinXPay - Get 50 USDT Bonus!',
            text: text,
            url: referralUrl
          });
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="refer-wrapper">

        <button className="refer-back-btn" onClick={() => navigate("/dashboard")}>
          ← 
        </button>

        <div className="bg-gradient"></div>
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        
        <header className="refer-header">
          <img src={logo} alt="CoinXPay" className="logo" />
          <div className="header-badge">
            <span className="badge-text">Earn 50 USDT per Referral</span>
          </div>
        </header>

        <main className="refer-content">
          <div className="refer-card">

            <div className="left-section">
              <div className="dollar-container">
                <div className="dollar-symbol">$</div>
                <div className="dollar-glow"></div>
              </div>
              <div className="reward-count">
                <div className="count-number">500 USDT-BNB</div>
                <div className="count-label">= 10 Friends Referred</div>
              </div>
            </div>

            <div className="right-section">
              <div className="badge">HOT OFFER</div>
              <h1 className="title">
                <span className="title-gradient">REFER AND EARN 50 USDT</span>
              </h1>
              <p className="subtitle">
                Invite friends to join CoinXPay. Both you and your friend get 50 USDT (BEP20) bonus!
              </p>

              <div className="reward-section">
                <div className="reward-card">
                  <div className="reward-icon">💰</div>
                  <div className="reward-details">
                    <div className="reward-label">PER USER REFERRAL</div>
                    <div className="reward-amount">
                      <span className="currency"></span>
                      <span className="amount">50 USDT-BNB</span>
                    </div>
                  </div>
                </div>

                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-text">Share your referral code</div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-text">Friend signs up & verifies account</div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-text">Get 50 USDT-BNB credited to your wallet</div>
                  </div>
                </div>
              </div>

              <div className="referral-section">
                <div className="section-header">
                  <h3>Your Personal Referral Code</h3>
                </div>
                
                <div className="code-container">
                  <div className="code-input">
                    <input
                      type="text"
                      value={referralCode || ''}
                      readOnly
                      className="referral-input"
                    />
                    <button
                      className={`copy-btn-1 ${copied ? 'copied' : ''}`}
                      onClick={handleCopy}
                    >
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <p className="code-hint">
                    Share this code with friends. When they sign up using your code, both of you get 50 USDT-BNB!
                  </p>
                </div>
              </div>

              <div className="bonus-info">
                <h4>🎁 Bonus Information</h4>
                <ul>
                  <li>✓ Every new user gets 50 USDT (BEP20) welcome bonus</li>
                  <li>✓ Referrer gets additional 50 USDT per successful referral</li>
                  <li>✓ No limit on number of referrals</li>
                  <li>✓ Bonuses are credited instantly after verification</li>
                  <li>✓ USDT can be traded, withdrawn, or used for payments</li>
                </ul>
              </div>

            </div>
          </div>

        </main>
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

export default ReferEarn;