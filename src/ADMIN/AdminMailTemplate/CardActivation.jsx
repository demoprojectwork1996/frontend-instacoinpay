import React, { useState } from "react";
import TemplateLayout from "./TemplateLayout";

const CardActivation = () => {
  const [formData, setFormData] = useState({
    customer: "Customer",
    cardType: "Class Visa Card",
    amount: "200",
    debitCard: "Class Visa Debit Card",
  });

  const handleSend = () => {
    alert(`Mail Sent Successfully to ${formData.customer}`);
  };

  return (
    <TemplateLayout 
      title="Edit Template - Card Activation" 
      formData={formData} 
      setFormData={setFormData}
      handleSend={handleSend}
    >
      <div className="cac-form-group">
        <label htmlFor="customer-name">Customer Name</label>
        <input
          id="customer-name"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          className="cac-form-input"
        />
      </div>

      <div className="cac-form-group">
        <label htmlFor="card-type">Card Type</label>
        <input
          id="card-type"
          value={formData.cardType}
          onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
          className="cac-form-input"
        />
      </div>

      <div className="cac-form-group">
        <label htmlFor="activation-fee">Activation Fee</label>
        <input
          id="activation-fee"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="cac-form-input"
        />
      </div>

      <div className="cac-form-group">
        <label htmlFor="debit-card">Debit Card</label>
        <input
          id="debit-card"
          value={formData.debitCard}
          onChange={(e) => setFormData({ ...formData, debitCard: e.target.value })}
          className="cac-form-input"
        />
      </div>

      <div className="cac-preview">
        <p className="cac-preview-text">
          Dear <span className="cac-red">{formData.customer}</span>,
        </p>
        <p className="cac-preview-text">Greetings from InstaCoinXPay.</p>
        <p className="cac-preview-text">
          We are pleased to inform you that your <span className="cac-red">{formData.cardType}</span> activation request has been successfully accepted. This is to confirm that we have received your activation fee payment of <span className="cac-red">${formData.amount}</span>, which is currently under processing.
        </p>
        <p className="cac-preview-text">
          Our verification and card activation procedures are now in progress. Upon successful completion of the activation process, your <span className="cac-red">{formData.debitCard}</span> will be fully enabled for withdrawals and transaction usage. A confirmation notification will be sent to you promptly once the activation is finalized.
        </p>
        <p className="cac-preview-text">
          Should you have any questions or require additional assistance, please do not hesitate to contact our Customer Support Team. We remain committed to providing you with secure and efficient service.
        </p>
        <p className="cac-preview-text">Thank you for choosing InstaCoinXPay.</p>
        <p className="cac-preview-text">Best Regards,<br />InstaCoinXPay Support Team</p>
        <p className="cac-preview-text" style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
          <strong>Risk warning:</strong> Cryptocurrency trading is subject to high market risk. InstaCoinXPay will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.
        </p>
        <p className="cac-preview-text" style={{ fontSize: "12px", color: "#666" }}>
          <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InstaCoinXPay website when entering sensitive data.
        </p>
        <p className="cac-preview-text" style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "10px" }}>
          © 2026 InstaCoinXPay, All Rights Reserved
        </p>
      </div>
    </TemplateLayout>
  );
};

export default CardActivation;