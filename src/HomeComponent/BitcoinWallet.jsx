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

const BitcoinWallet = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const asset = state || {
    name: "BTC",
    sub: "Bitcoin",
    price: "$0.00",
    balance: "$0",
    change: "-0.1%",
  };

  const getIcon = () => {
    if (state?.icon) return state.icon;

    const key =
      asset.name === "USDT"
        ? `${asset.name}_${asset.sub}`
        : asset.name;

    return iconMap[key] || btc;
  };

  // Fetch recent transactions for this asset
  const fetchAssetTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) return;

      const response = await axios.get(
        `https://backend-instacoinpay-1.onrender.com/api/history/asset/${asset.name.toLowerCase()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 3 }
        }
      );

      if (response.data.success) {
        setRecentTransactions(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (asset.name) {
      fetchAssetTransactions();
    }
  }, [asset.name]);

  // Format transaction for display
  const formatTransaction = (tx) => {
    // Use the actual address from transaction data
    const shortAddress = tx.to || `${asset.name.toLowerCase()}1...xyz`;
    
    return {
      type: tx.type,
      amount: tx.amount,
      asset: tx.coin || asset.name,
      sub: tx.sub || `${tx.amount} ${tx.coin || asset.name}`,
      to: shortAddress  // Add the address here
    };
  };

  // Default transactions if API fails
  const defaultTransactions = [
    { type: "Sent", amount: "- $400.50", asset: asset.name },
    { type: "Received", amount: "+ $400.50", asset: asset.name },
    { type: "Pending", amount: "$400.50", asset: asset.name },
  ];

  const displayTransactions = recentTransactions.length > 0 
    ? recentTransactions.map(formatTransaction)
    : defaultTransactions;

  return (
    <div className="bw-wrapper">
      <div className="bw-card">

        {/* Header */}
        <div className="bw-header">
          <span className="bw-back" onClick={() => navigate(-1)}>←</span>

          <div className="bw-coin">
            <img src={getIcon()} alt={asset.name} />
            <h3>{asset.sub}</h3>
          </div>
        </div>

        {/* Balance */}
        <div className="bw-balance">
          <h1>{asset.balance || "0"}</h1>
          <p className="bw-price">{asset.price}</p>
          <p className={`bw-change ${asset.change?.includes("-") ? "red" : "green"}`}>
            {asset.change || "0%"} 24hr
          </p>
        </div>

        {/* Chart */}
        <div className="bw-chart">
          <svg viewBox="0 0 300 120">
            <polyline
              fill="none"
              stroke="#cfefff"
              strokeWidth="2"
              points="0,40 30,30 60,50 90,45 120,65 150,55 180,75 210,85 240,90 270,70 300,60"
            />
          </svg>
        </div>

        {/* Tabs */}
        <div className="bw-tabs">
          <span>D</span>
          <span>W</span>
          <span>M</span>
          <span className="active">3M</span>
          <span>6M</span>
          <span>1Y</span>
          <span>ALL</span>
        </div>

        {/* Actions */}
        <div className="bw-actions">
          <Action label="Send" icon="↗" onClick={() => navigate("/send", { state: asset })} />
          <Action label="Receive" icon="↙" onClick={() => navigate("/receive", { state: asset })} />
          <Action label="History" icon="⟳" onClick={() => navigate("/history")} />
        </div>

        {/* Recent Transactions */}
        <div className="bw-transactions">
          {loading ? (
            <div className="bw-loading">
              <div className="spinner-small"></div>
              <p>Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="bw-error">
              <p>⚠️ {error}</p>
            </div>
          ) : (
            displayTransactions.map((tx, index) => (
              <Transaction 
                key={index} 
                type={tx.type} 
                amount={tx.amount} 
                asset={tx.asset} 
                sub={tx.sub}
                to={tx.to}  // Pass the address here
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

const Action = ({ icon, label, onClick }) => (
  <div className="bw-action" onClick={onClick}>
    <div className="bw-action-icon">{icon}</div>
    <p>{label}</p>
  </div>
);

// Updated Transaction component to accept and display the 'to' address
const Transaction = ({ type, amount, asset, sub, to }) => (
  <div className="bw-tx">
    <div className="bw-tx-left">
      <div className="bw-tx-icon">{asset.charAt(0)}</div>
      <div>
        <strong>{type}</strong>
        {/* <span>To: {to}</span>  Changed from static to dynamic */}
        {sub && <small className="btc-amount">{sub}</small>}
      </div>
    </div>
    <span className={`bw-tx-amount ${type.toLowerCase()}`}>{amount}</span>
  </div>
);

export default BitcoinWallet;