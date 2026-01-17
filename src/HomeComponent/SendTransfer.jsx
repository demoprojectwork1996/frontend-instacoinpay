import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SendTransfer.css";
import btcIcon from "../assets/btc.png";

const SendTransfer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const asset = state || {
    name: "BTC",
    sub: "Bitcoin",
    icon: btcIcon,
  };

  /* ===== LOGIC (UNCHANGED) ===== */
  const [formData, setFormData] = useState({
    toAddress: "",
    amount: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState("0");
  const [transferResult, setTransferResult] = useState(null);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://backend-instacoinpay-1.onrender.com/api/transfer/balance",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const balance =
        res.data.data.walletBalances[asset.name.toLowerCase()] || 0;

      setAvailableBalance(`${balance} ${asset.name}`);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleMaxAmount = () => {
    const balance = parseFloat(availableBalance);
    if (!isNaN(balance)) {
      setFormData((p) => ({
        ...p,
        amount: balance.toFixed(8),
      }));
    }
  };

  const handleTransfer = async () => {
    if (!formData.toAddress || !formData.amount) {
      setPopup({ show: true, message: "Enter all details", success: false });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/transfer",
        {
          asset: asset.name.toLowerCase(),
          toAddress: formData.toAddress,
          amount: Number(formData.amount),
          notes: formData.notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransferResult(res.data.data.transfer);
      setPopup({ show: true, message: "Transfer successful", success: true });
      fetchWalletBalance();
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

  /* ===== UI ===== */
  return (
    <div className="st-wrapper">
      <div className="st-card">
        {/* HEADER */}
        <div className="st-header">
          <span className="st-back-btn" onClick={() => navigate(-1)}>
            ←
          </span>
          <h2>Transfer {asset.name}</h2>
        </div>

        {/* RECIPIENT */}
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

        {/* COIN */}
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
            Balance: <b>{availableBalance}</b>
          </div>
        </div>

        {/* AMOUNT */}
        <div className="st-group">
          <label>Amount</label>
          <div className="st-amount-box">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleMaxAmount}>
              MAX
            </button>
          </div>
        </div>

        <button
          className="st-confirm-btn"
          onClick={handleTransfer}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Transfer"}
        </button>
      </div>

      {/* ===== POPUP UI (REPLACED ONLY) ===== */}
   {popup.show && (
  <div className="stx-popup-overlay">
    <div className={`stx-popup ${popup.success ? "stx-success" : "stx-error"}`}>

      {/* ICON */}
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

      {/* HEADING */}
      <h2 className="stx-popup-title">
        {popup.success ? "Transaction Successful!" : "Transaction Failed"}
      </h2>

      {/* MESSAGE */}
      <p className="stx-popup-text">
        {popup.success
          ? "Your amount will be credited after successful network confirmation"
          : popup.message}
      </p>

      {/* BUTTON */}
      <button
        className="stx-popup-btn"
        onClick={() => {
          setPopup({ ...popup, show: false });
          if (popup.success && transferResult) {
            navigate("/admin/transaction/" + transferResult._id);
          }
        }}
      >
        OK
      </button>
    </div>
  </div>
)}



 
    </div>
  );
};

export default SendTransfer;
