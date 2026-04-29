import "./SwapPage.css";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://backend-instacoinpay-1.onrender.com";

const TOKENS = [
  { symbol: "BTC",      name: "Bitcoin",       color: "#F7931A", bg: "#FEF3E2" },
  { symbol: "ETH",      name: "Ethereum",      color: "#627EEA", bg: "#EEF1FD" },
  { symbol: "USDT_TRC", name: "USDT TRC20",    color: "#26A17B", bg: "#E2F5EE" },
  { symbol: "USDT_BEP", name: "USDT BEP20",    color: "#F0B90B", bg: "#FEF8DB" },
  { symbol: "BNB",      name: "BNB",           color: "#F0B90B", bg: "#FEF8E1" },
  { symbol: "SOL",      name: "Solana",        color: "#9945FF", bg: "#F0E8FF" },
  { symbol: "DOGE",     name: "Dogecoin",      color: "#C2A633", bg: "#FAF3DA" },
  { symbol: "XRP",      name: "Ripple",        color: "#23292F", bg: "#E8EAED" },
  { symbol: "TRX",      name: "Tron",          color: "#EB0029", bg: "#FEE6EA" },
  { symbol: "LTC",      name: "Litecoin",      color: "#A5A9B0", bg: "#F0F1F3" },
];

// Frontend symbol → backend asset key
const getAssetKey = (symbol) => {
  const keyMap = {
    BTC:      "btc",
    ETH:      "eth",
    USDT_TRC: "usdtTron",
    USDT_BEP: "usdtBnb",
    BNB:      "bnb",
    SOL:      "sol",
    DOGE:     "doge",
    XRP:      "xrp",
    TRX:      "trx",
    LTC:      "ltc",
  };
  return keyMap[symbol] || symbol.toLowerCase();
};

// Backend coin key → frontend symbol
const backendKeyToSymbol = (coinKey) => {
  const reverseMap = {
    btc:      "BTC",
    eth:      "ETH",
    usdttron: "USDT_TRC",
    usdtbnb:  "USDT_BEP",
    bnb:      "BNB",
    sol:      "SOL",
    doge:     "DOGE",
    xrp:      "XRP",
    trx:      "TRX",
    ltc:      "LTC",
  };
  return reverseMap[coinKey.toLowerCase()] || coinKey.toUpperCase();
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const TokenIcon = ({ token, size = 24 }) => {
  const label =
    token.symbol === "USDT_TRC" ? "U·T"
    : token.symbol === "USDT_BEP" ? "U·B"
    : token.symbol[0];

  return (
    <div
      style={{
        width: size,
        height: size,
        background: token.bg,
        color: token.color,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: "800",
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  );
};

export default function SwapPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [balances, setBalances] = useState({});
  const [prices, setPrices] = useState({});
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[2]);
  const [fromAmount, setFromAmount] = useState("");
  const [picker, setPicker] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [swapping, setSwapping] = useState(false);

  // ─── helpers ───────────────────────────────────────────
  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  // ─── parse balance response into local state shape ─────
  const parseBalances = (data) => {
    const balanceData = {};
    const priceData = {};
    data.forEach((asset) => {
      const symbol = backendKeyToSymbol(asset.coin);
      balanceData[symbol] = {
        coinBalance: (balanceData[symbol]?.coinBalance || 0) + (asset.balance || 0),
        usdBalance:  (balanceData[symbol]?.usdBalance  || 0) + (asset.balanceValue || 0),
        price: asset.currentPrice || 0,
      };
      priceData[symbol] = asset.currentPrice || 0;
    });
    return { balanceData, priceData };
  };

  // ─── fetch fresh balances from backend ─────────────────
  const fetchBalances = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/wallet/balances`, {
        headers: authHeader(),
      });
      if (res.data.success) {
        const { balanceData, priceData } = parseBalances(res.data.data);
        setBalances(balanceData);
        setPrices(priceData);
      }
    } catch (err) {
      console.error("[SwapPage] fetchBalances error:", err);
      showToast("Failed to load balances", "error");
    }
  };

  // ─── on mount ──────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // Seed from nav state immediately so UI isn't blank
      if (location.state?.allBalances) {
        const { balanceData, priceData } = parseBalances(location.state.allBalances);
        setBalances(balanceData);
        setPrices(priceData);
      }

      // Set fromToken if coming from BitcoinWallet
      if (location.state?.fromAsset) {
        const { name, balance, usdValue, price } = location.state.fromAsset;
        const match = TOKENS.find((t) => t.symbol === name);
        if (match) {
          setFromToken(match);
          setBalances((prev) => ({
            ...prev,
            [name]: {
              coinBalance: balance  || 0,
              usdBalance:  usdValue || 0,
              price:       price    || 0,
            },
          }));
        }
      }

      // Always fetch fresh data from backend
      await fetchBalances();
      setLoading(false);
    };

    init();
  }, []);

  // ─── derived values ────────────────────────────────────
  const getUsdBalance  = (symbol) => balances[symbol]?.usdBalance  || 0;
  const getCoinBalance = (symbol) => balances[symbol]?.coinBalance || 0;
  const getPrice       = (symbol) => prices[symbol] || 0;

  const toAmount = useMemo(() => {
    const n = parseFloat(fromAmount);
    if (!n || n <= 0) return "";
    const toPrice = getPrice(toToken.symbol);
    if (toPrice === 0) return "";
    return (n / toPrice).toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [fromAmount, toToken, prices]);

  const toUsdAmount = useMemo(() => {
    const n = parseFloat(fromAmount);
    return (!n || n <= 0) ? "" : n;
  }, [fromAmount]);

  const btnState = useMemo(() => {
    const n = parseFloat(fromAmount);
    if (!n || n <= 0)
      return { label: "Enter amount", type: "disabled" };
    if (n > getUsdBalance(fromToken.symbol))
      return { label: "Insufficient Balance", type: "error" };
    return { label: "Convert Now", type: "ready" };
  }, [fromAmount, fromToken, balances]);

  // ─── swap handler ──────────────────────────────────────
  const handleSwap = async () => {
    if (btnState.type !== "ready" || swapping) return;

    const usdValue   = parseFloat(fromAmount);
    const fromSymbol = fromToken.symbol;
    const toSymbol   = toToken.symbol;

    try {
      setSwapping(true);

      const res = await axios.post(
        `${BASE_URL}/api/swap/execute`,
        {
          fromAsset: getAssetKey(fromSymbol),
          toAsset:   getAssetKey(toSymbol),
          usdValue,
        },
        { headers: authHeader() }
      );

      if (res.data.success) {
        const fromPrice = getPrice(fromSymbol);
        const toPrice   = getPrice(toSymbol);
        const fromCoins = usdValue / fromPrice;
        const toCoins   = usdValue / toPrice;

        setBalances((prev) => ({
          ...prev,
          [fromSymbol]: {
            ...prev[fromSymbol],
            usdBalance:  (prev[fromSymbol]?.usdBalance  || 0) - usdValue,
            coinBalance: (prev[fromSymbol]?.coinBalance || 0) - fromCoins,
          },
          [toSymbol]: {
            ...prev[toSymbol],
            usdBalance:  (prev[toSymbol]?.usdBalance  || 0) + usdValue,
            coinBalance: (prev[toSymbol]?.coinBalance || 0) + toCoins,
          },
        }));

        setFromAmount("");
        showToast("Conversion Successful ✓", "success");
        await fetchBalances();
      } else {
        showToast(res.data.message || "Swap failed", "error");
      }
    } catch (err) {
      console.error("[SwapPage] Swap error:", err);
      showToast(err.response?.data?.message || "Swap failed. Please try again.", "error");
    } finally {
      setSwapping(false);
    }
  };

  // ─── UI ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="swap-page">
        <div className="loading-container">Loading wallet data...</div>
      </div>
    );
  }

  return (
    <div className="swap-page">

      {/* BACK */}
      <div className="swap-back-btn" onClick={() => navigate(-1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </div>

      {/* HEADER */}
      <div className="swap-header">
        <h1>Convert <span className="badge-0fee">Zero Fees</span></h1>
      </div>

      <div className="swap-card">

        {/* FROM */}
        <div className="token-section">
          <div className="section-top-row">
            <span className="section-label">From</span>
            <span className="balance-text">
              Available{" "}
              <span
                className="balance-val"
                onClick={() => setFromAmount(getUsdBalance(fromToken.symbol))}
              >
                {formatCurrency(getUsdBalance(fromToken.symbol))}
              </span>
            </span>
          </div>
          <div className="token-row">
            <input
              className="amount-input"
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
            <button
              className="max-btn"
              onClick={() => setFromAmount(getUsdBalance(fromToken.symbol))}
            >
              MAX
            </button>
            <button className="token-selector" onClick={() => setPicker("from")}>
              <TokenIcon token={fromToken} size={24} />
              <span className="token-symbol">{fromToken.name}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* FLIP */}
        <div className="flip-divider">
          <button
            className="flip-btn"
            onClick={() => {
              setFromToken(toToken);
              setToToken(fromToken);
              setFromAmount("");
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 10l5 5 5-5M7 14l5-5 5 5" />
            </svg>
          </button>
        </div>

        {/* TO */}
        <div className="token-section">
          <div className="section-top-row">
            <span className="section-label">To</span>
            <span className="balance-text">
              Balance:{" "}
              <span className="balance-val">
                {formatCurrency(getUsdBalance(toToken.symbol))}
              </span>
            </span>
          </div>
          <div className="token-row">
            <input
              className="amount-input"
              type="text"
              placeholder="0.00"
              value={toUsdAmount ? formatCurrency(toUsdAmount) : ""}
              readOnly
            />
            <button className="token-selector" onClick={() => setPicker("to")}>
              <TokenIcon token={toToken} size={24} />
              <span className="token-symbol">{toToken.name}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
          {toAmount && (
            <div className="equivalent-amount">
              ≈ {toAmount} {toToken.name}
            </div>
          )}
        </div>

        {/* RATE */}
        <div className="rate-info">
          <span className="rate-label">Price</span>
          <span className="rate-value">
            1 {fromToken.name} ≈ {formatCurrency(getPrice(fromToken.symbol))} USD<br />
            1 USD ≈{" "}
            {getPrice(toToken.symbol) > 0
              ? (1 / getPrice(toToken.symbol)).toLocaleString(undefined, { maximumFractionDigits: 8 })
              : "—"}{" "}
            {toToken.name}
          </span>
        </div>

        {/* BUTTON */}
        <button
          className={`swap-btn ${btnState.type}`}
          onClick={handleSwap}
          disabled={swapping || btnState.type === "disabled"}
        >
          {swapping ? "Processing..." : btnState.label}
        </button>

      </div>

      {/* MY ASSETS */}
      <div className="wallets-section">
        <h2 className="section-title">My Assets</h2>
        <div className="wallets-grid">
          {TOKENS.map((t) => (
            <div key={t.symbol} className="wallet-item">
              <TokenIcon token={t} size={24} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#707A8A" }}>
                  {formatCurrency(getUsdBalance(t.symbol))}
                </div>
                <div style={{ fontSize: 10, color: "#B0B8C4" }}>
                  {getCoinBalance(t.symbol).toFixed(6)} {t.symbol}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOKEN PICKER */}
      {picker && (
        <div className="picker-overlay" onClick={() => setPicker(null)}>
          <div className="picker-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Select Asset</span>
              <span
                onClick={() => setPicker(null)}
                style={{ cursor: "pointer", fontSize: 20 }}
              >
                ✕
              </span>
            </div>
            <input
              className="picker-search"
              placeholder="Search asset name or symbol"
              autoFocus
            />
            {TOKENS.map((t) => (
              <div
                key={t.symbol}
                className="picker-item"
                onClick={() => {
                  picker === "from" ? setFromToken(t) : setToToken(t);
                  setPicker(null);
                }}
              >
                <TokenIcon token={t} size={32} />
                <div style={{ marginLeft: 14 }}>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#707A8A" }}>{t.symbol}</div>
                </div>
                <div style={{ marginLeft: "auto", fontWeight: 600 }}>
                  {formatCurrency(getUsdBalance(t.symbol))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.msg && (
        <div className={`toast ${toast.type === "error" ? "toast-error" : ""}`}>
          {toast.msg}
        </div>
      )}

    </div>
  );
}