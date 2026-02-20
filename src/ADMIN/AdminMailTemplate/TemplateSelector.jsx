import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./MailTemplate.css";

const TemplateSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleTemplateSelect = (templateType) => {
    navigate(`/admin-mail/${templateType}`, { state: { email } });
  };

  const handleBack = () => {
    navigate('/admin-mail');
  };

  return (
    <div className="ts-mail-wrapper">
      <div className="ts-mail-card">
        <div className="ts-mail-header">
          <button className="ts-back-btn" onClick={handleBack}>
            <FaArrowLeft />
          </button>
          <h2>Select Template</h2>
        </div>

        <div className="ts-email-info">
          <p>Email: <span className="ts-email-value">{email}</span></p>
        </div>

        <div className="ts-category-box">
          <h3>Choose a Template</h3>
          <ul className="ts-template-list">
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
      </div>
    </div>
  );
};

export default TemplateSelector;