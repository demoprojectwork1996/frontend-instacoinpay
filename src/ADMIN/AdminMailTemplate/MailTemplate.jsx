import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MailTemplate.css";

const MailTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Check if email exists in location state when component mounts
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setSubmitted(true);
    }
  }, [location.state]);

  const handleSubmit = () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }
    
    setMessage({ type: '', text: '' });
    setSubmitted(true);
  };

  const handleTemplateSelect = (templateType) => {
    setLoading(true);
    // You could add validation here if needed
    setTimeout(() => {
      setLoading(false);
      navigate(`/admin-mail/${templateType}`, { state: { email } });
    }, 300);
  };

  const handleBackToEmail = () => {
    setSubmitted(false);
    setMessage({ type: '', text: '' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="tl-mail-wrapper">
      <div className="tl-mail-card">
        <div className="tl-mail-header">
          <h2>📧 Mail Template</h2>
          {submitted && (
            <button 
              onClick={handleBackToEmail}
              className="tl-back-btn"
              style={{ marginLeft: "auto" }}
            >
              Change Email
            </button>
          )}
        </div>

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

        {!submitted ? (
          <div className="tl-email-section">
            <div className="tl-form-group">
              <label htmlFor="user-email">
                User Email <span style={{color: '#ff0000'}}>*</span>
              </label>
              <input
                id="user-email"
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage({ type: '', text: '' });
                }}
                onKeyPress={handleKeyPress}
                className="tl-email-input"
                autoFocus
                style={{
                  padding: '12px',
                  border: '2px solid ' + (message.type === 'error' ? '#dc3545' : '#ddd'),
                  borderRadius: '6px',
                  fontSize: '16px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                Enter the email address of the recipient
              </small>
            </div>
            
            <button 
              className="tl-send-btn" 
              onClick={handleSubmit}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                marginTop: '10px',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#0056b3'}
              onMouseLeave={(e) => e.target.style.background = '#007bff'}
            >
              Continue →
            </button>
          </div>
        ) : (
          <div className="tl-category-box">
            <div className="tl-email-info" style={{
              backgroundColor: '#e7f3ff',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px',
              border: '1px solid #b8daff'
            }}>
              <p style={{ margin: 0, fontSize: '16px' }}>
                <strong>📧 Recipient:</strong> 
                <span style={{ color: '#0066cc', marginLeft: '8px', fontWeight: 'bold' }}>{email}</span>
              </p>
            </div>
            
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Select Template Type</h3>
            
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li 
                onClick={() => handleTemplateSelect("card-activation")}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#e9ecef';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                <span style={{ fontSize: '20px' }}>💳</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '16px', display: 'block' }}>
                    Card activation request submitted
                  </strong>
                  <small style={{ color: '#666' }}>
                    Send confirmation for card activation request
                  </small>
                </div>
                <span style={{ color: '#999' }}>→</span>
              </li>
              
              <li 
                onClick={() => handleTemplateSelect("card-activated")}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#e9ecef';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                <span style={{ fontSize: '20px' }}>✅</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '16px', display: 'block' }}>
                    Card activated
                  </strong>
                  <small style={{ color: '#666' }}>
                    Notify user about successful card activation/upgrade
                  </small>
                </div>
                <span style={{ color: '#999' }}>→</span>
              </li>
              
              <li 
                onClick={() => handleTemplateSelect("due-fees")}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#e9ecef';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                <span style={{ fontSize: '20px' }}>💰</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '16px', display: 'block' }}>
                    Due card activation fees
                  </strong>
                  <small style={{ color: '#666' }}>
                    Remind user about pending activation fees
                  </small>
                </div>
                <span style={{ color: '#999' }}>→</span>
              </li>
              
              <li 
                onClick={() => handleTemplateSelect("withdrawal-fees")}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#e9ecef';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                <span style={{ fontSize: '20px' }}>💸</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '16px', display: 'block' }}>
                    Withdrawal fees
                  </strong>
                  <small style={{ color: '#666' }}>
                    Request withdrawal processing fee
                  </small>
                </div>
                <span style={{ color: '#999' }}>→</span>
              </li>
              
              <li 
                onClick={() => handleTemplateSelect("trustwallet")}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#e9ecef';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                <span style={{ fontSize: '20px' }}>🔐</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '16px', display: 'block' }}>
                    Trustwallet rejection
                  </strong>
                  <small style={{ color: '#666' }}>
                    Notify about wallet age requirement
                  </small>
                </div>
                <span style={{ color: '#999' }}>→</span>
              </li>
            </ul>

            {loading && (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                color: '#007bff'
              }}>
                <span>⏳ Loading template...</span>
              </div>
            )}

            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeeba',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#856404'
            }}>
              <strong>📌 Note:</strong> All templates will use the email address above as recipient.
              Make sure to verify all fields before sending.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailTemplate;