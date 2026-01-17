import React, { useState } from "react";
import "./UserForm.css";
import { useLocation, Link } from "react-router-dom";
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

const UserForm = () => {
  const location = useLocation();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    <div className="user-form-wrapper">
      <div className="user-form-card">
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
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
              <FaEnvelope />
            </div>
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

          <button className="user-form-submit-btn">
            Apply Now
          </button>
        </form>
      </div>

     {showPopup && (
  <div className="user-form-popup-overlay">
    <div className="user-form-popup-card">

      {/* ✅ Animated Success Tick */}
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
  );
};

export default UserForm;