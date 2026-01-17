import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DebitCards.css";
import logo from "../assets/logo.png";
import merchantCard from "../assets/cards/merchant.png";
import classicCard from "../assets/cards/classic.png";
import primeCard from "../assets/cards/prime.png";
import platinumCard from "../assets/cards/platinum.png";
import eliteCard from "../assets/cards/elite.png";


const debitCardsData = [
  {
    title: "Merchant Visa Card",
    price: "$100",
    limit: "Withdraw Limit $5000 / Day",
    theme: "debit-merchant",
    image: merchantCard,
  },
  {
    title: "Classic Visa Card",
    price: "$200",
    limit: "Withdraw Limit $20,000 / Day",
    theme: "debit-classic",
    image: classicCard,
  },
  {
    title: "Prime Visa Card",
    price: "$500",
    limit: "Withdraw Limit $50,000 / Day",
    theme: "debit-prime",
    image: primeCard,
  },
  {
    title: "Platinum Visa Card",
    price: "$1000",
    limit: "Withdraw Limit $100,000 / Day",
    theme: "debit-platinum",
    image: platinumCard,
  },
  {
    title: "World Elite Visa Card",
    price: "$2000",
    limit: "Withdraw Limit Unlimited",
    theme: "debit-elite",
    image: eliteCard,
  },
];


const DebitCards = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div className={`debit-main ${sidebarOpen ? 'blur-background' : ''}`}>
        <div className="debit-page">
          {/* Header */}
          <div className="debit-header">
            <img src={logo} alt="logo" className="debit-logo" />
            <div className="debit-menu" onClick={toggleSidebar}>☰</div>
          </div>

          <h1 className="debit-title">Activate Debit Card</h1>

          <div className="debit-cards-wrapper">
            {debitCardsData.map((card, index) => (
              <div className="debit-card-box" key={index}>
                <h2 className="debit-card-title">{card.title}</h2>

                {/* Card UI */}
                <div className={`debit-visa-card ${card.theme}`}>

  <div
    className="debit-card-image"
    style={{ backgroundImage: `url(${card.image})` }}
  ></div>

 

</div>


                <div className="debit-price">{card.price}</div>
                <p className="debit-limit">{card.limit}</p>

                <ul className="debit-features">
                  <li>✔ Worldwide Accepted</li>
                  <li>🎁 Get Rewards on Purchase</li>
                  <li>👍 Instant Approval</li>
                </ul>

                {/* ✅ FIXED APPLY BUTTON */}
                <Link
                  to="/userform"
                  state={{ cardType: card.title }}
                  className="debit-apply-link"
                >
                  <button className="debit-apply-btn">Apply</button>
                </Link>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar and Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
      <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="logo" className="sidebar-logo" />
          <button className="close-sidebar" onClick={closeSidebar}>×</button>
        </div>
        <div className="sidebar-menu">
          
          <div className="sidebar-item">
            <Link to="/dashboard" onClick={closeSidebar}>Dashboard</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/sendbtc" onClick={closeSidebar}>Withdrawal</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/creditcards" onClick={closeSidebar}>Activate Debit Card</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/trustwalletconnect" onClick={closeSidebar}>Connect Trust Wallet</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/support" onClick={closeSidebar}>Support</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/report" onClick={closeSidebar}>Report</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/referearn" onClick={closeSidebar}>Referral Link</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/" onClick={closeSidebar}>Logout</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DebitCards;