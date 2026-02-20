import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TemplateLayout from "./TemplateLayout";

const CardActivated = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [formData, setFormData] = useState({
    customer: "Customer",
    oldCard: "Classic Visa Card",
    newCard: "Prime Visa Card",
    planAmount: "500",
    withdrawalLimit: "50000",
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

      const response = await fetch('/api/admin/mail/card-activated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email,
          customer: formData.customer,
          oldCard: formData.oldCard,
          newCard: formData.newCard,
          planAmount: formData.planAmount,
          withdrawalLimit: formData.withdrawalLimit
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `✅ ${data.template || 'Card Activated'} email sent successfully to ${email}` 
        });
        
        // Optional: Clear success message after 5 seconds
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
      title="Edit Template - Card Activated" 
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

      <div className="ca-form-group">
        <label htmlFor="customer-activated">Customer Name <span style={{color: '#ff0000'}}>*</span></label>
        <input
          id="customer-activated"
          type="text"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          className="ca-form-input"
          placeholder="Enter customer name"
          required
        />
      </div>

      <div className="ca-form-group">
        <label htmlFor="old-card">Old Card <span style={{color: '#ff0000'}}>*</span></label>
        <input
          id="old-card"
          type="text"
          value={formData.oldCard}
          onChange={(e) => setFormData({ ...formData, oldCard: e.target.value })}
          className="ca-form-input"
          placeholder="e.g., Classic Visa Card"
          required
        />
      </div>

      <div className="ca-form-group">
        <label htmlFor="new-card">New Card <span style={{color: '#ff0000'}}>*</span></label>
        <input
          id="new-card"
          type="text"
          value={formData.newCard}
          onChange={(e) => setFormData({ ...formData, newCard: e.target.value })}
          className="ca-form-input"
          placeholder="e.g., Prime Visa Card"
          required
        />
      </div>

      <div className="ca-form-group">
        <label htmlFor="plan-amount">Plan Amount ($) <span style={{color: '#ff0000'}}>*</span></label>
        <input
          id="plan-amount"
          type="number"
          min="0"
          step="1"
          value={formData.planAmount}
          onChange={(e) => setFormData({ ...formData, planAmount: e.target.value })}
          className="ca-form-input"
          placeholder="e.g., 500"
          required
        />
      </div>

      <div className="ca-form-group">
        <label htmlFor="withdrawal-limit">Withdrawal Limit ($) <span style={{color: '#ff0000'}}>*</span></label>
        <input
          id="withdrawal-limit"
          type="number"
          min="0"
          step="1000"
          value={formData.withdrawalLimit}
          onChange={(e) => setFormData({ ...formData, withdrawalLimit: e.target.value })}
          className="ca-form-input"
          placeholder="e.g., 50000"
          required
        />
      </div>

      <div className="ca-preview" style={{ marginTop: '30px', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Email Preview</h3>
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

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "15px", marginTop: "30px", justifyContent: "flex-end" }}>
      </div>
    </TemplateLayout>
  );
};

export default CardActivated;