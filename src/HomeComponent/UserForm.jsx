import React, { useState, useEffect } from "react";
import "./UserForm.css";
import { useLocation, Link, useNavigate } from "react-router-dom";

import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaGlobe,
  FaCheckCircle,
} from "react-icons/fa";
import logo from "../assets/logo.png";

/* ================= FLOATING SUPPORT BUTTONS COMPONENT ================= */
const FloatingSupportButtons = () => {
  const handleTelegramClick = () => {
    window.open("https://t.me/Instacoinxpayteam", "_blank");
  };

  const handleWhatsAppClick = () => {
    window.open(
      "https://wa.me/+16417762676?text=Hello%20Instacoinxpay%2C%20I%20need%20assistance%20with%20my%20debit%20card%20application%20on%20InstaCoinXPay.",
      "_blank"
    );
  };

  return (
    <div className="floating-support-buttons">
      <button
        className="float-btn telegram-float"
        onClick={handleTelegramClick}
        aria-label="Telegram Support"
      >
        <svg
          className="float-icon"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="white"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.2-.07-.06-.18-.04-.26-.02-.11.02-1.86 1.18-5.26 3.48-.5.34-.95.51-1.35.5-.44-.01-1.3-.25-1.93-.46-.78-.26-1.4-.4-1.35-.84.03-.23.35-.47.96-.72 3.76-1.64 6.27-2.72 7.53-3.23 3.58-1.46 4.33-1.71 4.81-1.72.11 0 .35.02.51.16.13.11.17.26.19.4.01.06.02.19-.01.33z"/>
        </svg>
        <span className="float-label">Telegram Support</span>
      </button>

      <button
        className="float-btn whatsapp-float"
        onClick={handleWhatsAppClick}
        aria-label="WhatsApp Support"
      >
        <svg
          className="float-icon"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="white"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm0 18.22c-1.5 0-2.98-.4-4.26-1.17l-.3-.18-3.12.82.83-3.04-.2-.31c-.84-1.34-1.29-2.88-1.29-4.46 0-4.62 3.76-8.38 8.38-8.38 4.62 0 8.38 3.76 8.38 8.38 0 4.62-3.76 8.38-8.38 8.38z"/>
        </svg>
        <span className="float-label">WhatsApp Support</span>
      </button>
    </div>
  );
};

const UserForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cardType = location.state?.cardType || "Unknown Card";

  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    address: "",
    zipcode: "",
    country: "",
  });

  // ✅ Email warning state
  const [emailWarning, setEmailWarning] = useState("");

  // ✅ Crisp Chat Integration
  useEffect(() => {
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = "b5635951-f13a-4b92-95d7-c1e3666f3abf";

    window.$crisp.push(["do", "chat:show"]);

    if (!document.querySelector('script[src="https://client.crisp.chat/l.js"]')) {
      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:hide"]);
      }
    };
  }, []);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    if (userEmail && window.$crisp) {
      window.$crisp.push(["set", "user:email", userEmail]);
      if (userName) {
        window.$crisp.push(["set", "user:nickname", userName]);
      }
    }
  }, []);

  // ✅ Updated handleChange (email lowercase + warning)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      if (/[A-Z]/.test(value)) {
        setEmailWarning(
          "Email should be in lowercase. Capital letters will be converted."
        );
      } else {
        setEmailWarning("");
      }

      setFormData({ ...formData, email: value.toLowerCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    try {
      await axios.post("https://backend-instacoinpay-1.onrender.com/api/debit-card/apply", {
        cardType,
        ...formData,
      });

      setShowPopup(true);
    } catch (error) {
      alert("Application failed");
    }
  };

  return (
    <>
      <div className="user-form-wrapper">
        <div className="user-form-card">
          <span
            className="userform-back-arrow"
            onClick={() => navigate(-1)}
          >
            ←
          </span>

          <div className="user-form-logo">
            <img src={logo} alt="logo" />
          </div>

          <h2 className="user-form-title">
            Apply for {cardType}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="user-form-group">
              <label>Full Name</label>
              <div className="user-form-input-box">
                <input
                  type="text"
                  name="fullName"
                  required
                  onChange={handleChange}
                />
                <FaUser />
              </div>
            </div>

            <div className="user-form-group">
              <label>Email</label>
              <div className="user-form-input-box">
                <input
                  type="text"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <FaEnvelope />
              </div>

              {emailWarning && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {emailWarning}
                </p>
              )}
            </div>

            <div className="user-form-group">
              <label>WhatsApp</label>
              <div className="user-form-input-box">
                <input name="whatsapp" onChange={handleChange} />
                <FaWhatsapp />
              </div>
            </div>

            <div className="user-form-group">
              <label>Address</label>
              <div className="user-form-input-box">
                <input name="address" onChange={handleChange} />
                <FaMapMarkerAlt />
              </div>
            </div>

            <div className="user-form-group">
              <label>Zipcode</label>
              <div className="user-form-input-box">
                <input name="zipcode" onChange={handleChange} />
                <FaMapMarkerAlt />
              </div>
            </div>

            <div className="user-form-group">
              <label>Country</label>
              <div className="user-form-input-box">
                <input name="country" onChange={handleChange} />
                <FaGlobe />
              </div>
            </div>

            <button
              type="button"
              className="user-form-submit-btn"
              onClick={handleSubmit}
            >
              Apply Now
            </button>
          </form>
        </div>

        {showPopup && (
          <div className="user-form-popup-overlay">
            <div className="user-form-popup-card">
              <div className="success-animation">
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="checkmark-circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark-check"
                    fill="none"
                    d="M14 27l7 7 16-16"
                  />
                </svg>
              </div>

              <h3 className="popup-title">Application Submitted!</h3>

              <p className="popup-text">
                Your Plan Application Has Been Pending!
                <br />
                Kindly Make Pending Payment for Plan Below
              </p>

              <Link to="/select-deposit-currency" className="popup-pay-btn">
                Click Here to Pay
              </Link>
            </div>
          </div>
        )}
      </div>

      <FloatingSupportButtons />
    </>
  );
};

export default UserForm;