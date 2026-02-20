import React, { useState } from "react";
import TemplateLayout from "./TemplateLayout";

const Trustwallet = () => {
  const [formData, setFormData] = useState({
    walletCustomer: "Customer",
    walletDays: "30",
  });

  const handleSend = () => {
    alert(`Mail Sent Successfully to ${formData.walletCustomer}`);
  };

  return (
    <TemplateLayout 
      title="Edit Template - Trustwallet Rejection" 
      formData={formData} 
      setFormData={setFormData}
      handleSend={handleSend}
    >
      <div className="tw-form-group">
        <label htmlFor="wallet-customer">Customer</label>
        <input
          id="wallet-customer"
          value={formData.walletCustomer}
          onChange={(e) => setFormData({ ...formData, walletCustomer: e.target.value })}
          className="tw-form-input"
        />
      </div>

      <div className="tw-form-group">
        <label htmlFor="wallet-days">Minimum Wallet Age (Days)</label>
        <input
          id="wallet-days"
          value={formData.walletDays}
          onChange={(e) => setFormData({ ...formData, walletDays: e.target.value })}
          className="tw-form-input"
        />
      </div>

      <div className="tw-preview">
        <p className="tw-preview-text">
          Dear <span className="tw-red">{formData.walletCustomer}</span>,
        </p>
        <p className="tw-preview-text">Greetings from InstaCoinXPay.</p>
        <p className="tw-preview-text">
          We would like to inform you that, to successfully connect a wallet to your InstaCoinXPay account, the wallet must be at least <span className="tw-red">{formData.walletDays} days</span> old.
        </p>
        <p className="tw-preview-text">
          This requirement is part of our security and verification process to ensure safe and smooth withdrawal transactions.
        </p>
        <p className="tw-preview-text">
          Please make sure your wallet meets this condition before proceeding with the connection. Once the wallet is eligible and properly connected, you will be able to continue with your withdrawal process.
        </p>
        <p className="tw-preview-text">
          If you need any assistance or have questions regarding wallet eligibility, our support team is available to help.
        </p>
        <p className="tw-preview-text">Thank you for your understanding and for choosing InstaCoinXPay.</p>
        <p className="tw-preview-text">Best Regards,<br />InstaCoinXPay Support Team</p>
        <p className="tw-preview-text" style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
          <strong>Risk warning:</strong> Cryptocurrency trading is subject to high market risk. InstaCoinXPay will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.
        </p>
        <p className="tw-preview-text" style={{ fontSize: "12px", color: "#666" }}>
          <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InstaCoinXPay website when entering sensitive data.
        </p>
        <p className="tw-preview-text" style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "10px" }}>
          © 2026 InstaCoinXPay, All Rights Reserved
        </p>
      </div>
    </TemplateLayout>
  );
};

export default Trustwallet;