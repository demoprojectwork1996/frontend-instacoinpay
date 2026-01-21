import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";
import "./SendTransfer.css";
import btcIcon from "../assets/btc.png";

/* ================= FORMAT ================= */
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

  /* ================= ASSET ================= */
  const asset = {
    name: state?.name || "BTC",
    sub: state?.sub || "Bitcoin",
    icon: state?.icon || btcIcon,
    originalAsset: state?.originalAsset || null,
  };

  /* ================= FORM ================= */
  const [formData, setFormData] = useState({
    toAddress: "",
    amount: "", // ⬅️ USD INPUT
    notes: "",
  });

  /* ================= STATES ================= */
  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0); // BTC (derived)

  const [loading, setLoading] = useState(false);
  const [transferResult, setTransferResult] = useState(null);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  /* ================= INIT FROM DASHBOARD ================= */
  useEffect(() => {
    if (!asset.originalAsset) {
      navigate("/dashboard");
      return;
    }

    const { balance, balanceValue, currentPrice } = asset.originalAsset;

    setCoinBalance(balance);
    setUsdBalance(balanceValue);
    setPrice(currentPrice);
  }, []);

  /* ================= USD → BTC CONVERSION ================= */
  useEffect(() => {
    if (!formData.amount || !price) {
      setCoinAmount(0);
      return;
    }

    setCoinAmount(Number(formData.amount) / price);
  }, [formData.amount, price]);

  /* ================= INPUT ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ================= MAX (USD) ================= */
  const handleMaxAmount = () => {
    setFormData((p) => ({
      ...p,
      amount: usdBalance.toFixed(2), // ⬅️ USD MAX
    }));
  };

  /* ================= TRANSFER ================= */
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

    if (coinAmount > coinBalance) {
      setPopup({
        show: true,
        message: "Insufficient balance",
        success: false,
      });
      return;
    }

    try {
      setLoading(true);

      // 🚨 BACKEND ALWAYS RECEIVES BTC
      const res = await API.post("/transfer", {
        asset: asset.name.toLowerCase(),
        toAddress: formData.toAddress,
        amount: Number(coinAmount.toFixed(8)), // BTC
        notes: formData.notes,
      });

      setTransferResult(res.data.data);

      setPopup({
        show: true,
        message: "Transfer successful",
        success: true,
      });
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

  /* ================= UI (UNCHANGED) ================= */
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
            Balance: <b>{formatCurrency(usdBalance)} {asset.name}</b>
          </div>
        </div>

        {/* AMOUNT (USD) */}
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

      {/* ✅ ICON */}
      <div className={`stx-icon-box ${popup.success ? "stx-success" : "stx-error"}`}>
        <svg viewBox="0 0 100 100" className="stx-icon">
          <circle cx="50" cy="50" r="45" className="stx-circle" />
          <path
            className="stx-path"
            d={
              popup.success
                ? "M30 52 L45 65 L70 38"   // ✔ Success tick
                : "M35 35 L65 65 M65 35 L35 65" // ❌ Error cross
            }
          />
        </svg>
      </div>

      {/* TITLE */}
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
            navigate("/transaction/" + transferResult._id);
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
