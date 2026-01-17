import React, { useState } from "react";
import axios from "axios";
import "./Report.css";
import logo from "../assets/logo.png";

const Report = () => {
  const [userEmail, setUserEmail] = useState("");
  const [reportedEmail, setReportedEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!userEmail || !reportedEmail || !description) {
      setMessage("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await axios.post("https://backend-instacoinpay-1.onrender.com/api/reports", {
        userEmail,
        reportedEmail,
        description
      });

      setMessage("Report submitted successfully ✅");

      // Reset form
      setUserEmail("");
      setReportedEmail("");
      setDescription("");
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      {/* Header */}
      <div className="report-header">
        <img src={logo} alt="CoinXPay" className="report-logo" />
        <h1>REPORT</h1>
      </div>

      {/* Card */}
      <div className="report-card">
        <label>Your Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter email you want to report"
          value={reportedEmail}
          onChange={(e) => setReportedEmail(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* File optional – NOT sent to backend */}
        <div className="file-box">
          <input type="file" />
          <small>Attachment optional (not required)</small>
        </div>

        {message && <p className="report-message">{message}</p>}
      </div>

      {/* Submit */}
      <button
        className="report-submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default Report;
