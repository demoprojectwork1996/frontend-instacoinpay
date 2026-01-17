import { useState } from "react";
import axios from "axios";
import "./AdBulkTransaction.css";

const COINS = [
  "BTC",
  "ETH",
  "BNB",
  "SOL",
  "XRP",
  "DOGE",
  "LTC",
  "TRX",
  "USDT-BNB",
  "USDT-TRON",
];

export default function AdBulkTransaction() {
  const [type, setType] = useState("CREDIT");
  const [coin, setCoin] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     POST API CALL
  ========================= */
  const handleBulkTransaction = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/bulk-transaction",
        {
          type,
          coin,
          amount: Number(amount),
        }
      );

      alert(
        `Bulk Transaction Completed!\n\n` +
          `Total Users: ${response.data.totalUsers}\n` +
          `Success: ${response.data.success}\n` +
          `Failed: ${response.data.failed}`
      );

      setAmount("");
    } catch (error) {
      console.error("Bulk transaction error:", error);
      alert(
        error.response?.data?.error ||
          "Bulk transaction failed. Check server logs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bulk-page">
      <div className="bulk-card">
        <h1 className="bulk-title">Bulk Credit / Debit</h1>

        <p className="bulk-subtitle">
          Users will be processed automatically in batches of <b>100</b>.
          Each user will receive an individual transaction entry.
        </p>

        {/* Transaction Type */}
        <div className="bulk-group">
          <label>Transaction Type</label>
          <div className="bulk-toggle">
            <button
              type="button"
              className={type === "CREDIT" ? "active" : ""}
              onClick={() => setType("CREDIT")}
            >
              Credit
            </button>
            <button
              type="button"
              className={type === "DEBIT" ? "active" : ""}
              onClick={() => setType("DEBIT")}
            >
              Debit
            </button>
          </div>
        </div>

        {/* Coin Selection */}
        <div className="bulk-group">
          <label>Select Coin</label>
          <select value={coin} onChange={(e) => setCoin(e.target.value)}>
            {COINS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="bulk-group">
          <label>Amount</label>
          <input
            type="number"
            placeholder={`Enter ${coin} amount`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Info Box */}
        <div className="bulk-info">
          ⚠️ This action will apply the selected transaction to all users
          in batches of 100. Please double-check before proceeding.
        </div>

        {/* Action Button */}
        <button
          className="bulk-action-btn"
          onClick={handleBulkTransaction}
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : `Execute Bulk ${type}`}
        </button>
      </div>
    </div>
  );
}