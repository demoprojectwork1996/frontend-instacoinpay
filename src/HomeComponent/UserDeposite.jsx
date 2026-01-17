import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function UserDeposit() {
  const [wallet, setWallet] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selected = localStorage.getItem("SELECTED_CURRENCY");

    // 🔒 Enforce correct flow
    if (!selected) {
      window.location.href = "/select-deposit-currency";
      return;
    }

    setCurrency(selected);

    axios
      .get(`https://backend-instacoinpay-1.onrender.com/api/deposit-wallet/${selected}`)
      .then((res) => {
        setWallet(res.data.wallet.address);
      })
      .catch(() => {
        setWallet("");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const copyAddress = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet);
    alert("Wallet address copied");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>{currency} Deposit</h2>

        {loading && <p>Loading wallet...</p>}

        {!loading && !wallet && (
          <p style={{ color: "red", marginTop: "10px" }}>
            Deposit wallet not available. Contact support.
          </p>
        )}

        {!loading && wallet && (
          <>
            <QRCodeCanvas value={wallet} size={180} />

            <p style={{ marginTop: "10px" }}>
              <b>Network:</b> {currency}
            </p>

            <div style={styles.addressBox}>{wallet}</div>

            <button style={styles.copyBtn} onClick={copyAddress}>
              Copy Address
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b1e3c",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "25px",
    width: "340px",
    textAlign: "center"
  },
  addressBox: {
    marginTop: "10px",
    background: "#f1f5f9",
    padding: "8px",
    borderRadius: "6px",
    fontSize: "12px",
    wordBreak: "break-all"
  },
  copyBtn: {
    marginTop: "12px",
    padding: "8px",
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};
