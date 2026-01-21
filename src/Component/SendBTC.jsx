import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SendBTC.css";
import logo from "../assets/logo.png";

// Coin icons
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

const API = "https://backend-instacoinpay-1.onrender.com/api/transfer";

/* ================= COINS ================= */
const coins = [
  { key: "btc", label: "Bitcoin", symbol: "BTC", icon: btc },
  { key: "eth", label: "Ethereum", symbol: "ETH", icon: eth },
  { key: "bnb", label: "BNB", symbol: "BNB", icon: bnb },
  { key: "sol", label: "Solana", symbol: "SOL", icon: sol },
  { key: "xrp", label: "XRP", symbol: "XRP", icon: xrp },
  { key: "doge", label: "Dogecoin", symbol: "DOGE", icon: doge },
  { key: "ltc", label: "Litecoin", symbol: "LTC", icon: ltc },
  { key: "trx", label: "TRX", symbol: "TRX", icon: trx },
  { key: "usdtTron", label: "USDT (TRON)", symbol: "USDT-TRC20", icon: usdt },
  { key: "usdtBnb", label: "USDT (BNB)", symbol: "USDT-BEP20", icon: usdttether },
];

/* ================= FORMAT ================= */
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

export default function SendBTC() {
  const navigate = useNavigate();

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [open, setOpen] = useState(false);

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= POPUP ================= */
  const [popup, setPopup] = useState({
    show: false,
    success: false,
    message: "",
  });

  const [transferResult, setTransferResult] = useState(null);

  /* ================= PRICE FETCH ================= */
  const fetchLivePrice = async (coinKey) => {
    const map = {
      btc: "bitcoin",
      eth: "ethereum",
      bnb: "binancecoin",
      sol: "solana",
      xrp: "ripple",
      doge: "dogecoin",
      ltc: "litecoin",
      trx: "tron",
      usdtTron: "tether",
      usdtBnb: "tether",
    };

    const id = map[coinKey];
    if (!id) return 0;

    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      { params: { ids: id, vs_currencies: "usd" } }
    );

    return res.data[id]?.usd || 0;
  };

  /* ================= FETCH BALANCE ================= */
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const balances = res.data.data.walletBalances || {};
      const bal = balances[selectedCoin.key] || 0;

      setCoinBalance(bal);

      const livePrice = await fetchLivePrice(selectedCoin.key);
      setPrice(livePrice);
      setUsdBalance(bal * livePrice);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [selectedCoin]);

  /* ================= USD → COIN ================= */
  useEffect(() => {
    if (!amount || !price) {
      setCoinAmount(0);
      return;
    }
    setCoinAmount(Number(amount) / price);
  }, [amount, price]);

  /* ================= MAX ================= */
  const handleMax = () => {
    setAmount(usdBalance.toFixed(2));
  };

  /* ================= WITHDRAW ================= */
  const handleWithdraw = async () => {
    if (!address || !amount) {
      setPopup({ show: true, success: false, message: "Enter address & amount" });
      return;
    }

    if (coinAmount > coinBalance) {
      setPopup({ show: true, success: false, message: "Insufficient balance" });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        API,
        {
          asset: selectedCoin.key,
          toAddress: address,
          amount: Number(coinAmount.toFixed(8)),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransferResult(res.data.data);
      setPopup({
        show: true,
        success: true,
        message: "Transfer successful",
      });

      setAddress("");
      setAmount("");
      fetchBalance();
    } catch (err) {
      setPopup({
        show: true,
        success: false,
        message: err.response?.data?.error || "Transfer Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="btc-send-page">
      <button className="btc-back-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div className="btc-send-logo">
        <img src={logo} alt="logo" />
      </div>

      <div className="btc-send-card">
        <h2 className="btc-title">SEND</h2>

        <div className="btc-form-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Wallet Address"
          />
        </div>

        <div className="btc-form-group">
          <label>Network</label>

          <div className="btc-dropdown" onClick={() => setOpen(!open)}>
            <div className="btc-selected">
              <img src={selectedCoin.icon} alt="" />
              <span>{selectedCoin.symbol}</span>
            </div>
            <span className={`arrow ${open ? "rotate" : ""}`}>▼</span>
          </div>

          {open && (
            <div className="btc-dropdown-menu">
              {coins.map((coin) => (
                <div
                  key={coin.key}
                  className="btc-dropdown-item"
                  onClick={() => {
                    setSelectedCoin(coin);
                    setOpen(false);
                  }}
                >
                  <div className="btc-coin-left">
                    <img src={coin.icon} alt={coin.symbol} />
                    <div className="btc-coin-text">
                      <strong>{coin.symbol}</strong>
                      <small>{coin.label}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="btc-form-group">
          <label>Withdrawal Amount</label>
          <div className="btc-amount-box">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="btc-amount-right">
              <span>USD</span>
              <span className="btc-max" onClick={handleMax}>
                MAX
              </span>
            </div>
          </div>
          <small>
            ≈ {coinAmount.toFixed(8)} {selectedCoin.symbol}
          </small>
        </div>

        <div className="btc-available">
          <span>Available</span>
          <span>
            {formatCurrency(usdBalance)} {selectedCoin.symbol}
          </span>
        </div>

        <p className="btc-info">
          * Make sure the address matches the selected network.
        </p>

        <div className="btc-bottom">
          <button
            className="btc-withdraw-btn"
            onClick={handleWithdraw}
            disabled={loading}
          >
            {loading ? "Processing..." : "Transfer Amount"}
          </button>
        </div>
      </div>

      {/* ================= POPUP (REUSED STYLE) ================= */}
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
                ? "M30 52 L45 65 L70 38" // ✔ green tick
                : "M35 35 L65 65 M65 35 L35 65" // ❌ red cross
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
}
