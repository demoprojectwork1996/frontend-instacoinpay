import React, { useEffect, useState } from "react";
import "./BitcoinPayment.css";
import logo from "../assets/logo.png";
import qr from "../assets/qr.png";

const BitcoinPayment = () => {
  const [time, setTime] = useState(20 * 60); // 20 minutes
  const [copied, setCopied] = useState(false);

  const address = "bc1q7yumpasq7j5uz8gmlx08r";

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (t) => {
    const min = String(Math.floor(t / 60)).padStart(2, "0");
    const sec = String(t % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="btc-wrapper">
      <div className="btc-header">
        <img src={logo} alt="logo" />
      </div>

      <div className="btc-card">
        <button className="close-btn">✕</button>

        <h2>Bitcoin Payment</h2>
        <p className="pay-text">Pay within</p>
        <div className="timer">{formatTime(time)}</div>

        <img src={qr} alt="QR Code" className="qr-img" />

        <p className="network">
          Network: <strong>Bitcoin</strong>
        </p>

        <p className="label">Payment Address</p>
        <div className="address-box">{address}</div>

        <button
          className={`copy-btn ${copied ? "copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? "✓ Copied" : "📋 Copy Address"}
        </button>

        <p className="note">
          <strong>Note:</strong> After payment send screenshot to chat support or
          instacoinxpay@gmail.com or contact@instacoinxpay.com
        </p>

        <button className="confirm-btn">Confirm Payment</button>
      </div>
    </div>
  );
};

export default BitcoinPayment;
