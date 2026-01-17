import { useNavigate } from "react-router-dom";

const currencies = [
  { label: "Bitcoin", code: "BTC" },
  { label: "Ethereum", code: "ETH" },
  { label: "Binance (BNB)", code: "BNB" },
  { label: "Tron", code: "TRX" },
  { label: "USDT (BEP20)", code: "USDT_BEP20" },
  { label: "USDT (TRC20)", code: "USDT_TRC20" }
];

export default function SelectDepositCurrency() {
  const navigate = useNavigate();

  const handleSelect = (code) => {
    // ✅ THIS IS THE MOST IMPORTANT LINE
    localStorage.setItem("SELECTED_CURRENCY", code);

    // Go to deposit page AFTER selection
    navigate("/deposit");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Select Deposit Currency</h2>

        {currencies.map((c) => (
          <div
            key={c.code}
            style={styles.item}
            onClick={() => handleSelect(c.code)}
          >
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#355da6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "#2f5597",
    padding: "25px",
    borderRadius: "20px",
    width: "360px",
    color: "#fff"
  },
  item: {
    background: "#ffffff",
    color: "#000",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "12px",
    cursor: "pointer",
    fontWeight: "600"
  }
};