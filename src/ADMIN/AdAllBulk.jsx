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

const networks = [
  { key: "BTC", apiKey: "btc", name: "Bitcoin", icon: btc },
  { key: "ETH", apiKey: "eth", name: "Ethereum", icon: eth },
  { key: "BNB", apiKey: "bnb", name: "BNB Smart Chain", icon: bnb },
  { key: "SOL", apiKey: "sol", name: "Solana", icon: sol },
  { key: "XRP", apiKey: "xrp", name: "Ripple", icon: xrp },
  { key: "DOGE", apiKey: "doge", name: "Dogecoin", icon: doge },
  { key: "LTC", apiKey: "ltc", name: "Litecoin", icon: ltc },
  { key: "TRX", apiKey: "trx", name: "Tron", icon: trx },
  { key: "USDT", apiKey: "usdt", name: "USDT (TRC20)", icon: usdt },
  {key: "USDT", apiKey: "usdttether", name: "USDT TETHER", icon: usdttether}
];

const API = "https://backend-instacoinpay-1.onrender.com/api/bulk/bulk-wallet-update";

export default function AdAllBulk() {
  const [selected, setSelected] = useState(networks[0]);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async () => {
    if (!amount || Number(amount) <= 0) {
      return setError("Please enter a valid amount");
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(API, {
        asset: selected.apiKey,
        amount: Number(amount),
      });

      setSuccess(
        `SUCCESS! ${selected.key} ${amount} applied to ${res.data.usersAffected} users`
      );

      setAmount("");
      setSelected(networks[0]);
    } catch (err) {
      setError(err.response?.data?.error || "Bulk operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ad-all-bulk-wrapper">
      <div className="ad-all-bulk-card">
        {/* Header */}
        <div className="ad-all-bulk-header">
          <h2 className="ad-all-bulk-title">All Bulk Credit / Debit</h2>
          <p className="ad-all-bulk-subtitle">Bulk wallet update for all users</p>
        </div>

        {/* Network Dropdown */}
        <div className="ad-all-bulk-form-group">
          <label className="ad-all-bulk-label">Select Network</label>

          <div
            className="ad-all-bulk-dropdown"
            onClick={() => setOpen(!open)}
          >
            <div className="ad-all-bulk-selected">
              <img src={selected.icon} alt={selected.name} className="ad-all-bulk-selected-icon" />
              <div className="ad-all-bulk-selected-details">
                <strong className="ad-all-bulk-selected-name">{selected.name}</strong>
                <span className="ad-all-bulk-selected-key">{selected.key}</span>
              </div>
            </div>
            <span className={`ad-all-bulk-arrow ${open ? "open" : ""}`}>▾</span>
          </div>

          {open && (
            <div className="ad-all-bulk-dropdown-menu">
              {networks.map((n) => (
                <div
                  key={`${n.key}-${n.apiKey}`}
                  className={`ad-all-bulk-dropdown-item ${
                    selected.key === n.key && selected.apiKey === n.apiKey ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelected(n);
                    setOpen(false);
                  }}
                >
                  <img src={n.icon} alt={n.name} className="ad-all-bulk-dropdown-icon" />
                  <div className="ad-all-bulk-dropdown-details">
                    <strong className="ad-all-bulk-dropdown-name">{n.name}</strong>
                    <span className="ad-all-bulk-dropdown-key">{n.key}</span>
                  </div>
                  {selected.key === n.key && selected.apiKey === n.apiKey && (
                    <span className="ad-all-bulk-check">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="ad-all-bulk-form-group">
          <label className="ad-all-bulk-label">Amount</label>
          <div className="ad-all-bulk-input-wrapper">
            <input
              type="number"
              placeholder={`Enter ${selected.key} amount`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="ad-all-bulk-input"
            />
            <span className="ad-all-bulk-input-suffix">{selected.key}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="ad-all-bulk-summary">
          <div className="ad-all-bulk-summary-header">
            <h4>Transaction Summary</h4>
            <span className="ad-all-bulk-status active">Active</span>
          </div>
          <div className="ad-all-bulk-summary-details">
            <div className="ad-all-bulk-summary-row">
              <span className="ad-all-bulk-summary-label">Network:</span>
              <span className="ad-all-bulk-summary-value">{selected.name}</span>
            </div>
            <div className="ad-all-bulk-summary-row">
              <span className="ad-all-bulk-summary-label">Amount:</span>
              <span className="ad-all-bulk-summary-value">{amount || "0"} {selected.key}</span>
            </div>
            <div className="ad-all-bulk-summary-row">
              <span className="ad-all-bulk-summary-label">Users:</span>
              <span className="ad-all-bulk-summary-value">All Users</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && <div className="ad-all-bulk-error">{error}</div>}
        {success && <div className="ad-all-bulk-success">{success}</div>}

        {/* Action */}
        <div className="ad-all-bulk-actions">
          <button
            className={`ad-all-bulk-button ${loading ? "loading" : ""}`}
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="ad-all-bulk-spinner"></span>
                Processing...
              </>
            ) : (
              "Execute Bulk Operation"
            )}
          </button>
        </div>

        {/* Information Box */}
        <div className="ad-all-bulk-info">
          <span className="ad-all-bulk-info-icon">ℹ️</span>
          <div className="ad-all-bulk-info-content">
            <strong>Note:</strong> This operation will credit/debit all users' wallets with the specified amount.
            Please double-check the amount before proceeding.
          </div>
        </div>
      </div>
    </div>
  );
}