import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SpinWheelHome.css";

const SEGMENTS = [
  { label: "Better Luck", sublabel: "Next Time",  type: "lose" },
  { label: "$25 BTC",     sublabel: "Cash Prize",  type: "win"  },
  { label: "$100K BTC",   sublabel: "Jackpot!",    type: "mega" },
  { label: "Better Luck", sublabel: "Next Time",   type: "lose" },
  { label: "$100 BTC",    sublabel: "Cash Prize",  type: "win"  },
  { label: "$75K BTC",    sublabel: "Big Win!",    type: "mega" },
  { label: "Better Luck", sublabel: "Next Time",   type: "lose" },
  { label: "$50 BTC",     sublabel: "Cash Prize",  type: "win"  },
  { label: "Better Luck", sublabel: "Next Time",   type: "lose" },
  { label: "$50K BTC",    sublabel: "Grand Prize", type: "mega" },
];

const NUM   = SEGMENTS.length;
const ANGLE = 360 / NUM;

const COLORS = {
  lose: { bg: "#1a1a2e", text: "#ffff" },
  win:  { bg: "#0f3460", text: "#e2e8f0" },
  mega: { bg: "#16213e", text: "#e98f09" },
};
const ALT_COLORS = {
  lose: { bg: "#16162a", text: "#ffff" },
  win:  { bg: "#0d2d55", text: "#cbd5e1" },
  mega: { bg: "#131c38", text: "#e98f09" },
};

function polarToXY(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function WheelInner() {
  const cx = 250, cy = 250, r = 235, innerR = 70;
  return (
    <svg className="sw-wheel-svg" width="500" height="500" viewBox="0 0 500 500">
      <defs>
        <filter id="textGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {SEGMENTS.map((seg, i) => {
        const startDeg = i * ANGLE;
        const endDeg   = startDeg + ANGLE;
        const p1  = polarToXY(cx, cy, r,      startDeg);
        const p2  = polarToXY(cx, cy, r,      endDeg);
        const ip1 = polarToXY(cx, cy, innerR, startDeg);
        const ip2 = polarToXY(cx, cy, innerR, endDeg);
        const palette = i % 2 === 0 ? COLORS[seg.type] : ALT_COLORS[seg.type];

        const path = [
          `M ${ip1.x} ${ip1.y}`,
          `L ${p1.x} ${p1.y}`,
          `A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`,
          `L ${ip2.x} ${ip2.y}`,
          `A ${innerR} ${innerR} 0 0 0 ${ip1.x} ${ip1.y}`,
          "Z",
        ].join(" ");

        const midDeg = startDeg + ANGLE / 2;
        const tp     = polarToXY(cx, cy, (r + innerR) / 2, midDeg);

        return (
          <g key={i}>
            <path d={path} fill={palette.bg} stroke="#0a0a1a" strokeWidth="1.5" />
            <line
              x1={ip1.x} y1={ip1.y} x2={p1.x} y2={p1.y}
              stroke="rgba(255,215,80,0.15)" strokeWidth="1"
            />
            <g
              transform={`translate(${tp.x}, ${tp.y}) rotate(${midDeg})`}
              filter={seg.type === "mega" ? "url(#textGlow)" : undefined}
            >
              <text
                textAnchor="middle" dominantBaseline="middle"
                y={seg.type === "lose" ? 0 : -9}
                fontSize={seg.label.length > 5 ? 11 : 16}
                fontWeight="900"
                fontFamily="'Bebas Neue', Impact, sans-serif"
                fill={palette.text}
                letterSpacing="1"
              >
                {seg.label}
              </text>
              <text
                textAnchor="middle" dominantBaseline="middle"
                y={9}
                fontSize={seg.type === "lose" ? 8 : 9}
                fontWeight="600"
                fontFamily="'Bebas Neue', Impact, sans-serif"
                fill={seg.type === "mega" ? "#f7931a" : seg.type === "win" ? "#94a3b8" : palette.text}
                opacity={seg.type === "lose" ? 0.6 : 1}
                letterSpacing="1.5"
              >
                {seg.type === "lose" ? "NEXT TIME" : seg.sublabel}
              </text>
            </g>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={innerR + 4} fill="#0a0a1a" stroke="#c8a84b" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={innerR} fill="#0f0f1e" stroke="#8b6914" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="25" fill="#04f318" stroke="#ffffff" strokeWidth="3" filter="url(#textGlow)" />
      <circle cx={cx} cy={cy} r="15" fill="#ffffff" opacity="0.3" />
    </svg>
  );
}

function OuterRing() {
  const cx = 250, cy = 250, r = 235;
  return (
    <svg className="sw-wheel-svg" width="500" height="500" viewBox="0 0 500 500">
      <defs>
        <radialGradient id="goldRing" cx="50%" cy="50%" r="50%">
          <stop offset="85%"  stopColor="#c8a84b" />
          <stop offset="100%" stopColor="#8b6914" />
        </radialGradient>
        <filter id="pointerGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pointerGlowStrong">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + 14} fill="url(#goldRing)" />
      {Array.from({ length: 28 }).map((_, i) => {
        const p = polarToXY(cx, cy, r + 14, (360 / 28) * i);
        return (
          <circle key={i} cx={p.x} cy={p.y} r={4}
            fill={i % 2 === 0 ? "#fff6c0" : "#a07820"} opacity="0.9" />
        );
      })}
      <polygon
        points={`${cx},${cy - r - 35} ${cx - 25},${cy - r + 20} ${cx + 25},${cy - r + 20}`}
        fill="#04f318"
        stroke="#8b4a00"
        strokeWidth="3"
        filter="url(#pointerGlowStrong)"
      />
      <circle cx={cx} cy={cy - r - 25} r={6} fill="#ffd700" stroke="#8b4a00" strokeWidth="2" />
      <rect
        x={cx - 15}
        y={cy - r + 5}
        width="30"
        height="20"
        fill="#c8a84b"
        stroke="#8b6914"
        strokeWidth="2"
        rx="5"
      />
      <circle cx={cx} cy={cy - r + 10} r={4} fill="#ffd700" />
      <circle cx={cx - 8} cy={cy - r + 5} r={2.5} fill="#ffd700" opacity="0.7" />
      <circle cx={cx + 8} cy={cy - r + 5} r={2.5} fill="#ffd700" opacity="0.7" />
    </svg>
  );
}

export default function SpinWheel() {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning]                   = useState(false);
  const [rotation,   setRotation]                     = useState(0);
  const [result,     setResult]                       = useState(null);
  const [isClaiming, setIsClaiming]                   = useState(false);
  const [claimMessage, setClaimMessage]               = useState("");
  const [showShareModal, setShowShareModal]           = useState(false);
  const [pendingWin, setPendingWin]                   = useState(null);
  const [shareCount, setShareCount]                   = useState(0);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  const rotRef = useRef(0);

  // ✅ Safe localStorage reads — never crash if key is missing
  const getUserData = () => {
    try { return JSON.parse(localStorage.getItem("user")) || null; }
    catch { return null; }
  };
  const userData     = getUserData();
  const userId       = userData?.id || null;
  const referralCode = userData?.referralCode || localStorage.getItem("userReferralCode") || null;

  // ✅ Only restore pending win if mid-share progress exists (not stale)
  useEffect(() => {
    try {
      const storageKey = userId ? `pendingWin_${userId}` : `pendingWin_guest`;
      const savedRaw   = localStorage.getItem(storageKey);
      if (savedRaw) {
        const saved    = JSON.parse(savedRaw);
        const age      = Date.now() - (saved.timestamp || 0);
        const ONE_HOUR = 60 * 60 * 1000;
        if (age < ONE_HOUR && saved.pendingWin && saved.shareCount > 0) {
          setPendingWin(saved.pendingWin);
          setShareCount(saved.shareCount);
          setShowShareModal(true);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch { /* ignore */ }
  }, [userId]);

  const savePendingWin = (winSegment, count) => {
    try {
      const key = userId ? `pendingWin_${userId}` : `pendingWin_guest`;
      localStorage.setItem(key, JSON.stringify({
        pendingWin: winSegment,
        shareCount: count,
        timestamp:  Date.now(),
      }));
    } catch { /* ignore */ }
  };

  const clearPendingWin = () => {
    try {
      const key = userId ? `pendingWin_${userId}` : `pendingWin_guest`;
      localStorage.removeItem(key);
    } catch { /* ignore */ }
  };

  // ✅ Everyone can spin - no restrictions
  const handleSpin = () => {
    if (isSpinning) return;

    setResult(null);
    setClaimMessage("");

    const extra  = 1440 + Math.floor(Math.random() * 360);
    const newRot = rotRef.current + extra;
    rotRef.current = newRot;
    setRotation(newRot);
    setIsSpinning(true);

    setTimeout(() => {
      const actualDeg = rotRef.current % 360;
      let winningIndex   = Math.floor(((360 - actualDeg) % 360) / ANGLE) % NUM;
      let winningSegment = SEGMENTS[winningIndex];

      // Always land on a winning segment
      if (winningSegment.type === "lose") {
        let nextIndex = winningIndex, steps = 0;
        while (steps < NUM) {
          nextIndex = (nextIndex + 1) % NUM;
          if (SEGMENTS[nextIndex].type !== "lose") break;
          steps++;
        }
        const adjustment = ((nextIndex - winningIndex) * ANGLE + 360) % 360;
        rotRef.current  += adjustment;
        setRotation(rotRef.current);
        const adjustedDeg = rotRef.current % 360;
        winningIndex      = Math.floor(((360 - adjustedDeg) % 360) / ANGLE) % NUM;
        winningSegment    = SEGMENTS[winningIndex];
      }

      setIsSpinning(false);
      setResult(winningSegment);

      if (winningSegment.type !== "lose") {
        setPendingWin(winningSegment);
        setShareCount(0);
        savePendingWin(winningSegment, 0);
        setShowShareModal(true);
      } else {
        setTimeout(() => {
          alert("Better luck next time! Try again.");
          navigate("/getstarted");
        }, 2000);
      }
    }, 5000);
  };

  const handleShare = (shareMultiple = false) => {
    if (!pendingWin) return;

    const shareLink = "https://instacoinxpay.com/spinwheelhome";
    const shareMessage =
`🎉 I just won ${pendingWin.label} on InstaCoinXPay Fortune Wheel!

🔥 Try your luck and win BTC rewards instantly.

👇 Spin Now
${shareLink}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank");
    if (shareMultiple) {
      setTimeout(() => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank");
      }, 500);
    }

    setIsClaiming(true);
    try {
      const newCount = shareCount + (shareMultiple ? 2 : 1);
      setShareCount(newCount);
      savePendingWin(pendingWin, newCount);

      if (newCount >= 2) {
        // Store prize information before clearing
        const prizeToStore = { ...pendingWin };
        
        setClaimMessage(`✅ ${pendingWin.label} credited to your account!`);
        setShowShareModal(false);
        
        // Store the prize in localStorage for getstarted page
        try {
          localStorage.setItem("pendingPrize", JSON.stringify({
            label: prizeToStore.label,
            type: prizeToStore.type,
            sublabel: prizeToStore.sublabel,
            wonAt: Date.now(),
          }));
        } catch { /* ignore */ }
        
        clearPendingWin();
        setPendingWin(null);
        setShareCount(0);
        setShowCompletionAlert(true);
      } else {
        const remaining = 2 - newCount;
        setShowShareModal(false);
        setTimeout(() => {
          alert(`✅ Share ${newCount}/2 completed! ${remaining} more share needed.`);
          setShowShareModal(true);
        }, 300);
      }
    } catch (error) {
      console.error("Share error:", error);
      setShowShareModal(false);
      setTimeout(() => {
        alert("Error recording share. Please try again.");
        setShowShareModal(true);
      }, 300);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleCompletionConfirm = () => {
    setShowCompletionAlert(false);
    // Always redirect to getstarted after completion
    navigate("/getstarted");
  };

  const isWin  = result && result.type !== "lose";
  const isMega = result && result.type === "mega";

  return (
    <div className="sw-page">
      <button className="sw-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        ←
      </button>

      <div className="sw-bg-glow" />

      <div className="sw-title-block">
        <div className="sw-eyebrow">★ &nbsp; Try Your Luck &nbsp; ★</div>
        <h1 className="sw-title">Fortune Wheel</h1>
      </div>

      <div className={`sw-wheel-frame ${isSpinning ? "spinning" : ""}`}>
        <div className="sw-layer"><OuterRing /></div>
        <div className="sw-layer sw-disc" style={{ transform: `rotate(${rotation}deg)` }}>
          <WheelInner />
        </div>
        {/* ✅ Everyone can spin - no restrictions */}
        <button
          className={`sw-spin-btn ${isSpinning ? "active" : ""}`}
          onClick={handleSpin}
          disabled={isSpinning}
        >
          {isSpinning ? "●●●" : "SPIN"}
        </button>
      </div>

      {result && !isSpinning && !showShareModal && (
        <div className={`sw-result sw-result--${result.type}`}>
          <div className="sw-result-badge">
            {isMega ? "🏆 JACKPOT!" : isWin ? "✓ YOU WON" : "✕ TRY AGAIN"}
          </div>
          <div className="sw-result-label">{result.label}</div>
          {isWin && <div className="sw-result-sub">{result.sublabel}</div>}
          {claimMessage && (
            <div
              className="sw-claim-message"
              style={{
                backgroundColor: claimMessage.includes("✅") ? "#1a3a1a" : claimMessage.includes("❌") ? "#3a1a1a" : "#3a2a0a",
                color:           claimMessage.includes("✅") ? "#9ae6b4" : claimMessage.includes("❌") ? "#feb2b2" : "#fbd38d",
                border:          claimMessage.includes("✅") ? "1px solid #22c55e" : claimMessage.includes("❌") ? "1px solid #ef4444" : "1px solid #f59e0b",
              }}
            >
              {claimMessage}
            </div>
          )}
          <button className="sw-result-btn" onClick={() => { setResult(null); setClaimMessage(""); }}>
            {isWin ? "Play Again" : "Spin Again"}
          </button>
        </div>
      )}

      {showShareModal && pendingWin && (
        <div className="sw-share-modal-overlay">
          <div className="sw-share-modal">
            <div className="sw-share-header">
              <span className="sw-share-icon">🎉</span>
              <h2>Share Your Win!</h2>
            </div>
            <div className="sw-share-content">
              <p className="sw-share-message">
                You won <span className="sw-share-amount">{pendingWin.label}</span>!
              </p>
              <p className="sw-share-instruction">
                Share on WhatsApp with 2 friends to claim your prize:
              </p>
              <div className="sw-share-code">
                <strong>Your Referral Code:</strong>
                <div className="sw-code-box">
                  {referralCode || (userId ? "Loading..." : "Sign up to get your code!")}
                </div>
              </div>
              {shareCount > 0 && shareCount < 2 && (
                <div className="sw-share-progress">
                  <p>Share Progress: {shareCount}/2</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(shareCount / 2) * 100}%` }} />
                  </div>
                </div>
              )}
              <div className="sw-share-buttons">
                <button
                  className="sw-share-btn whatsapp"
                  onClick={() => handleShare(false)}
                  disabled={isClaiming || shareCount >= 2}
                >
                  <span>📱</span> {shareCount >= 2 ? "Claimed!" : `Share ${shareCount}/2`}
                </button>
                <button
                  className="sw-share-btn share-two"
                  onClick={() => handleShare(true)}
                  disabled={isClaiming || shareCount >= 2}
                >
                  <span>👥</span> Share with 2 Members
                </button>
              </div>
              <p className="sw-share-note">
                <small>
                  {shareCount >= 2 ? "Prize claimed successfully!" : `Share with ${2 - shareCount} more people to unlock your prize!`}
                </small>
              </p>
              {isClaiming && <div className="sw-claiming">Processing your prize...</div>}
            </div>
            <button className="sw-share-close" onClick={() => setShowShareModal(false)} disabled={isClaiming}>✕</button>
          </div>
        </div>
      )}

      {showCompletionAlert && (
        <div className="sw-completion-alert-overlay">
          <div className="sw-completion-alert">
            <div className="sw-completion-header">
              <span className="sw-completion-icon">🎊</span>
              <h2>Congratulations!</h2>
            </div>
            <div className="sw-completion-content">
              <p className="sw-completion-message">You've successfully shared with 2 people!</p>
              <p className="sw-completion-prize">
                {userId
                  ? `Your prize has been credited to your account.`
                  : `Your prize is reserved! Sign up now to claim it — takes 30 seconds!`}
              </p>
              <p className="sw-completion-next">
                Click OK to continue and claim your reward.
              </p>
              <button className="sw-completion-btn" onClick={handleCompletionConfirm}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}