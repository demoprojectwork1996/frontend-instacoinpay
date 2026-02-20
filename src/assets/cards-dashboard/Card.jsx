import { useState } from "react";
import "./card.css";

import classic from "../cards-dashboard/classic.png";
import merchant from "../cards-dashboard/merchant.png";
import prime from "../cards-dashboard/prime.png";
import elite from "../cards-dashboard/elite.png";
import platinum from "../cards-dashboard/platinum.png";

/* Back images */
import classicBack from "../cards-dashboard/backs/classic-back.png";
import merchantBack from "../cards-dashboard/backs/merchant-back.png";
import primeBack from "../cards-dashboard/backs/prime-back.png";
import eliteBack from "../cards-dashboard/backs/elite-back.png";
import platinumBack from "../cards-dashboard/backs/platinum-back.png";

const FRONT = { classic, merchant, prime, elite, platinum };
const BACK = {
  classic: classicBack,
  merchant: merchantBack,
  prime: primeBack,
  elite: eliteBack,
  platinum: platinumBack,
};

// In Card.js - Add better status handling

const Card = ({
  type = "classic",
  number = "**** **** **** 1234",
  holder = "JOHN DOE",
  expiry = "12/29",
  cvv = "XXX",
  status = "INACTIVE",
}) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (flipped) return;
    setFlipped(true);
    setTimeout(() => {
      setFlipped(false);
    }, 2000);
  };

  // ✅ FIX: Normalize status and ensure it's never lost
  const normalizedStatus = (() => {
    // If status is empty or undefined, check localStorage
    if (!status || status === "INACTIVE") {
      const savedCard = localStorage.getItem("userCardData");
      if (savedCard) {
        const savedStatus = JSON.parse(savedCard).status;
        if (savedStatus && savedStatus !== "INACTIVE") {
          return savedStatus;
        }
      }
    }
    
    // Normalize the status
    const statusUpper = String(status).toUpperCase();
    
    if (statusUpper === "ACTIVATE" || statusUpper === "ACTIVE" || statusUpper === "ACTIVATED") {
      return "ACTIVATE";
    }
    if (statusUpper === "PENDING") {
      return "PENDING";
    }
    return "INACTIVE";
  })();

  console.log('🎴 Card rendering with status:', { 
    original: status, 
    normalized: normalizedStatus 
  });

  return (
    <div className="card-page">
      <div className="card-container">
        <div
          className={`card-flip ${flipped ? "flipped" : ""}`}
          onClick={handleFlip}
        >
          {/* FRONT */}
          <div
            className="card-exact card-front"
            style={{ backgroundImage: `url(${FRONT[type]})` }}
          >
            {/* STATUS */}
            <div
              className={`card-status ${
                normalizedStatus === "ACTIVATE"
                  ? "card-active"
                  : normalizedStatus === "PENDING"
                  ? "card-pending"
                  : "card-inactive"
              }`}
            >
              {normalizedStatus}
            </div>

            {/* CARD NUMBER */}
            <div className="card-number">
              {normalizedStatus === "ACTIVATE" ? number : "XXXX XXXX XXXX XXXX"}
            </div>

            <div className="card-holder-name">Card Holder</div>
            <div className="card-holder">{holder}</div>

            <div className="card-expiry">
              <div className="expiry-label">Expiry Date</div>
              <div className="expiry-value">
                {normalizedStatus === "ACTIVATE" ? expiry : "XX/XX"}
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="card-exact card-back"
            style={{ backgroundImage: `url(${BACK[type]})` }}
          >
            <div className="card-support">
              For customer service, contact WhatsApp Support.
            </div>

            <div className="cvv-box">
              {normalizedStatus === "ACTIVATE" ? cvv : "***"}
            </div>

            <div className="card-disclaimer">
              This card is issued by the authorized issuer and remains its
              property. The cardholder agrees to comply with all applicable
              terms, conditions, and security requirements. Misuse may result in
              suspension or termination.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;