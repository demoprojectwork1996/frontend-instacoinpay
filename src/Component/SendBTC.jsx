import React, { useEffect, useState } from "react";
import axios from "axios";
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

export default function SendBTC() {
  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [open, setOpen] = useState(false);

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH BALANCE ================= */
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const bal = res.data.data.walletBalances[selectedCoin.key] || 0;
      setBalance(bal);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [selectedCoin]);

  /* ================= MAX ================= */
  const handleMax = () => {
    setAmount(balance);
  };

  /* ================= WITHDRAW ================= */
  const handleWithdraw = async () => {
    if (!address || !amount) {
      alert("Enter address & amount");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        API,
        {
          asset: selectedCoin.key,
          toAddress: address,
          amount: Number(amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Transfer Successful");
      setAddress("");
      setAmount("");
      fetchBalance();
    } catch (err) {
      alert(err.response?.data?.error || "Transfer Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="btc-send-page">
      {/* LOGO */}
      <div className="btc-send-logo">
        <img src={logo} alt="logo" />
      </div>

      {/* CARD */}
      <div className="btc-send-card">
        <h2 className="btc-title">SEND</h2>

        {/* ADDRESS */}
        <div className="btc-form-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Wallet Address"
          />
        </div>

        {/* NETWORK */}
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

        {/* AMOUNT */}
        <div className="btc-form-group">
          <label>Withdrawal Amount</label>
          <div className="btc-amount-box">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="btc-amount-right">
              <span>{selectedCoin.symbol}</span>
              <span className="btc-max" onClick={handleMax}>
                MAX
              </span>
            </div>
          </div>
        </div>

        {/* BALANCE */}
        <div className="btc-available">
          <span>Available</span>
          <span>
            {balance} {selectedCoin.symbol}
          </span>
        </div>

        {/* INFO */}
        <p className="btc-info">
          * Make sure the address matches the selected network.
        </p>

        {/* FOOTER */}
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
    </div>
  );
}
