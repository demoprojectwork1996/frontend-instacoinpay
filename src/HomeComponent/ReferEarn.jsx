import React, { useState } from "react";
import "./ReferEarn.css";
import logo from "../assets/logo.png";

const ReferEarn = () => {
  const [copied, setCopied] = useState(false);
  const referralUrl = "https://demo.com/signup?referralCode=F28E-6892";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="refer-wrapper">
      {/* Background Elements */}
      <div className="bg-gradient"></div>
      <div className="floating-shape shape1"></div>
      <div className="floating-shape shape2"></div>
      <div className="floating-shape shape3"></div>
      
      {/* Header */}
      <header className="refer-header">
        <img src={logo} alt="CoinXPay" className="logo" />
        <div className="header-badge">
          <span className="badge-text">Earn Rewards</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="refer-content">
        <div className="refer-card">
          {/* Left Section with Visual Appeal */}
          <div className="left-section">
            <div className="dollar-container">
              <div className="dollar-symbol">$</div>
              <div className="dollar-glow"></div>
            </div>
            <div className="reward-count">
              <div className="count-number">10</div>
              <div className="count-label">Friends Referred</div>
            </div>
          </div>

          {/* Right Section with Details */}
          <div className="right-section">
            <div className="badge">HOT OFFER</div>
            <h1 className="title">
              <span className="title-gradient">REFER AND EARN</span>
            </h1>
            <p className="subtitle">Invite friends to join CoinXPay and earn rewards together</p>

            {/* Reward Section */}
            <div className="reward-section">
              <div className="reward-card">
                <div className="reward-icon">💰</div>
                <div className="reward-details">
                  <div className="reward-label">PER USER</div>
                  <div className="reward-amount">
                    <span className="currency">$</span>
                    <span className="amount">10</span>
                    <span className="reward-bonus">+ $5 bonus after 5 referrals</span>
                  </div>
                </div>
              </div>

              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-text">Share your referral link</div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-text">Friend signs up & verifies account</div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-text">Get $10 credited to your wallet</div>
                </div>
              </div>
            </div>

            {/* Referral Code Section */}
            <div className="referral-section">
              <div className="section-header">
                <h3>Your Personal Referral Link</h3>
                <div className="share-buttons">
                  <button className="share-btn" title="Share via WhatsApp">📱</button>
                  <button className="share-btn" title="Share via Email">✉️</button>
                  <button className="share-btn" title="Share on Social Media">📢</button>
                </div>
              </div>
              
              <div className="code-container">
                <div className="code-input">
                  <input
                    type="text"
                    value={referralUrl}
                    readOnly
                    className="referral-input"
                  />
                  <button
                    className={`copy-btn-1 ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                    aria-label="Copy referral link"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <p className="code-hint">
                  Share this link with friends. When they sign up using your link, both of you get $10!
                </p>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default ReferEarn;