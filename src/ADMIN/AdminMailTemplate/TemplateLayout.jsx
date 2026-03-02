import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaEye, FaPaperPlane, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./MailTemplate.css";

const TemplateLayout = ({ title, children, formData, setFormData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState({ email: '', template: '' });
  const email = location.state?.email || "";

  // 👇 IMPORTANT: Set your backend URL
  const BASE_URL = 'https://backend-instacoinpay-1.onrender.com'; // Your backend port

  const handleBack = () => {
    navigate('/admin-mail', { state: { email } });
  };

  const validateFormData = () => {
    for (const [key, value] of Object.entries(formData)) {
      if (!value || value.toString().trim() === '') {
        setMessage({ 
          type: 'error', 
          text: `❌ Please fill in all fields. "${key}" is required.` 
        });
        return false;
      }
    }
    return true;
  };

  const handleSend = async () => {
    try {
      if (!validateFormData()) {
        return;
      }

      if (!email) {
        setMessage({ type: 'error', text: '❌ Recipient email not found. Please go back and enter an email.' });
        return;
      }

      setSending(true);
      setMessage({ type: 'info', text: '📧 Sending email...' });
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: '❌ Authentication token not found. Please login again.' });
        setSending(false);
        return;
      }

      // Determine which API endpoint to use
      let endpoint = '';
      const templateType = window.location.pathname.split('/').pop();
      
      switch(templateType) {
        case 'card-activation':
          endpoint = `${BASE_URL}/api/admin/mail/card-activation`;
          break;
        case 'card-activated':
          endpoint = `${BASE_URL}/api/admin/mail/card-activated`;
          break;
        case 'due-fees':
          endpoint = `${BASE_URL}/api/admin/mail/due-fees`;
          break;
        case 'withdrawal-fees':
          endpoint = `${BASE_URL}/api/admin/mail/withdrawal-fees`;
          break;
        case 'trustwallet':
          endpoint = `${BASE_URL}/api/admin/mail/trustwallet-rejection`;
          break;
        default:
          setMessage({ type: 'error', text: '❌ Unknown template type' });
          setSending(false);
          return;
      }

      console.log('📤 Sending to:', endpoint); // Debug log
      console.log('📦 Payload:', { email, ...formData }); // Debug log
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          ...formData
        })
      });

      console.log('📥 Response status:', response.status); // Debug log

      // Check if response is OK
      if (!response.ok) {
        const text = await response.text();
        console.error('❌ Error response:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSending(false);
      
      if (data.success) {
        // Set success data for popup
        setSuccessData({
          email: email,
          template: data.template || getTemplateName(templateType)
        });
        setShowSuccessPopup(true);
        
        setMessage({ 
          type: 'success', 
          text: `✅ ${data.template || 'Email'} sent successfully to ${email}` 
        });
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 5000);
      } else {
        setMessage({ type: 'error', text: `❌ Failed: ${data.error || 'Unknown error occurred'}` });
      }
    } catch (error) {
      setSending(false);
      setMessage({ 
        type: 'error', 
        text: '❌ Error sending email. Make sure backend is running on port 5000.' 
      });
      console.error('❌ Email send error:', error);
    }
  };

  const getTemplateName = (type) => {
    const templates = {
      'card-activation': 'Card Activation',
      'card-activated': 'Card Activated',
      'due-fees': 'Due Fees',
      'withdrawal-fees': 'Withdrawal Fees',
      'trustwallet': 'Trustwallet Rejection'
    };
    return templates[type] || 'Email';
  };

  const getTemplateIcon = () => {
    const templateType = window.location.pathname.split('/').pop();
    switch(templateType) {
      case 'card-activation': return '💳';
      case 'card-activated': return '✅';
      case 'due-fees': return '💰';
      case 'withdrawal-fees': return '💸';
      case 'trustwallet': return '🔐';
      default: return '📧';
    }
  };

  return (
    <div className="tl-mail-wrapper">
      <div className="tl-mail-card">
        <div className="tl-mail-header">
          <button className="tl-back-btn" onClick={handleBack} title="Go back">
            <FaArrowLeft />
          </button>
          <h2>
            <span style={{ marginRight: '10px' }}>{getTemplateIcon()}</span>
            {title}
          </h2>
        </div>

        {/* Email Info Banner */}
        {email && (
          <div style={{
            backgroundColor: '#e7f3ff',
            border: '1px solid #b8daff',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>
              <strong>📧 Sending to:</strong> 
              <span style={{ color: '#0066cc', marginLeft: '8px', fontWeight: 'bold' }}>{email}</span>
            </span>
            <button
              onClick={handleBack}
              style={{
                background: '#0066cc',
                border: 'none',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Change
            </button>
          </div>
        )}

        {/* Message Display */}
        {message.text && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 
              message.type === 'success' ? '#d4edda' : 
              message.type === 'error' ? '#f8d7da' : 
              '#fff3cd',
            color: 
              message.type === 'success' ? '#155724' : 
              message.type === 'error' ? '#721c24' : 
              '#856404',
            border: 
              message.type === 'success' ? '1px solid #c3e6cb' : 
              message.type === 'error' ? '1px solid #f5c6cb' : 
              '1px solid #ffeeba',
          }}>
            {message.type === 'success' && <FaCheckCircle />}
            {message.type === 'error' && <FaTimesCircle />}
            {message.type === 'info' && <span>⏳</span>}
            {message.text}
          </div>
        )}

        <div className="tl-template-editor">
          {children}

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
              onClick={() => setShowPreview(true)}
              style={{ 
                background: "#6c757d",
                padding: "12px 24px",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "15px",
                cursor: "pointer",
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaEye /> Preview
            </button>
            
            <button 
              className="tl-send-btn" 
              onClick={handleSend}
              disabled={sending}
              style={{ 
                background: sending ? "#6c757d" : "#28a745",
                padding: "12px 32px",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: sending ? "not-allowed" : "pointer",
                opacity: sending ? 0.7 : 1,
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
                  <FaPaperPlane />
                  Send Mail
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="tl-preview-modal" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="tl-preview-box" style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div className="tl-preview-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 20px',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#f8f9fa'
              }}>
                <h3 style={{ margin: 0 }}>Email Preview</h3>
                <button 
                  onClick={() => setShowPreview(false)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              <div className="tl-preview-body" style={{ padding: '20px' }}>
                {children}
              </div>
            </div>
          </div>
        )}

        {/* Success Popup Modal */}
        {showSuccessPopup && (
          <div className="tl-success-popup-modal" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            animation: 'fadeIn 0.3s ease'
          }}>
            <div className="tl-success-popup" style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '450px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              animation: 'slideUp 0.3s ease'
            }}>
              <div className="tl-success-popup-header" style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                padding: '25px 20px',
                borderRadius: '12px 12px 0 0',
                textAlign: 'center',
                color: 'white'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  fontSize: '35px'
                }}>
                  <FaCheckCircle style={{ fontSize: '40px' }} />
                </div>
                <h3 style={{ margin: '0 0 5px', fontSize: '24px' }}>Email Sent Successfully!</h3>
                <p style={{ margin: '0', opacity: '0.9', fontSize: '15px' }}>
                  Your email has been delivered
                </p>
              </div>
              
              <div className="tl-success-popup-body" style={{
                padding: '25px',
                textAlign: 'center'
              }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '5px' }}>
                      Template
                    </span>
                    <strong style={{ fontSize: '18px', color: '#333' }}>
                      {successData.template}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '5px' }}>
                      Recipient Email
                    </span>
                    <strong style={{ fontSize: '16px', color: '#28a745', wordBreak: 'break-all' }}>
                      {successData.email}
                    </strong>
                  </div>
                </div>
                
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                  The email has been sent and should arrive in the recipient's inbox shortly.
                </p>
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowSuccessPopup(false)}
                    style={{
                      background: '#28a745',
                      border: 'none',
                      color: 'white',
                      padding: '12px 30px',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#218838'}
                    onMouseLeave={(e) => e.target.style.background = '#28a745'}
                  >
                    OK
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessPopup(false);
                      handleBack();
                    }}
                    style={{
                      background: '#6c757d',
                      border: 'none',
                      color: 'white',
                      padding: '12px ',
                      borderRadius: '6px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#5a6268'}
                    onMouseLeave={(e) => e.target.style.background = '#6c757d'}
                  >
                    Back to Templates
                  </button>
                </div>
              </div>
              
              <div className="tl-success-popup-footer" style={{
                padding: '15px 20px',
                borderTop: '1px solid #e0e0e0',
                textAlign: 'center',
                fontSize: '12px',
                color: '#999'
              }}>
                <span>✨ Email sent via InstaCoinXPay Mail Service</span>
              </div>
            </div>
          </div>
        )}

        {/* CSS Animations */}
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default TemplateLayout;