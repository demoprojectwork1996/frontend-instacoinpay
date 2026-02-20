import React, { useState } from "react";
import TemplateLayout from "./TemplateLayout";

const WithdrawalFees = () => {
  const [formData, setFormData] = useState({
    customer: "Customer",
    withdrawalAmount: "20015.03",
    withdrawalFee: "124.09",
    withdrawalCrypto: "USDT (TRC20)",
    withdrawalAddress: "TYm5HrpfNS3RB1bXiLEprfwCDp zHZJiNWX",
  });

  const cryptoOptions = ["BTC", "TRX", "USDTBEP20", "USDTTRC", "ETH", "LTC", "DOGE", "BNB", "XRP", "SOL"];

  const handleSend = () => {
    alert(`Mail Sent Successfully to ${formData.customer}`);
  };

  return (
    <TemplateLayout 
      title="Edit Template - Withdrawal Fees" 
      formData={formData} 
      setFormData={setFormData}
      handleSend={handleSend}
    >
      <div className="wf-form-group">
        <label htmlFor="customer-withdrawal">Customer</label>
        <input
          id="customer-withdrawal"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          className="wf-form-input"
        />
      </div>

      <div className="wf-form-group">
        <label htmlFor="withdrawal-amount">Withdrawal Amount</label>
        <input
          id="withdrawal-amount"
          value={formData.withdrawalAmount}
          onChange={(e) => setFormData({ ...formData, withdrawalAmount: e.target.value })}
          className="wf-form-input"
        />
      </div>

      <div className="wf-form-group">
        <label htmlFor="withdrawal-fee">Processing Fee</label>
        <input
          id="withdrawal-fee"
          value={formData.withdrawalFee}
          onChange={(e) => setFormData({ ...formData, withdrawalFee: e.target.value })}
          className="wf-form-input"
        />
      </div>

      <div className="wf-form-group">
        <label htmlFor="withdrawal-crypto">Crypto Type</label>
        <select
          id="withdrawal-crypto"
          value={formData.withdrawalCrypto}
          onChange={(e) => setFormData({ ...formData, withdrawalCrypto: e.target.value })}
          className="wf-form-select"
        >
          {cryptoOptions.map(option => <option key={option}>{option}</option>)}
        </select>
      </div>

      <div className="wf-form-group">
        <label htmlFor="wallet-address">Wallet Address</label>
        <input
          id="wallet-address"
          value={formData.withdrawalAddress}
          onChange={(e) => setFormData({ ...formData, withdrawalAddress: e.target.value })}
          className="wf-form-input"
        />
      </div>

      <div className="wf-preview">
        <p className="wf-preview-text">
          Dear <span className="wf-red">{formData.customer}</span>,
        </p>
        <p className="wf-preview-text">Greetings from InstaCoinXPay.</p>
        <p className="wf-preview-text">
          Your withdrawal request of <span className="wf-red">${formData.withdrawalAmount} {formData.withdrawalCrypto}</span> is currently pending and will be completed after clearing the withdrawal processing fee of <span className="wf-red">${formData.withdrawalFee}</span>.
        </p>
        <p className="wf-preview-text">
          Kindly submit the required fee to the following <span className="wf-red">{formData.withdrawalCrypto}</span> wallet address:
        </p>
        <p className="wf-preview-text">
          <strong>Wallet Address:</strong>
        </p>
        <p className="wf-preview-text" style={{ background: "#f0f0f0", padding: "12px", borderRadius: "5px", fontFamily: "monospace", wordBreak: "break-all", fontSize: "14px" }}>
          <span className="wf-red">{formData.withdrawalAddress}</span>
        </p>
        <p className="wf-preview-text">
          After completing the payment, please share the transaction screenshot or transaction ID with us for verification. Once verified, your withdrawal will be processed and released without further delay.
        </p>
        <p className="wf-preview-text">
          If you require any assistance, please feel free to contact our support team.
        </p>
        <p className="wf-preview-text">Thank you for choosing InstaCoinXPay.</p>
        <p className="wf-preview-text">Best Regards,<br />InstaCoinXPay Support Team</p>
        <p className="wf-preview-text" style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
          <strong>Risk warning:</strong> Cryptocurrency trading is subject to high market risk. InstaCoinXPay will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.
        </p>
        <p className="wf-preview-text" style={{ fontSize: "12px", color: "#666" }}>
          <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InstaCoinXPay website when entering sensitive data.
        </p>
        <p className="wf-preview-text" style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "10px" }}>
          © 2026 InstaCoinXPay, All Rights Reserved
        </p>
      </div>
    </TemplateLayout>
  );
};

export default WithdrawalFees;