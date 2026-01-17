// AllTransactions.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AllTransactions.css";

const AllTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroupedTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(
        "https://backend-instacoinpay-1.onrender.com/api/history/grouped/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const normalized = res.data.data.map((group) => ({
        date: group.date,
        items: group.items.map((tx, index) => ({
          id: tx.id || `${group.date}-${index}`,
          type: tx.type,
          coin: tx.coin,
          to: tx.to,
          amount: tx.amount,
          sub: tx.sub,
          status: tx.status || "Pending",
          date: group.date,
        })),
      }));

      setTransactions(normalized);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedTransactions();
  }, []);

  return (
    <div className="tx-wrapper">
      <div className="tx-card">

        <div className="tx-header">
          <span className="tx-back" onClick={() => navigate(-1)}>←</span>
          <h2>All Transactions</h2>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

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
                <div className="tx-left">
                  <div className={`tx-icon ${tx.type.toLowerCase()}`}>
                    {tx.coin[0]}
                  </div>
                  <div>
                    <strong>{tx.type}</strong>
                    <span>To: {tx.to}</span>
                  </div>
                </div>

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
  <small>{tx.sub}</small>
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
