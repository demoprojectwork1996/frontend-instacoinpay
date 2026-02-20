import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MailTemplate.css";

const MailTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Check if email exists in location state when component mounts
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setSubmitted(true); // Automatically show template selection if email exists
    }
  }, [location.state]);

  const handleSubmit = () => {
    if (!email) {
      alert("Enter Email");
      return;
    }
    setSubmitted(true);
  };

  const handleTemplateSelect = (templateType) => {
    navigate(`/admin-mail/${templateType}`, { state: { email } });
  };

  const handleBackToEmail = () => {
    setSubmitted(false);
    // Optionally clear the email or keep it
    // setEmail("");
  };

  return (
    <div className="tl-mail-wrapper">
      <div className="tl-mail-card">
        <div className="tl-mail-header">
          <h2>Mail Template</h2>
          {submitted && (
            <button 
              onClick={handleBackToEmail}
              className="tl-back-btn"
              style={{ marginLeft: "auto" }}
            >
              Change Email
            </button>
          )}
        </div>

        {!submitted ? (
          <div className="tl-email-section">
            <div className="tl-form-group">
              <label htmlFor="user-email">User Email</label>
              <input
                id="user-email"
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="tl-email-input"
              />
            </div>
            <button className="tl-send-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        ) : (
          <div className="tl-category-box">
            <div className="tl-email-info">
              <p>Email: <span className="tl-email-value">{email}</span></p>
            </div>
            <h3>Select Template</h3>
            <ul>
              <li onClick={() => handleTemplateSelect("card-activation")}>
                Card activation request submitted
              </li>
              <li onClick={() => handleTemplateSelect("card-activated")}>
                Card activated
              </li>
              <li onClick={() => handleTemplateSelect("due-fees")}>
                Due card activation fees
              </li>
              <li onClick={() => handleTemplateSelect("withdrawal-fees")}>
                Withdrawal fees
              </li>
              <li onClick={() => handleTemplateSelect("trustwallet")}>
                Trustwallet rejection
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailTemplate;