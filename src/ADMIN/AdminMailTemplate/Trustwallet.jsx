import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TemplateLayout from "./TemplateLayout";

const Trustwallet = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [formData, setFormData] = useState({
    walletCustomer: "Customer",
    walletDays: "30",
  });

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      if (!formData.walletCustomer || !formData.walletDays) {
        setMessage({ type: 'error', text: 'Please fill in all fields.' });
        setSending(false);
        return;
      }

      // Validate wallet days is a positive number
      if (parseInt(formData.walletDays) <= 0) {
        setMessage({ type: 'error', text: 'Wallet days must be a positive number.' });
        setSending(false);
        return;
      }

      const response = await fetch('/api/admin/mail/trustwallet-rejection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email,
          walletCustomer: formData.walletCustomer,
          walletDays: formData.walletDays
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `✅ ${data.template || 'Trustwallet Rejection'} email sent successfully to ${email}` 
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
      title="Edit Template - Trustwallet Rejection" 
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

      <div className="tw-form-group" style={{ marginBottom: '20px' }}>
        <label htmlFor="wallet-customer" style={{ 
          display: 'block', 
          marginBottom: '5px', 
          fontWeight: 'bold',
          color: '#333'
        }}>
          Customer Name <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="wallet-customer"
          type="text"
          value={formData.walletCustomer}
          onChange={(e) => setFormData({ ...formData, walletCustomer: e.target.value })}
          className="tw-form-input"
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
          onFocus={(e) => e.target.style.borderColor = '#6f42c1'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
          Enter the full name of the customer
        </small>
      </div>

      <div className="tw-form-group" style={{ marginBottom: '20px' }}>
        <label htmlFor="wallet-days" style={{ 
          display: 'block', 
          marginBottom: '5px', 
          fontWeight: 'bold',
          color: '#333'
        }}>
          Minimum Wallet Age (Days) <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="wallet-days"
          type="number"
          min="1"
          max="365"
          step="1"
          value={formData.walletDays}
          onChange={(e) => setFormData({ ...formData, walletDays: e.target.value })}
          className="tw-form-input"
          placeholder="e.g., 30"
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#6f42c1'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <small style={{ color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' }}>
          Minimum number of days the wallet must be old (1-365 days)
        </small>
      </div>

      <div className="tw-preview" style={{ 
        marginTop: '30px', 
        border: '2px solid #6f42c1', 
        padding: '25px', 
        borderRadius: '12px', 
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 12px rgba(111, 66, 193, 0.1)'
      }}>
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '20px', 
          color: '#6f42c1', 
          borderBottom: '2px solid #6f42c1', 
          paddingBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🔐</span> Email Preview
        </h3>
        
        <p className="tw-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Dear <span className="tw-red" style={{ color: '#ff0000', fontWeight: 'bold' }}>{formData.walletCustomer}</span>,
        </p>
        <p className="tw-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Greetings from InstaCoinXPay.
        </p>
        <p className="tw-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          We would like to inform you that, to successfully connect a wallet to your InstaCoinXPay account, the wallet must be at least <span className="tw-red" style={{ color: '#ff0000', fontWeight: 'bold' }}>{formData.walletDays} days</span> old.
        </p>
        <p className="tw-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          This requirement is part of our security and verification process to ensure safe and smooth withdrawal transactions.
        </p>
        <p className="tw-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Please make sure your wallet meets this condition before proceeding with the connection. Once the wallet is eligible and properly connected, you will be able to continue with your withdrawal process.
        </p>
        <p className="tw-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          If you need any assistance or have questions regarding wallet eligibility, our support team is available to help.
        </p>
        <p className="tw-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Thank you for your understanding and for choosing InstaCoinXPay.
        </p>
        <p className="tw-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '5px' }}>
          Best Regards,
        </p>
        <p className="tw-preview-text" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
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
          <p className="tw-preview-text" style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
            <strong>Risk warning:</strong> Cryptocurrency trading is subject to high market risk. InstaCoinXPay will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.
          </p>
          <p className="tw-preview-text" style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
            <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InstaCoinXPay website when entering sensitive data.
          </p>
          <p className="tw-preview-text" style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "15px" }}>
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

export default Trustwallet;