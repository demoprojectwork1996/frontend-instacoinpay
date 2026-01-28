import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function UserDeposit() {
  const [wallet, setWallet] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const selected = localStorage.getItem("SELECTED_CURRENCY");

    if (!selected) {
      window.location.href = "/select-deposit-currency";
      return;
    }

    setCurrency(selected);

    const fetchWallet = async () => {
      try {
        const res = await axios.get(
          `https://backend-instacoinpay-1.onrender.com/api/deposit-wallet/${selected}`
        );
        setWallet(res.data.wallet.address);
      } catch {
        setWallet("");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const copyAddress = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet);
    setCopied(true);
    
    // Reset the "Copied" text back to "Copy Address" after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleConfirmPayment = () => {
    setShowPopup(true);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>{currency} Deposit</h2>

        {loading && <p>Loading wallet...</p>}

        {!loading && !wallet && (
          <p style={{ color: "red", marginTop: "10px" }}>
            Deposit wallet not available. Contact support.
          </p>
        )}

        <div
          style={{
            ...styles.timerBox,
            background:
              timeLeft <= 60
                ? "#fee2e2"
                : timeLeft <= 300
                ? "#fef3c7"
                : "#dbeafe",
          }}
        >
          <div style={styles.timerLabel}>Pay Within</div>
          <div
            style={{
              ...styles.timerValue,
              color:
                timeLeft <= 60
                  ? "#dc2626"
                  : timeLeft <= 300
                  ? "#d97706"
                  : "#2563eb",
            }}
          >
            {timeLeft > 0 ? formatTime(timeLeft) : "EXPIRED"}
          </div>
          {timeLeft <= 0 && (
            <div style={styles.expiredText}>Please refresh and try again</div>
          )}
        </div>

        {!loading && wallet && (
          <>
            <div style={styles.qrContainer}>
              <QRCodeCanvas value={wallet} size={100} />
            </div>

            <p style={{ marginTop: "15px", color: "#64748b", fontSize: "14px" }}>
              <b>Network:</b> {currency}
            </p>

            <div style={styles.addressBox}>{wallet}</div>

            <button
              style={{
                ...styles.copyBtn,
                opacity: timeLeft <= 0 ? 0.5 : 1,
                cursor: timeLeft <= 0 ? "not-allowed" : "pointer",
                background: copied ? "#10b981" : "#2563eb",
              }}
              onClick={copyAddress}
              disabled={timeLeft <= 0}
            >
              {copied ? "Copied ✓" : "Copy Address"}
            </button>

            <button
              style={{
                ...styles.copyBtn,
                opacity: timeLeft <= 0 ? 0.5 : 1,
                cursor: timeLeft <= 0 ? "not-allowed" : "pointer",
              }}
              onClick={handleConfirmPayment}
              disabled={timeLeft <= 0}
            >
              Confirm Payment
            </button>
          </>
        )}

        {showPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "30px",
                width: "90%",
                maxWidth: "360px",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ marginBottom: "15px" }}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="32" cy="32" r="28" fill="#fef3c7">
                    <animate
                      attributeName="r"
                      from="26"
                      to="28"
                      dur="1.2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="1"
                      to="0.85"
                      dur="1.2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  <rect
                    x="30"
                    y="16"
                    width="4"
                    height="24"
                    rx="2"
                    fill="#d97706"
                  />

                  <circle cx="32" cy="44" r="3" fill="#d97706" />
                </svg>
              </div>

              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1e293b",
                  marginBottom: "10px",
                }}
              >
                Payment in Review
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "#475569",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                }}
              >
                Your payment is under pending review.
                <br />
                <br />
                Send a Payment Screenshot to our WhatsApp Chat Support or Email:
                <br />
                <b>instacoinxpay@gmail.com</b>
                <br />
                <b>contact@instacoinxpay.com</b>
              </p>

              <button
                onClick={() => setShowPopup(false)}
                style={{
                  padding: "10px 16px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0b1e3c 0%, #1e3a5f 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "30px",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  timerBox: {
    padding: "0px",
    borderRadius: "12px",
    marginBottom: "20px",
    transition: "background 0.3s ease",
  },
  timerLabel: {
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    color: "#64748b",
    letterSpacing: "0.5px",
  },
  timerValue: {
    fontSize: "20px",
    fontWeight: "700",
    marginTop: "5px",
    fontFamily: "monospace",
    transition: "color 0.3s ease",
  },
  expiredText: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#dc2626",
    fontWeight: "600",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "15px",
    marginTop: "0",
  },
  qrContainer: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
    display: "inline-block",
    marginTop: "0px",
  },
  addressBox: {
    marginTop: "15px",
    background: "#f1f5f9",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
    wordBreak: "break-all",
    color: "#334155",
    fontFamily: "monospace",
    border: "1px solid #e2e8f0",
  },
  copyBtn: {
    marginTop: "15px",
    padding: "12px",
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
  },
  warning: {
    marginTop: "20px",
    padding: "12px",
    background: "#fef3c7",
    borderRadius: "8px",
    fontSize: "10px",
    color: "#92400e",
    lineHeight: "1.5",
    border: "1px solid #fde68a",
  },
};