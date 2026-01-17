import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ReceivePage.css";
import btc from "../assets/btc.png";

const ReceivePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const asset = state || {
    name: "BTC",
    sub: "Bitcoin",
    icon: btc
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://backend-instacoinpay-1.onrender.com/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.success) {
          setUserData(data.data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getAddressForAsset = () => {
    if (!userData?.walletAddresses) return "";

    const wa = userData.walletAddresses;

    switch (asset.name) {
      case "BTC": return wa.btc;
      case "BNB": return wa.bnb;
      case "ETH": return wa.eth;
      case "TRX": return wa.trx;
      case "SOL": return wa.sol;
      case "XRP": return wa.xrp;
      case "DOGE": return wa.doge;
      case "LTC": return wa.ltc;
      case "USDT":
        return asset.sub === "TRON" ? wa.usdtTron : wa.usdtBnb;
      default:
        return "";
    }
  };

  const address = getAddressForAsset();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="st-wrapper">
      <div className="st-card receive-card">

        <div className="st-header receive-header">
          <span className="st-back-btn" onClick={() => navigate(-1)}>←</span>
          <h2>Receive</h2>
        </div>

        <div className="receive-coin">
          <img src={asset.icon} alt={asset.sub} />
          <h3>{asset.sub}</h3>
        </div>

        <div className="receive-info">
          Only send {asset.sub} ({asset.name}) to this address.
        </div>

        {address ? (
          <>
            <div className="qr-box">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`}
                alt="QR Code"
              />
            </div>

            <p className="wallet-address">{address}</p>

            <div className="receive-actions">
              <button onClick={() => navigator.clipboard.writeText(address)}>
                📋 Copy
              </button>
            </div>
          </>
        ) : (
          <p>No wallet address found</p>
        )}

        <button
          className="st-confirm-btn"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default ReceivePage;
