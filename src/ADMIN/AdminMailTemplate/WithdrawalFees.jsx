import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TemplateLayout from "./TemplateLayout";

const WithdrawalFees = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [formData, setFormData] = useState({
    customer: "Customer",
    withdrawalAmount: "20015.03",
    withdrawalFee: "124.09",
    withdrawalCrypto: "USDT (TRC20)",
    withdrawalAddress: "TYm5HrpfNS3RB1bXiLEprfwCDp zHZJiNWX",
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

      // Validate form data
      if (!formData.customer || !formData.withdrawalAmount || !formData.withdrawalFee || !formData.withdrawalCrypto || !formData.withdrawalAddress) {
        setMessage({ type: 'error', text: 'Please fill in all fields.' });
        setSending(false);
        return;
      }

      // Validate amounts are positive numbers
      if (parseFloat(formData.withdrawalAmount) <= 0 || parseFloat(formData.withdrawalFee) <= 0) {
        setMessage({ type: 'error', text: 'Amounts must be positive numbers.' });
        setSending(false);
        return;
      }

      const response = await fetch('/api/admin/mail/withdrawal-fees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email,
          customer: formData.customer,
          withdrawalAmount: formData.withdrawalAmount,
          withdrawalFee: formData.withdrawalFee,
          withdrawalCrypto: formData.withdrawalCrypto,
          withdrawalAddress: formData.withdrawalAddress
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `✅ ${data.template || 'Withdrawal Fees'} email sent successfully to ${email}` 
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

  // Format currency helper
  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toFixed(2);
  };

  return (
    <TemplateLayout 
      title="Edit Template - Withdrawal Fees" 
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
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
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
          <span>
            <strong>📧 Sending to:</strong> 
            <span style={{ color: '#0066cc', marginLeft: '8px', fontWeight: 'bold' }}>{email}</span>
          </span>
          <span style={{ fontSize: '12px', color: '#666' }}>(from previous step)</span>
        </div>
      )}

      <div className="wf-form-group" style={{ marginBottom: '20px' }}>
        <label htmlFor="customer-withdrawal" style={{ 
          display: 'block', 
          marginBottom: '5px', 
          fontWeight: 'bold',
          color: '#333'
        }}>
          Customer Name <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="customer-withdrawal"
          type="text"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          className="wf-form-input"
          placeholder="Enter customer name"
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#fd7e14'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      <div className="wf-form-group" style={{ marginBottom: '20px' }}>
        <label htmlFor="withdrawal-amount" style={{ 
          display: 'block', 
          marginBottom: '5px', 
          fontWeight: 'bold',
          color: '#333'
        }}>
          Withdrawal Amount ($) <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="withdrawal-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.withdrawalAmount}
          onChange={(e) => setFormData({ ...formData, withdrawalAmount: e.target.value })}
          className="wf-form-input"
          placeholder="e.g., 20015.03"
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#fd7e14'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
          Enter the withdrawal amount in USD
        </small>
      </div>

      <div className="wf-form-group" style={{ marginBottom: '20px' }}>
        <label htmlFor="withdrawal-fee" style={{ 
          display: 'block', 
          marginBottom: '5px', 
          fontWeight: 'bold',
          color: '#333'
        }}>
          Processing Fee ($) <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="withdrawal-fee"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.withdrawalFee}
          onChange={(e) => setFormData({ ...formData, withdrawalFee: e.target.value })}
          className="wf-form-input"
          placeholder="e.g., 124.09"
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#fd7e14'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
          Enter the processing fee amount in USD
        </small>
      </div>

      <div className="wf-form-group" style={{ marginBottom: '20px' }}>
        <label htmlFor="withdrawal-crypto" style={{ 
          display: 'block', 
          marginBottom: '5px', 
          fontWeight: 'bold',
          color: '#333'
        }}>
          Cryptocurrency Type <span style={{color: '#ff0000'}}>*</span>
        </label>
        <select
          id="withdrawal-crypto"
          value={formData.withdrawalCrypto}
          onChange={(e) => setFormData({ ...formData, withdrawalCrypto: e.target.value })}
          className="wf-form-select"
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.borderColor = '#fd7e14'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        >
          {cryptoOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
          Select the cryptocurrency for fee payment
        </small>
      </div>

      <div className="wf-form-group" style={{ marginBottom: '20px' }}>
        <label htmlFor="wallet-address" style={{ 
          display: 'block', 
          marginBottom: '5px', 
          fontWeight: 'bold',
          color: '#333'
        }}>
          Wallet Address <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="wallet-address"
          type="text"
          value={formData.withdrawalAddress}
          onChange={(e) => setFormData({ ...formData, withdrawalAddress: e.target.value })}
          className="wf-form-input"
          placeholder="Enter wallet address"
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}
          onFocus={(e) => e.target.style.borderColor = '#fd7e14'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
          Enter the wallet address where fee should be sent
        </small>
      </div>

      <div className="wf-preview" style={{ 
        marginTop: '30px', 
        border: '2px solid #fd7e14', 
        padding: '25px', 
        borderRadius: '12px', 
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 12px rgba(253, 126, 20, 0.1)'
      }}>
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '20px', 
          color: '#fd7e14', 
          borderBottom: '2px solid #fd7e14', 
          paddingBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>💸</span> Email Preview
        </h3>
        
        <p className="wf-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Dear <span className="wf-red" style={{ color: '#ff0000', fontWeight: 'bold' }}>{formData.customer}</span>,
        </p>
        <p className="wf-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Greetings from InstaCoinXPay.
        </p>
        <p className="wf-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Your withdrawal request of <span className="wf-red" style={{ color: '#ff0000', fontWeight: 'bold' }}>${formatCurrency(formData.withdrawalAmount)} {formData.withdrawalCrypto}</span> is currently pending and will be completed after clearing the withdrawal processing fee of <span className="wf-red" style={{ color: '#ff0000', fontWeight: 'bold' }}>${formatCurrency(formData.withdrawalFee)}</span>.
        </p>
        <p className="wf-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Kindly submit the required fee to the following <span className="wf-red" style={{ color: '#ff0000', fontWeight: 'bold' }}>{formData.withdrawalCrypto}</span> wallet address:
        </p>
        <p className="wf-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '5px' }}>
          <strong>Wallet Address:</strong>
        </p>
        <p className="wf-preview-text" style={{ 
          background: "#f0f0f0", 
          padding: "15px", 
          borderRadius: "8px", 
          fontFamily: "monospace", 
          wordBreak: "break-all", 
          fontSize: "14px",
          border: '1px solid #fd7e14',
          marginBottom: '15px'
        }}>
          <span className="wf-red" style={{ color: '#ff0000', fontWeight: 'bold' }}>{formData.withdrawalAddress}</span>
        </p>
        <p className="wf-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          After completing the payment, please share the transaction screenshot or transaction ID with us for verification. Once verified, your withdrawal will be processed and released without further delay.
        </p>
        <p className="wf-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          If you require any assistance, please feel free to contact our support team.
        </p>
        <p className="wf-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Thank you for choosing InstaCoinXPay.
        </p>
        <p className="wf-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '5px' }}>
          Best Regards,
        </p>
        <p className="wf-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
          InstaCoinXPay Support Team
        </p>
        
        <div style={{ 
          marginTop: '20px', 
          borderTop: '1px solid #e0e0e0', 
          paddingTop: '15px',
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px'
        }}>
          <p className="wf-preview-text" style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
            <strong>Risk warning:</strong> Cryptocurrency trading is subject to high market risk. InstaCoinXPay will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.
          </p>
          <p className="wf-preview-text" style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
            <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InstaCoinXPay website when entering sensitive data.
          </p>
          <p className="wf-preview-text" style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "15px" }}>
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

export default WithdrawalFees;