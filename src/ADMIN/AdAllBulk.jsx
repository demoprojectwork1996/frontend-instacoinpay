import React, { useState } from "react";
import axios from "axios";
import "./AdAllBulk.css";

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

/* =========================
   NETWORK LIST
========================= */
const networks = [
  { key: "BTC", name: "Bitcoin", icon: btc },
  { key: "ETH", name: "Ethereum", icon: eth },
  { key: "BNB", name: "BNB Smart Chain", icon: bnb },
  { key: "SOL", name: "Solana", icon: sol },
  { key: "XRP", name: "Ripple", icon: xrp },
  { key: "DOGE", name: "Dogecoin", icon: doge },
  { key: "LTC", name: "Litecoin", icon: ltc },
  { key: "TRX", name: "Tron", icon: trx },
  { key: "USDT", name: "USDT (TRC20)", icon: usdt },
  { key: "USDT", name: "USDT Tether", icon: usdttether },
];

/* =========================
   LOCALHOST API
========================= */
const API = "https://backend-instacoinpay-1.onrender.com/api/bulk-transaction";

/* =========================
   COMPONENT
========================= */
export default function AdAllBulk() {
  const [selected, setSelected] = useState(networks[0]);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async () => {
    console.log("🔥 BUTTON CLICKED");

    if (!amount || Number(amount) <= 0) {
      console.log("❌ Invalid amount");
      return setError("Please enter a valid amount");
    }

    console.log("📤 Sending request", {
      type: "CREDIT",
      coin: selected.key,
      amount: Number(amount),
    });

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(API, {
        type: "CREDIT",
        coin: selected.key,
        amount: Number(amount),
      });

      console.log("✅ API RESPONSE", res.data);

      setSuccess(
        `SUCCESS! ${selected.key} ${amount} credited successfully`
      );
    } catch (err) {
      console.error("❌ API ERROR", err);
      setError(err.response?.data?.error || "Bulk operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ad-all-bulk-wrapper">
      <div className="ad-all-bulk-card">
        <div className="ad-all-bulk-header">
          <h2 className="ad-all-bulk-title">All Bulk Credit</h2>
          <p className="ad-all-bulk-subtitle">Credit multiple users at once</p>
        </div>

        {/* Network Selector */}
        <div className="ad-all-bulk-form-group">
          <label className="ad-all-bulk-label">Select Network</label>
          <div 
            className="ad-all-bulk-dropdown" 
            onClick={() => setOpen(!open)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && setOpen(!open)}
          >
            <div className="ad-all-bulk-selected">
              <img 
                src={selected.icon} 
                alt={selected.key} 
                className="ad-all-bulk-selected-icon"
              />
              <div className="ad-all-bulk-selected-details">
                <span className="ad-all-bulk-selected-name">{selected.name}</span>
                <span className="ad-all-bulk-selected-key">{selected.key}</span>
              </div>
            </div>
            <span className={`ad-all-bulk-arrow ${open ? 'open' : ''}`}>▼</span>
          </div>
          
          {open && (
            <div className="ad-all-bulk-dropdown-menu">
              {networks.map((n) => (
                <div
                  key={n.key + n.name}
                  className={`ad-all-bulk-dropdown-item ${selected.key === n.key ? 'selected' : ''}`}
                  onClick={() => {
                    setSelected(n);
                    setOpen(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && setSelected(n)}
                >
                  <img 
                    src={n.icon} 
                    alt={n.key} 
                    className="ad-all-bulk-dropdown-icon"
                  />
                  <div className="ad-all-bulk-dropdown-details">
                    <span className="ad-all-bulk-dropdown-name">{n.name}</span>
                    <span className="ad-all-bulk-dropdown-key">{n.key}</span>
                  </div>
                  {selected.key === n.key && (
                    <span className="ad-all-bulk-check">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="ad-all-bulk-form-group">
          <label className="ad-all-bulk-label">Amount to Credit</label>
          <div className="ad-all-bulk-input-wrapper">
            <input
              type="number"
              placeholder={`Enter ${selected.key} amount`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="ad-all-bulk-input"
              inputMode="decimal"
              min="0"
              step="0.00000001"
            />
            <span className="ad-all-bulk-input-suffix">{selected.key}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="ad-all-bulk-summary">
          <div className="ad-all-bulk-summary-header">
            <h4>Transaction Summary</h4>
            <span className={`ad-all-bulk-status ${amount ? 'active' : 'inactive'}`}>
              {amount ? 'Ready' : 'Waiting'}
            </span>
          </div>
          <div className="ad-all-bulk-summary-details">
            <div className="ad-all-bulk-summary-row">
              <span className="ad-all-bulk-summary-label">Network</span>
              <span className="ad-all-bulk-summary-value">{selected.name}</span>
            </div>
            <div className="ad-all-bulk-summary-row">
              <span className="ad-all-bulk-summary-label">Amount</span>
              <span className="ad-all-bulk-summary-value">
                {amount || '0'} {selected.key}
              </span>
            </div>
            <div className="ad-all-bulk-summary-row">
              <span className="ad-all-bulk-summary-label">Type</span>
              <span className="ad-all-bulk-summary-value">Bulk Credit</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="ad-all-bulk-error">
            {error}
          </div>
        )}
        {success && (
          <div className="ad-all-bulk-success">
            {success}
          </div>
        )}

        {/* Action Buttons */}
        <div className="ad-all-bulk-actions">
          <button
            className={`ad-all-bulk-button ${loading ? 'loading' : ''}`}
            onClick={handleSend}
            disabled={loading || !amount}
            type="button"
          >
            {loading ? (
              <>
                <span className="ad-all-bulk-spinner"></span>
                Processing...
              </>
            ) : (
              'Execute Bulk Credit'
            )}
          </button>
          
          <button
            className="ad-all-bulk-button-secondary"
            onClick={() => {
              setAmount("");
              setError("");
              setSuccess("");
            }}
            type="button"
            disabled={loading}
          >
            Clear All
          </button>
        </div>

        {/* Information Box */}
        <div className="ad-all-bulk-info">
          <span className="ad-all-bulk-info-icon">ℹ️</span>
          <div className="ad-all-bulk-info-content">
            <strong>Note:</strong> This action will credit <strong>{amount || '0'} {selected.key}</strong> to all eligible users in your system. Please double-check the amount before proceeding.
          </div>
        </div>
      </div>
    </div>
  );
}