import React, { useState } from "react";
import TemplateLayout from "./TemplateLayout";

const DueFees = () => {
  const [formData, setFormData] = useState({
    customer: "Customer",
    dueAmount: "300",
    cryptoType: "BTC",
    btcAddress: "Official BTC Receiving Address",
  });

  const cryptoOptions = ["BTC", "TRX", "USDTBEP20", "USDTTRC", "ETH", "LTC", "DOGE", "BNB", "XRP", "SOL"];

  const handleSend = () => {
    alert(`Mail Sent Successfully to ${formData.customer}`);
  };

  return (
    <TemplateLayout 
      title="Edit Template - Due Fees" 
      formData={formData} 
      setFormData={setFormData}
      handleSend={handleSend}
    >
      <div className="df-form-group">
        <label htmlFor="customer-due">Customer</label>
        <input
          id="customer-due"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          className="df-form-input"
        />
      </div>

      <div className="df-form-group">
        <label htmlFor="due-amount">Due Amount</label>
        <input
          id="due-amount"
          value={formData.dueAmount}
          onChange={(e) => setFormData({ ...formData, dueAmount: e.target.value })}
          className="df-form-input"
        />
      </div>

      <div className="df-form-group">
        <label htmlFor="crypto-type">Crypto Type</label>
        <select
          id="crypto-type"
          value={formData.cryptoType}
          onChange={(e) => setFormData({ ...formData, cryptoType: e.target.value })}
          className="df-form-select"
        >
          {cryptoOptions.map(option => <option key={option}>{option}</option>)}
        </select>
      </div>

      <div className="df-form-group">
        <label htmlFor="receiving-address">Receiving Address</label>
        <input
          id="receiving-address"
          value={formData.btcAddress}
          onChange={(e) => setFormData({ ...formData, btcAddress: e.target.value })}
          className="df-form-input"
        />
      </div>

      <div className="df-preview">
        <p className="df-preview-text">
          Dear <span className="df-red">{formData.customer}</span>,
        </p>
        <p className="df-preview-text">Greetings from InstaCoinXPay.</p>
        <p className="df-preview-text">
          We would like to inform you that the card activation fee of <span className="df-red">${formData.dueAmount}</span> for your account is currently pending. Kindly note that the activation process of your card cannot be completed until the due activation fee is successfully cleared.
        </p>
        <p className="df-preview-text">
          Please be advised that until the pending fee is settled, your withdrawal request may experience delays or processing issues. Once the payment is received and verified by our billing department, your card activation process will be completed, and your withdrawal and transaction services will function without any limitations.
        </p>
        <p className="df-preview-text">
          You may complete the payment using <span className="df-red">{formData.cryptoType}</span> to our official receiving address provided below:
        </p>
        <p className="df-preview-text">
          <span className="df-red">{formData.cryptoType}</span> Payment Address: <span className="df-red">{formData.btcAddress}</span>
        </p>
        <p className="df-preview-text">
          After completing the payment, kindly send the payment confirmation screenshot or transaction receipt to us via registered email or through our WhatsApp Support Team for verification and faster processing.
        </p>
        <p className="df-preview-text">
          If you require any assistance regarding the payment process or have any questions, please feel free to contact our Customer Support Team. We are always available to assist you.
        </p>
        <p className="df-preview-text">Thank you for choosing InstaCoinXPay.</p>
        <p className="df-preview-text">Best Regards,<br />InstaCoinXPay Support Team</p>
        <p className="df-preview-text" style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
          <strong>Risk warning:</strong> Cryptocurrency trading is subject to high market risk. InstaCoinXPay will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.
        </p>
        <p className="df-preview-text" style={{ fontSize: "12px", color: "#666" }}>
          <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InstaCoinXPay website when entering sensitive data.
        </p>
        <p className="df-preview-text" style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "10px" }}>
          © 2026 InstaCoinXPay, All Rights Reserved
        </p>
      </div>
    </TemplateLayout>
  );
};

export default DueFees;