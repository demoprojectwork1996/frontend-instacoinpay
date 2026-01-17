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

const Card = ({
  type = "classic",
  number,
  holder,
  expiry,
  cvv = "***",
  status = "INACTIVE",
}) => {
  const [flipped, setFlipped] = useState(false);

  // ✅ CONTROLLED FLIP WITH AUTO-RESET
  const handleFlip = () => {
    if (status !== "Activate" || flipped) return;

    setFlipped(true);

    // ⏱ auto flip back after 2 seconds
    setTimeout(() => {
      setFlipped(false);
    }, 2000);
  };

  return (
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
      status === "Activate"
        ? "card-active"
        : status === "PENDING"
        ? "card-pending"
        : "card-inactive"
    }`}
  >
    {status}
  </div>

  <div className="card-number">{number}</div>
  <div className="card-holder-name">Card Holder</div>
  <div className="card-holder">{holder}</div>

  <div className="card-expiry">
    <div className="expiry-label">Expiry Date</div>
    <div className="expiry-value">{expiry}</div>
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
            {status === "Activate" ? cvv : "***"}
          </div>

          <div className="card-disclaimer">
            This card is issued by the authorized issuer and remains its property.
            The cardholder agrees to comply with all applicable terms, conditions,
            and security requirements. Misuse may result in suspension or
            termination.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;