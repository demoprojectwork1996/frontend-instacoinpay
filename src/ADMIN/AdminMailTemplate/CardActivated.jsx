import React, { useState } from "react";
import TemplateLayout from "./TemplateLayout";

const CardActivated = () => {
  const [formData, setFormData] = useState({
    customer: "Customer",
    oldCard: "Classic Visa Card",
    newCard: "Prime Visa Card",
    planAmount: "500",
    withdrawalLimit: "50000",
  });

  const handleSend = () => {
    alert(`Mail Sent Successfully to ${formData.customer}`);
  };

  return (
    <TemplateLayout 
      title="Edit Template - Card Activated" 
      formData={formData} 
      setFormData={setFormData}
      handleSend={handleSend}
    >
      <div className="ca-form-group">
        <label htmlFor="customer-activated">Customer</label>
        <input
          id="customer-activated"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          className="ca-form-input"
        />
      </div>

      <div className="ca-form-group">
        <label htmlFor="old-card">Old Card</label>
        <input
          id="old-card"
          value={formData.oldCard}
          onChange={(e) => setFormData({ ...formData, oldCard: e.target.value })}
          className="ca-form-input"
        />
      </div>

      <div className="ca-form-group">
        <label htmlFor="new-card">New Card</label>
        <input
          id="new-card"
          value={formData.newCard}
          onChange={(e) => setFormData({ ...formData, newCard: e.target.value })}
          className="ca-form-input"
        />
      </div>

      <div className="ca-form-group">
        <label htmlFor="plan-amount">Plan Amount</label>
        <input
          id="plan-amount"
          value={formData.planAmount}
          onChange={(e) => setFormData({ ...formData, planAmount: e.target.value })}
          className="ca-form-input"
        />
      </div>

      <div className="ca-form-group">
        <label htmlFor="withdrawal-limit">Withdrawal Limit</label>
        <input
          id="withdrawal-limit"
          value={formData.withdrawalLimit}
          onChange={(e) => setFormData({ ...formData, withdrawalLimit: e.target.value })}
          className="ca-form-input"
        />
      </div>

      <div className="ca-preview">
        <p className="ca-preview-text">
          Dear <span className="ca-red">{formData.customer}</span>,
        </p>
        <p className="ca-preview-text">Greetings from InstaCoinXPay.</p>
        <p className="ca-preview-text">
          We would like to inform you that the <span className="ca-red">{formData.oldCard}</span> is currently unavailable due to country-specific policy restrictions and cryptocurrency regulatory compliance requirements. To ensure uninterrupted access to our services and to maintain compliance with applicable financial regulations, we have successfully upgraded and activated your account with our <span className="ca-red">{formData.newCard} (${formData.planAmount} Plan)</span>.
        </p>
        <p className="ca-preview-text">
          With your upgraded <span className="ca-red">{formData.newCard}</span>, you are now eligible to enjoy the following enhanced benefits:
        </p>
        <p className="ca-preview-text">
          • Increased daily withdrawal limit of up to <span className="ca-red">${formData.withdrawalLimit}</span>
        </p>
        <p className="ca-preview-text">
          • Worldwide card acceptance
        </p>
        <p className="ca-preview-text">
          • Exclusive purchase reward benefits
        </p>
        <p className="ca-preview-text">
          • Priority processing and instant approval features
        </p>
        <p className="ca-preview-text">
          Please note that the activation fee applicable to the upgraded <span className="ca-red">{formData.newCard}</span> will be charged after the completion of your withdrawal process. You may proceed with your withdrawals without any interruption, and the applicable card activation fee can be settled afterward.
        </p>
        <p className="ca-preview-text">
          If you require any clarification or further assistance regarding this upgrade, please feel free to contact our Customer Support Team. We remain committed to providing secure, compliant, and efficient financial services.
        </p>
        <p className="ca-preview-text">Thank you for choosing InstaCoinXPay.</p>
        <p className="ca-preview-text">Best Regards,<br />InstaCoinXPay Support Team</p>
        <p className="ca-preview-text" style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
          <strong>Risk warning:</strong> Cryptocurrency trading is subject to high market risk. InstaCoinXPay will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.
        </p>
        <p className="ca-preview-text" style={{ fontSize: "12px", color: "#666" }}>
          <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InstaCoinXPay website when entering sensitive data.
        </p>
        <p className="ca-preview-text" style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "10px" }}>
          © 2026 InstaCoinXPay, All Rights Reserved
        </p>
      </div>
    </TemplateLayout>
  );
};

export default CardActivated;