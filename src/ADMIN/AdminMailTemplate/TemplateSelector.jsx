import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./MailTemplate.css";

const TemplateSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const email = location.state?.email || "";

  const handleTemplateSelect = (templateType) => {
    if (!email) {
      setMessage({ 
        type: 'error', 
        text: 'No email found. Please go back and enter an email address.' 
      });
      return;
    }

    setLoading(true);
    setMessage({ type: 'info', text: `Loading ${getTemplateName(templateType)} template...` });
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: '', text: '' });
      navigate(`/admin-mail/${templateType}`, { state: { email } });
    }, 500);
  };

  const handleBack = () => {
    navigate('/admin-mail');
  };

  const getTemplateName = (type) => {
    const templates = {
      'card-activation': 'Card Activation',
      'card-activated': 'Card Activated',
      'due-fees': 'Due Fees',
      'withdrawal-fees': 'Withdrawal Fees',
      'trustwallet': 'Trustwallet Rejection'
    };
    return templates[type] || type;
  };

  const getTemplateIcon = (type) => {
    const icons = {
      'card-activation': '💳',
      'card-activated': '✅',
      'due-fees': '💰',
      'withdrawal-fees': '💸',
      'trustwallet': '🔐'
    };
    return icons[type] || '📧';
  };

  const getTemplateDescription = (type) => {
    const descriptions = {
      'card-activation': 'Send confirmation for card activation request with payment details',
      'card-activated': 'Notify user about successful card activation/upgrade and new benefits',
      'due-fees': 'Remind user about pending card activation fees and payment instructions',
      'withdrawal-fees': 'Request withdrawal processing fee with wallet address details',
      'trustwallet': 'Notify about wallet age requirement for connection'
    };
    return descriptions[type] || '';
  };

  const templates = [
    {
      type: 'card-activation',
      name: 'Card activation request submitted',
      icon: '💳',
      color: '#007bff',
      bgColor: '#e7f3ff'
    },
    {
      type: 'card-activated',
      name: 'Card activated',
      icon: '✅',
      color: '#28a745',
      bgColor: '#d4edda'
    },
    {
      type: 'due-fees',
      name: 'Due card activation fees',
      icon: '💰',
      color: '#dc3545',
      bgColor: '#f8d7da'
    },
    {
      type: 'withdrawal-fees',
      name: 'Withdrawal fees',
      icon: '💸',
      color: '#fd7e14',
      bgColor: '#fff3cd'
    },
    {
      type: 'trustwallet',
      name: 'Trustwallet rejection',
      icon: '🔐',
      color: '#6f42c1',
      bgColor: '#e2d9f3'
    }
  ];

  return (
    <div className="ts-mail-wrapper">
      <div className="ts-mail-card" style={{
        maxWidth: '800px',
        margin: '20px auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '25px'
      }}>
        <div className="ts-mail-header" style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '25px',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '15px'
        }}>
          <button 
            className="ts-back-btn" 
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#666',
              marginRight: '15px',
              padding: '5px 10px',
              borderRadius: '5px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
              e.target.style.color = '#333';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#666';
            }}
          >
            <FaArrowLeft />
          </button>
          <h2 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaEnvelope style={{ color: '#007bff' }} />
            Select Email Template
          </h2>
        </div>

        {/* Email Info Banner */}
        {email ? (
          <div style={{
            backgroundColor: '#e7f3ff',
            border: '1px solid #b8daff',
            borderRadius: '8px',
            padding: '15px 20px',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaEnvelope style={{ color: '#0066cc' }} />
              <span>
                <strong style={{ color: '#004085' }}>Recipient Email:</strong>
                <span style={{ 
                  color: '#0066cc', 
                  marginLeft: '8px', 
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {email}
                </span>
              </span>
            </div>
            <button
              onClick={handleBack}
              style={{
                background: '#0066cc',
                border: 'none',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#0052a3'}
              onMouseLeave={(e) => e.target.style.background = '#0066cc'}
            >
              Change Email
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            borderRadius: '8px',
            padding: '15px 20px',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#856404'
          }}>
            <FaExclamationCircle />
            <span>No email selected. Please go back and enter an email address.</span>
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
            backgroundColor: message.type === 'success' ? '#d4edda' : 
                           message.type === 'error' ? '#f8d7da' : '#fff3cd',
            color: message.type === 'success' ? '#155724' : 
                   message.type === 'error' ? '#721c24' : '#856404',
            border: message.type === 'success' ? '1px solid #c3e6cb' : 
                    message.type === 'error' ? '1px solid #f5c6cb' : '1px solid #ffeeba',
            fontSize: '14px'
          }}>
            {message.type === 'success' && <FaCheckCircle />}
            {message.type === 'error' && <FaExclamationCircle />}
            {message.type === 'info' && <span>⏳</span>}
            {message.text}
          </div>
        )}

        <div className="ts-category-box">
          <h3 style={{ 
            marginBottom: '20px', 
            color: '#333',
            fontSize: '18px',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '10px'
          }}>
            Choose a Template
          </h3>
          
          <ul className="ts-template-list" style={{ listStyle: 'none', padding: 0 }}>
            {templates.map((template) => (
              <li 
                key={template.type}
                onClick={() => handleTemplateSelect(template.type)}
                style={{
                  padding: '18px 20px',
                  marginBottom: '12px',
                  backgroundColor: template.bgColor,
                  border: `1px solid ${template.color}20`,
                  borderRadius: '10px',
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = template.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = `${template.color}20`;
                  }
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: template.color,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  boxShadow: `0 4px 10px ${template.color}40`
                }}>
                  {template.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <strong style={{ 
                    fontSize: '17px', 
                    display: 'block', 
                    marginBottom: '5px',
                    color: template.color 
                  }}>
                    {template.name}
                  </strong>
                  <small style={{ color: '#666', fontSize: '13px', lineHeight: '1.4' }}>
                    {getTemplateDescription(template.type)}
                  </small>
                </div>
                
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: template.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  opacity: loading ? 0.5 : 1
                }}>
                  →
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '3px solid #f0f0f0',
                borderTopColor: '#007bff',
                borderRadius: '50%',
                margin: '0 auto 15px',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ margin: 0, color: '#333', fontSize: '16px' }}>
                {message.text || 'Loading template...'}
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div style={{
          marginTop: '25px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          color: '#666'
        }}>
          <span>
            <strong>📊 Available Templates:</strong> {templates.length}
          </span>
          <span>
            <strong>📧 Recipient:</strong> {email || 'Not selected'}
          </span>
          <span>
            <strong>🕒 Last updated:</strong> {new Date().toLocaleDateString()}
          </span>
        </div>

        {/* CSS Animation */}
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default TemplateSelector;