import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TradingPanel.css';
import { clearUserData } from '../utils/authUtils';

const symbols = [
  'BTC', 'BNB', 'USDT_TRC20', 'TRX', 'USDT_BEP20',
  'ETH', 'SOL', 'XRP', 'DOGE', 'LTC'
];

const displayNames = {
  'BTC': 'Bitcoin', 'BNB': 'Binance Coin', 'USDT_TRC20': 'USDT (TRC20)',
  'TRX': 'TRON', 'USDT_BEP20': 'USDT (BEP20)', 'ETH': 'Ethereum',
  'SOL': 'Solana', 'XRP': 'Ripple', 'DOGE': 'Dogecoin', 'LTC': 'Litecoin'
};

const assetTypes = {
  'BTC': 'crypto', 'BNB': 'crypto', 'USDT_TRC20': 'stablecoin',
  'TRX': 'crypto', 'USDT_BEP20': 'stablecoin', 'ETH': 'crypto',
  'SOL': 'crypto', 'XRP': 'crypto', 'DOGE': 'crypto', 'LTC': 'crypto'
};

const BASE_PRICES = {
  'BTC': 67420, 'BNB': 580, 'USDT_TRC20': 1.00, 'TRX': 0.11,
  'USDT_BEP20': 1.00, 'ETH': 3450, 'SOL': 145, 'XRP': 0.62,
  'DOGE': 0.15, 'LTC': 85.5
};

const COINGECKO_IDS = {
  'BTC': 'bitcoin', 'ETH': 'ethereum', 'BNB': 'binancecoin',
  'SOL': 'solana', 'XRP': 'ripple', 'DOGE': 'dogecoin',
  'LTC': 'litecoin', 'TRX': 'tron'
};

const ASSET_COLORS = {
  'USDT_TRC20': '#26a17b', 'USDT_BEP20': '#26a17b', 'BTC': '#f7931a',
  'ETH': '#627eea', 'BNB': '#f3ba2f', 'SOL': '#00ffbd',
  'XRP': '#23292f', 'DOGE': '#c3a634', 'LTC': '#bfbbbb', 'TRX': '#ff0000'
};

const loadDashboardBalances = () => {
  try {
    const rawPortfolio = localStorage.getItem('dashboard_trading_portfolio');
    const rawBalance = localStorage.getItem('dashboard_trading_usd_balance');
    const lastSync = localStorage.getItem('dashboard_trading_last_sync');

    const portfolio = rawPortfolio ? JSON.parse(rawPortfolio) : null;
    const usdBalance = rawBalance ? parseFloat(rawBalance) : null;

    if (portfolio && usdBalance !== null && !isNaN(usdBalance)) {
      console.log('✅ [TradingPanel] Loaded dashboard balances:', { portfolio, usdBalance, lastSync });
      return { portfolio, usdBalance };
    }
  } catch (err) {
    console.error('❌ [TradingPanel] Error loading dashboard balances:', err);
  }
  return null;
};

const TradingPanel = () => {
  const navigate = useNavigate();
  const [tradeType, setTradeType] = useState('buy');
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [inputMode, setInputMode] = useState('usd');
  const [usdAmount, setUsdAmount] = useState('');
  const [coinAmount, setCoinAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [priceChange, setPriceChange] = useState({ change: 0, isPositive: true });
  const [allPrices, setAllPrices] = useState({ ...BASE_PRICES });
  const [apiStatus, setApiStatus] = useState('loading');
  const [syncTime, setSyncTime] = useState('');

  // ✅ DEBUG: Log component mount and localStorage state
  useEffect(() => {
    console.log('🔍 [TradingPanel] ========== COMPONENT MOUNTED ==========');
    const token = localStorage.getItem("token");
    const history = localStorage.getItem("crypto_history");
    console.log('🔍 [TradingPanel] Token exists:', !!token);
    console.log('🔍 [TradingPanel] crypto_history exists:', !!history);
    if (history) {
      try {
        const parsedHistory = JSON.parse(history);
        console.log('🔍 [TradingPanel] History items count:', parsedHistory.length);
        console.log('🔍 [TradingPanel] History sample:', parsedHistory.slice(0, 2));
      } catch(e) {
        console.error('🔍 [TradingPanel] Error parsing history:', e);
      }
    } else {
      console.log('🔍 [TradingPanel] No crypto_history found in localStorage');
    }
    
    // Listen for storage changes (for debugging)
    const handleStorageChange = (e) => {
      if (e.key === 'crypto_history') {
        console.log('🔍 [TradingPanel] Storage event: crypto_history changed');
        console.log('🔍 [TradingPanel] New value:', e.newValue ? 'exists' : 'removed');
        if (e.newValue === null) {
          console.log('✅ [TradingPanel] crypto_history was cleared!');
          setHistory([]);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      console.log('🔍 [TradingPanel] Component unmounting');
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // ✅ AUTHENTICATION CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log('🔍 [TradingPanel] Auth check - token exists:', !!token);
    if (!token) {
      console.log('⚠️ [TradingPanel] No token found, clearing data and redirecting to login');
      clearUserData();
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Initialize balance and portfolio from Dashboard localStorage
  const [balance, setBalance] = useState(() => {
    const dashData = loadDashboardBalances();
    if (dashData) return dashData.usdBalance;
    const saved = localStorage.getItem('crypto_balance');
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
    return 0;
  });

  const [portfolio, setPortfolio] = useState(() => {
    const dashData = loadDashboardBalances();
    if (dashData) return dashData.portfolio;
    const saved = localStorage.getItem('crypto_portfolio');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  const currentPrice = allPrices[selectedSymbol] ?? BASE_PRICES[selectedSymbol] ?? 0;

  const derivedCoinAmount = inputMode === 'usd'
    ? (currentPrice > 0 ? parseFloat(usdAmount || 0) / currentPrice : 0)
    : parseFloat(coinAmount || 0);

  const derivedUsdAmount = inputMode === 'coin'
    ? parseFloat(coinAmount || 0) * currentPrice
    : parseFloat(usdAmount || 0);

  const hasAmount = derivedUsdAmount > 0;

  // ✅ Re-sync from dashboard whenever panel mounts or tab becomes visible
  useEffect(() => {
    const syncFromDashboard = () => {
      const dashData = loadDashboardBalances();
      if (dashData) {
        setBalance(dashData.usdBalance);
        setPortfolio(dashData.portfolio);
        const lastSync = localStorage.getItem('dashboard_trading_last_sync');
        if (lastSync) {
          setSyncTime(new Date(lastSync).toLocaleTimeString());
        }
        console.log('🔄 [TradingPanel] Re-synced from dashboard:', dashData);
      }
    };

    syncFromDashboard();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const lastTradeSync = localStorage.getItem('dashboard_trading_last_sync');
        if (!lastTradeSync) return;

        const secondsAgo = (Date.now() - new Date(lastTradeSync).getTime()) / 1000;
        if (secondsAgo < 120) {
          console.log('⛔ [TradingPanel] Skipping resync (recent trade)');
          return;
        }

        syncFromDashboard();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Fetch real prices from CoinGecko
  const fetchLivePrices = async () => {
    try {
      const ids = Object.values(COINGECKO_IDS).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      );

      if (response.ok) {
        const data = await response.json();
        const normalized = {};
        let hasValidPrices = false;

        symbols.forEach(symbol => {
          if (symbol === 'USDT_TRC20' || symbol === 'USDT_BEP20') {
            normalized[symbol] = 1.00;
          } else if (COINGECKO_IDS[symbol] && data[COINGECKO_IDS[symbol]]) {
            normalized[symbol] = data[COINGECKO_IDS[symbol]].usd;
            hasValidPrices = true;
          } else {
            normalized[symbol] = allPrices[symbol] || BASE_PRICES[symbol];
          }
        });

        if (hasValidPrices) {
          setAllPrices(normalized);
          setApiStatus('online');

          if (selectedSymbol !== 'USDT_TRC20' && selectedSymbol !== 'USDT_BEP20' && data[COINGECKO_IDS[selectedSymbol]]) {
            const change = data[COINGECKO_IDS[selectedSymbol]].usd_24h_change || 0;
            setPriceChange({ change, isPositive: change >= 0 });
          }
        }
      } else {
        throw new Error('API response not OK');
      }
    } catch (error) {
      console.warn('⚠️ [TradingPanel] CoinGecko API error:', error);
      simulatePriceChange();
    }
  };

  const simulatePriceChange = () => {
    const updated = { ...allPrices };
    symbols.forEach(symbol => {
      if (symbol !== 'USDT_TRC20' && symbol !== 'USDT_BEP20') {
        const volatility = (Math.random() - 0.5) * (updated[symbol] * 0.002);
        updated[symbol] = Math.max(updated[symbol] + volatility, 0.01);
      }
    });
    setAllPrices(updated);

    if (selectedSymbol !== 'USDT_TRC20' && selectedSymbol !== 'USDT_BEP20') {
      const change = ((updated[selectedSymbol] - BASE_PRICES[selectedSymbol]) / BASE_PRICES[selectedSymbol]) * 100;
      setPriceChange({ change, isPositive: change >= 0 });
    }
  };

  // Load trade history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('crypto_history');
      console.log('🔍 [TradingPanel] Loading saved history, exists:', !!savedHistory);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        console.log('✅ [TradingPanel] Loaded', parsedHistory.length, 'trades from localStorage');
      }
    } catch (error) {
      console.error('❌ [TradingPanel] Error loading history:', error);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 10000);
    const simulationInterval = setInterval(() => {
      if (apiStatus !== 'online') simulatePriceChange();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(simulationInterval);
    };
  }, [selectedSymbol, apiStatus]);

  const resetAmounts = () => { setUsdAmount(''); setCoinAmount(''); };

  const getCurrentPrice = (symbol) => allPrices[symbol] ?? BASE_PRICES[symbol] ?? 0;
  const getDisplayName = (symbol) => displayNames[symbol] || symbol;
  const formatSymbolLabel = (s) =>
    s === 'USDT_TRC20' ? 'USDT(TRC20)' : s === 'USDT_BEP20' ? 'USDT(BEP20)' : s;

  const formatNumber = (symbol, value) => {
    const n = value ?? 0;
    if (symbol === 'USDT_TRC20' || symbol === 'USDT_BEP20') return n.toFixed(2);
    if (symbol === 'XRP' || symbol === 'TRX') return n.toFixed(6);
    return n.toFixed(4);
  };

  const getAssetColor = (symbol) => ASSET_COLORS[symbol] || '#3b82f6';

  const toggleInputMode = () => {
    if (inputMode === 'usd') {
      const newCoinAmount = derivedCoinAmount > 0 ? derivedCoinAmount : 0;
      setCoinAmount(newCoinAmount.toFixed(8));
      setInputMode('coin');
    } else {
      const newUsdAmount = derivedUsdAmount > 0 ? derivedUsdAmount : 0;
      setUsdAmount(newUsdAmount.toFixed(2));
      setInputMode('usd');
    }
  };

  const setMax = () => {
    if (tradeType === 'buy') {
      if (inputMode === 'usd') {
        setUsdAmount(Math.max(0, balance).toFixed(2));
      } else {
        const maxCoins = currentPrice > 0 ? balance / currentPrice : 0;
        setCoinAmount(maxCoins.toFixed(8));
      }
    } else {
      const holding = portfolio[selectedSymbol] || 0;
      if (inputMode === 'usd') {
        setUsdAmount((holding * currentPrice).toFixed(2));
      } else {
        setCoinAmount(holding.toFixed(8));
      }
    }
  };

  const setPercentage = (percent) => {
    if (tradeType === 'buy') {
      const dollarAmount = balance * percent;
      if (dollarAmount <= 0) {
        alert(`Your balance is $${balance.toFixed(2)}. Please add funds via the Dashboard.`);
        return;
      }
      if (inputMode === 'usd') {
        setUsdAmount(dollarAmount.toFixed(2));
        setCoinAmount('');
      } else {
        const coinVal = currentPrice > 0 ? dollarAmount / currentPrice : 0;
        setCoinAmount(coinVal.toFixed(8));
        setUsdAmount('');
      }
    } else {
      const holding = portfolio[selectedSymbol] || 0;
      const coinAmountToSell = holding * percent;
      if (coinAmountToSell <= 0) {
        alert(`You don't have any ${formatSymbolLabel(selectedSymbol)} to sell.`);
        return;
      }
      if (inputMode === 'usd') {
        setUsdAmount((coinAmountToSell * currentPrice).toFixed(2));
        setCoinAmount('');
      } else {
        setCoinAmount(coinAmountToSell.toFixed(8));
        setUsdAmount('');
      }
    }
  };

  const handleExecuteTrade = async (e) => {
    e.preventDefault();
    if (!hasAmount || derivedCoinAmount <= 0) return;
    setLoading(true);

    const totalCost = derivedUsdAmount;
    let newBalance = balance;
    let newPortfolio = { ...portfolio };

    if (tradeType === 'buy') {
      if (totalCost > balance) {
        alert(`Insufficient balance! You have $${balance.toFixed(2)} but need $${totalCost.toFixed(2)}`);
        setLoading(false);
        return;
      }
      
      newBalance = balance - totalCost;
      const currentHolding = portfolio[selectedSymbol] || 0;
      newPortfolio[selectedSymbol] = currentHolding + derivedCoinAmount;
    } else {
      const currentHolding = portfolio[selectedSymbol] || 0;
      if (derivedCoinAmount > currentHolding) {
        alert(`Insufficient ${formatSymbolLabel(selectedSymbol)} balance! You have ${currentHolding.toFixed(8)} ${formatSymbolLabel(selectedSymbol)}`);
        setLoading(false);
        return;
      }
      
      newBalance = balance + totalCost;
      newPortfolio[selectedSymbol] = currentHolding - derivedCoinAmount;
      
      if (newPortfolio[selectedSymbol] <= 0.00000001) {
        delete newPortfolio[selectedSymbol];
      }
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please login to continue");
        setLoading(false);
        return;
      }

      setBalance(newBalance);
      setPortfolio(newPortfolio);

      const response = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/trades",
        {
          type: tradeType,
          symbol: selectedSymbol,
          amount: derivedCoinAmount,
          usdAmount: totalCost,
          price: currentPrice
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("✅ [TradingPanel] Trade saved to backend:", response.data);

      if (response.data.newBalance !== undefined) {
        setBalance(response.data.newBalance);
      }
      if (response.data.portfolio) {
        setPortfolio(response.data.portfolio);
      }

      const finalPortfolio = response.data.portfolio || newPortfolio;
      const finalBalance = response.data.newBalance !== undefined ? response.data.newBalance : newBalance;
      
      localStorage.setItem('dashboard_trading_portfolio', JSON.stringify(finalPortfolio));
      localStorage.setItem('dashboard_trading_usd_balance', finalBalance.toString());
      localStorage.setItem('dashboard_trading_last_sync', new Date().toISOString());

      // Create trade record with fee = 0 (no fees applied)
      const newTrade = {
        id: response.data.trade?._id || Date.now(),
        type: tradeType === 'buy' ? 'Buy' : 'Sell',
        symbol: selectedSymbol,
        displayName: getDisplayName(selectedSymbol),
        coinAmount: derivedCoinAmount.toFixed(8),
        total: totalCost.toFixed(2),
        price: currentPrice,
        fee: 0, // No trading fees
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString()
      };

      const existingHistory = [...history];
      const updatedHistory = [newTrade, ...existingHistory].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem('crypto_history', JSON.stringify(updatedHistory));
      console.log('✅ [TradingPanel] Updated crypto_history, items:', updatedHistory.length);

      navigate('/trading-receipt', { 
        state: {
          ...newTrade,
          total: totalCost,
          coinAmount: derivedCoinAmount,
          price: currentPrice,
          fee: 0 // Pass fee as 0 to receipt page
        }
      });

    } catch (err) {
      console.error("❌ [TradingPanel] Trade failed:", err.response?.data || err.message);
      setBalance(balance);
      setPortfolio(portfolio);
      alert(err.response?.data?.message || "Trade failed. Please try again.");
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all trade history? (This only clears local display, backend history remains)')) {
      setHistory([]);
      localStorage.removeItem('crypto_history');
      console.log('✅ [TradingPanel] Manually cleared crypto_history');
    }
  };

  return (
    <div className="tp-container">
      <div className="tp-panel">
        <button
          onClick={() => window.history.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#475569',
            fontSize: '14px',
            fontWeight: '600',
            padding: '0 0 14px 0',
          }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>←</span>
        </button>

        <div className="tp-symbol-nav">
          {symbols.map(s => (
            <button
              key={s}
              className={`tp-nav-btn ${selectedSymbol === s ? 'tp-active' : ''}`}
              onClick={() => { setSelectedSymbol(s); resetAmounts(); }}
              title={getDisplayName(s)}
              style={{
                borderColor: selectedSymbol === s ? getAssetColor(s) : '#e2e8f0',
                background: selectedSymbol === s ? getAssetColor(s) : 'white',
                color: selectedSymbol === s ? 'white' : '#64748b'
              }}
            >
              {formatSymbolLabel(s)}
            </button>
          ))}
        </div>

        <div className="tp-price-hero">
          <div>
            <div className="tp-label">{getDisplayName(selectedSymbol)} / USDT</div>
            <div className="tp-value">
              ${currentPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: selectedSymbol === 'XRP' || selectedSymbol === 'TRX' ? 6 : 2
              })}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              {assetTypes[selectedSymbol] === 'stablecoin' ? 'Stablecoin (1:1 USD Peg)' : 'Cryptocurrency'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: priceChange.isPositive ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '14px' }}>
              {priceChange.isPositive ? '↑' : '↓'} {Math.abs(priceChange.change ?? 0).toFixed(2)}%
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>24H CHANGE</div>
          </div>
        </div>

        <div className="tp-tab-container">
          <button
            className={`tp-tab-btn ${tradeType === 'buy' ? 'tp-active tp-buy' : ''}`}
            onClick={() => { setTradeType('buy'); resetAmounts(); }}
          >
            Buy
          </button>
          <button
            className={`tp-tab-btn ${tradeType === 'sell' ? 'tp-active tp-sell' : ''}`}
            onClick={() => { setTradeType('sell'); resetAmounts(); }}
          >
            Sell
          </button>
        </div>

        <form onSubmit={handleExecuteTrade}>
          <div className="tp-input-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ margin: 0 }}>
                {inputMode === 'usd' ? 'Amount (USD $)' : `Amount (${formatSymbolLabel(selectedSymbol)})`}
              </label>
              <button type="button" onClick={toggleInputMode} style={{
                background: '#1e293b', border: '1px solid #475569', borderRadius: '6px',
                color: '#94a3b8', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                padding: '3px 10px'
              }}>
                {inputMode === 'usd' ? `⇄ ${formatSymbolLabel(selectedSymbol)}` : '⇄ USD'}
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: '#94a3b8', fontSize: '13px', fontWeight: '700', pointerEvents: 'none'
              }}>
                {inputMode === 'usd' ? '$' : formatSymbolLabel(selectedSymbol)}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                className="tp-input-field"
                style={{ paddingLeft: inputMode === 'usd' ? '22px' : `${Math.max(60, formatSymbolLabel(selectedSymbol).length * 9 + 14)}px` }}
                placeholder={inputMode === 'usd' ? '0.00' : '0.00000000'}
                value={inputMode === 'usd' ? usdAmount : coinAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (inputMode === 'usd') { setUsdAmount(value); setCoinAmount(''); }
                  else { setCoinAmount(value); setUsdAmount(''); }
                }}
                required
              />
              <button type="button" className="tp-max-badge" onClick={setMax}>MAX</button>
            </div>

            {hasAmount && (
              <div style={{ marginTop: '5px', fontSize: '11px', color: '#64748b' }}>
                {inputMode === 'usd'
                  ? `≈ ${derivedCoinAmount.toFixed(8)} ${formatSymbolLabel(selectedSymbol)}`
                  : `≈ $${derivedUsdAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {[0.25, 0.5, 0.75, 1].map(percent => (
              <button
                key={percent}
                type="button"
                onClick={() => setPercentage(percent)}
                style={{
                  flex: 1, padding: '8px', background: '#334155', border: 'none',
                  borderRadius: '6px', color: '#fff', cursor: 'pointer',
                  fontSize: '12px', fontWeight: '600', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#475569'}
                onMouseLeave={(e) => e.target.style.background = '#334155'}
              >
                {percent * 100}%
              </button>
            ))}
          </div>

          <div style={{
            marginBottom: '16px', padding: '12px',
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            borderRadius: '8px', border: '1px solid #bbf7d0'
          }}>
            <div style={{ fontSize: '11px', color: '#166534', fontWeight: '600', marginBottom: '4px' }}>
              📊 Dashboard Portfolio Balance
            </div>
            <div style={{ fontSize: '16px', color: '#15803d', fontWeight: '800' }}>
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {portfolio[selectedSymbol] > 0 && (
              <div style={{ fontSize: '11px', color: '#166534', marginTop: '4px' }}>
                {formatSymbolLabel(selectedSymbol)} holding: {formatNumber(selectedSymbol, portfolio[selectedSymbol])} {formatSymbolLabel(selectedSymbol)}
              </div>
            )}
          </div>

          <div className="tp-summary-card">
            <div className="tp-summary-row">
              <span className="tp-label">{tradeType === 'buy' ? 'Available USD' : `Available ${formatSymbolLabel(selectedSymbol)}`}</span>
              <span className="tp-val">
                {tradeType === 'buy'
                  ? `$${(balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `${formatNumber(selectedSymbol, portfolio[selectedSymbol] || 0)} ${formatSymbolLabel(selectedSymbol)}`}
              </span>
            </div>
            <div className="tp-summary-row">
              <span className="tp-label">Coin Amount</span>
              <span className="tp-val">
                {derivedCoinAmount > 0 ? `${derivedCoinAmount.toFixed(8)} ${formatSymbolLabel(selectedSymbol)}` : '—'}
              </span>
            </div>
            <div className="tp-summary-row">
              <span className="tp-label">Est. Total (USDT)</span>
              <span className="tp-total-val">
                ${derivedUsdAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {/* Remove or hide fee display */}
            <div className="tp-summary-row" style={{ display: 'none' }}>
              <span className="tp-label">Fee (0.1%)</span>
              <span className="tp-val">$0.00 (FREE)</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !hasAmount}
            className={`tp-action-btn ${tradeType === 'buy' ? 'tp-buy' : 'tp-sell'}`}
          >
            {loading ? 'Confirming...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${getDisplayName(selectedSymbol)}`}
          </button>
        </form>

        <div className="tp-history-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="tp-history-header">Recent Activity</span>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                style={{
                  background: '#ef4444', color: 'white', border: 'none',
                  borderRadius: '6px', padding: '4px 8px', fontSize: '10px',
                  cursor: 'pointer', fontWeight: '600'
                }}
              >
                Clear All
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <div style={{ color: '#cbd5e1', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>No recent trades</div>
          ) : (
            history.map(item => (
              <div key={item.id} className={`tp-history-item ${item.type.toLowerCase()}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>
                    <span className="tp-type">{item.type}</span>
                    <span style={{ marginLeft: '8px', fontWeight: '500' }}>{item.coinAmount} {item.displayName || item.symbol}</span>
                  </span>
                  <span className="tp-time">{item.time}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Total: ${item.total}</div>
                {/* Optionally show fee as 0 */}
                {item.fee !== undefined && (
                  <div style={{ fontSize: '10px', color: '#10b981', marginTop: '2px' }}>Fee: $0.00 (FREE)</div>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Market Prices</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '11px' }}>
            {symbols.map(symbol => (
              <div key={symbol} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ color: getAssetColor(symbol) }}>{formatSymbolLabel(symbol)}:</span>
                <span style={{ color: '#000000', fontWeight: '500' }}>
                  ${getCurrentPrice(symbol).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: symbol === 'XRP' || symbol === 'TRX' ? 6 : 2
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;