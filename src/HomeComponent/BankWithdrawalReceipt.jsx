import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BankWithdrawalReceipt.css";
import logo from "../assets/logo.png";

// Coin icons (SAME AS BankWithdrawal)
import btc from "../assets/btc.png";
import eth from "../assets/eth.png";
import bnb from "../assets/bnb.png";
import sol from "../assets/sol.png";
import xrp from "../assets/xrp.png";
import doge from "../assets/doge.png";
import ltc from "../assets/ltc.png";
import trx from "../assets/trx.png";
import usdt from "../assets/usdt.png";           // BEP20
import usdttether from "../assets/usdttether.png"; // TRC20

const coinIcons = {
  btc,
  eth,
  bnb,
  sol,
  xrp,
  doge,
  ltc,
  trx,
  usdtTron: usdttether,
  usdtBnb: usdt,
};

const BankWithdrawalReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const receipt = location.state || {};

  // =====================
  // CARD & TRANSFER STATUS
  // =====================
  const cardStatus = (receipt.cardStatus || "INACTIVE").toUpperCase();
  const transferStatus = receipt.transferStatus;

  // =====================
  // RECEIPT STATUS LOGIC
  // =====================
  const isPending =
    transferStatus === "processing" &&
    ["ACTIVE", "ACTIVATE", "PENDING"].includes(cardStatus);

  const transactionStatus = isPending ? "Pending" : "Failed";

  if (!receipt.transferId) {
    return <p>No transaction data found</p>;
  }

  // =====================
  // ASSET NORMALIZATION (ICON FIX)
  // =====================
  const normalizedAsset = (() => {
    const asset = String(receipt.asset || "")
      .replace(/[-_]/g, "")
      .toLowerCase();

    const map = {
      btc: "btc",
      eth: "eth",
      bnb: "bnb",
      sol: "sol",
      xrp: "xrp",
      doge: "doge",
      ltc: "ltc",
      trx: "trx",
      usdttron: "usdtTron",
      usdttrc20: "usdtTron",
      usdtbnb: "usdtBnb",
      usdtbep20: "usdtBnb",
    };

    return map[asset] || asset;
  })();

  const assetDisplayName =
    normalizedAsset === "usdtTron" || normalizedAsset === "usdtBnb"
      ? "USDT"
      : normalizedAsset.toUpperCase();

  const icon = coinIcons[normalizedAsset];

  return (
    <div className="bank-withdrawal-receipt-container">
      <div className="bank-withdrawal-receipt-wrapper">
        <img
          src={logo}
          alt="logo"
          className="bank-withdrawal-receipt-header-logo"
        />

        <h2>Transaction Receipt</h2>

        {/* STATUS */}
        <div
          className={`bank-withdrawal-receipt-item transaction-status ${
            isPending ? "pending" : "failed"
          }`}
        >
          <span>Status</span>

          <div className="status-indicator">
            {isPending ? (
              <svg className="pending-svg" width="22" height="22" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
              </svg>
            ) : (
              <svg className="failed-svg" width="22" height="22" viewBox="0 0 24 24">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            )}
            <strong>{transactionStatus}</strong>
          </div>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Transaction ID</span>
          <strong>{receipt.transferId}</strong>
        </div>

        {/* 🔥 ASSET WITH ICON */}
        <div className="bank-withdrawal-receipt-item">
          <span>Asset</span>
          <div className="bank-withdrawal-asset">
            {icon && (
              <img
                key={normalizedAsset}
                src={icon}
                alt={assetDisplayName}
              />
            )}
            <strong>{assetDisplayName}</strong>
          </div>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Crypto Amount</span>
          <strong>{receipt.amount}</strong>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>USD Amount</span>
          <strong>${receipt.usdAmount}</strong>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Full Name</span>
          <strong>{receipt.fullName}</strong>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Bank Name</span>
          <strong>{receipt.bankName}</strong>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Account Number</span>
          <strong>{receipt.accountNumber}</strong>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Swift Code</span>
          <strong>{receipt.swiftCode}</strong>
        </div>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BankWithdrawalReceipt;
