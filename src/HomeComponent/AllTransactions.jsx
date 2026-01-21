// AllTransactions.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AllTransactions.css";

/* ================= HELPERS ================= */
const normalizeStatus = (tx, index, groupDate) => {
  const hasRealId = Boolean(tx.id);
  const backendStatus = tx.status?.toLowerCase();

  if (hasRealId || backendStatus === "completed") return "Successful";
  if (backendStatus === "failed") return "Failed";
  return "Pending";
};

const formatAmount = (amount) => {
  if (typeof amount === "number") {
    return amount.toFixed(8);
  }
  return amount || "0";
};

/* ================= COMPONENT ================= */
const AllTransactions = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  const fetchGroupedTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        "https://backend-instacoinpay-1.onrender.com/api/history/grouped/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const normalized = (res.data?.data || []).map((group) => ({
        date: group.date,
        items: (group.items || []).map((tx, index) => ({
          id: tx.id || `${group.date}-${index}`,
          type: tx.type || "Unknown",
          coin: tx.coin || "N/A",
          to: tx.to || "—",
          amount: formatAmount(tx.amount),
          sub: tx.sub || "",
          status: normalizeStatus(tx, index, group.date),
          date: group.date,
        })),
      }));

      setTransactions(normalized);
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedTransactions();
  }, []);

  /* ================= UI ================= */
  return (
    <div className="tx-wrapper">
      <div className="tx-card">

        {/* HEADER */}
        <div className="tx-header">
          <span className="tx-back" onClick={() => navigate(-1)}>←</span>
          <h2>All Transactions</h2>
        </div>

        {/* STATES */}
        {loading && <p className="tx-loading">Loading...</p>}
        {error && <p className="tx-error">{error}</p>}

        {!loading && !error && transactions.length === 0 && (
          <p className="tx-empty">No transactions found</p>
        )}

        {/* TRANSACTIONS */}
        {transactions.map((group, i) => (
          <div key={i}>
            <p className="tx-date">{group.date}</p>

            {group.items.map((tx) => (
              <div
                key={tx.id}
                className="tx-row clickable"
                onClick={() =>
                  navigate(`/transaction/${tx.id}`, { state: tx })
                }
              >
                {/* LEFT */}
                <div className="tx-left">
                  <div className={`tx-icon ${tx.type.toLowerCase()}`}>
                    {tx.coin?.charAt(0)}
                  </div>
                  <div>
                    <strong>{tx.type}</strong>
                    <span>To: {tx.to}</span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="tx-right">
                  <span
                    className={`tx-amount ${
                      tx.type.toLowerCase() === "send" ||
                      tx.type.toLowerCase() === "sent"
                        ? "sent"
                        : "received"
                    }`}
                  >
                    {tx.amount}
                  </span>

                  {tx.sub && <small>{tx.sub}</small>}

                  <small className={`tx-status ${tx.status.toLowerCase()}`}>
                    {tx.status}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
};

export default AllTransactions;
