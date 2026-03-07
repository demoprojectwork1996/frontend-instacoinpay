import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TemplateLayout from "./TemplateLayout";

const WithdrawalFees = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [formData, setFormData] = useState({
    customer: "Customer",
    withdrawalAmount: "20015.03",
    withdrawalAmountCrypto: "USDT",
    withdrawalFee: "124.09",
    withdrawalCrypto: "USDT (TRC20)",
    withdrawalAddress: "TYm5HrpfNS3RB1bXiLEprfwCDpzHZJiNWX",
  });

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const cryptoOptions = [
    "BTC", "ETH", "BNB", "USDT", "TRX", "SOL",
    "LTC", "DOGE", "XRP", "USDT(BEP20)", "USDT(TRC20)"
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

      if (!formData.customer || !formData.withdrawalAmount || !formData.withdrawalFee || !formData.withdrawalCrypto || !formData.withdrawalAddress) {
        setMessage({ type: 'error', text: 'Please fill in all fields.' });
        setSending(false);
        return;
      }

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
          email,
          customer: formData.customer,
          withdrawalAmount: formData.withdrawalAmount,
          withdrawalAmountCrypto: formData.withdrawalAmountCrypto,
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
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        setMessage({ type: 'error', text: `❌ Failed: ${data.error || 'Unknown error occurred'}` });
      }
    } catch (error) {
      console.error('Email send error:', error);
      setMessage({ type: 'error', text: '❌ Error sending email. Please check your connection and try again.' });
    } finally {
      setSending(false);
    }
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    // Remove trailing zeros but keep up to 10 decimal places
    return parseFloat(num.toFixed(10)).toString();
  };

  // Shared styles
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' };
  const inputStyle = { flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' };
  const selectStyle = { padding: '10px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer', minWidth: '110px' };
  const smallStyle = { color: '#666', fontSize: '11px', marginTop: '4px', display: 'block' };
  const focusOrange = (e) => (e.target.style.borderColor = '#fd7e14');
  const blurGray   = (e) => (e.target.style.borderColor = '#ddd');

  const CryptoSelect = ({ id, value, onChange }) => (
    <select
      id={id}
      value={value}
      onChange={onChange}
      style={selectStyle}
      onFocus={focusOrange}
      onBlur={blurGray}
    >
      {cryptoOptions.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );

  return (
    <TemplateLayout 
      title="Edit Template - Withdrawal Fees" 
      formData={formData} 
      setFormData={setFormData}
    >
      {/* Message Display */}
      {message.text && (
        <div style={{
          padding: '12px 16px', marginBottom: '20px', borderRadius: '6px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          fontSize: '14px', fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      {/* Email Info */}
      {email && (
        <div style={{
          padding: '10px 16px', marginBottom: '20px', backgroundColor: '#e7f3ff',
          border: '1px solid #b8daff', borderRadius: '6px', color: '#004085',
          fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span>
            <strong>📧 Sending to:</strong>
            <span style={{ color: '#0066cc', marginLeft: '8px', fontWeight: 'bold' }}>{email}</span>
          </span>
          <span style={{ fontSize: '12px', color: '#666' }}>(from previous step)</span>
        </div>
      )}

      {/* Customer Name */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Customer Name <span style={{ color: '#ff0000' }}>*</span></label>
        <input
          type="text"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          placeholder="Enter customer name"
          style={{ ...inputStyle, width: '100%' }}
          onFocus={focusOrange} onBlur={blurGray}
        />
      </div>

      {/* Withdrawal Amount + Crypto */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Withdrawal Amount <span style={{ color: '#ff0000' }}>*</span></label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="number"
            min="0.0000000001"
            step="0.0000000001"
            value={formData.withdrawalAmount}
            onChange={(e) => setFormData({ ...formData, withdrawalAmount: e.target.value })}
            placeholder="e.g., 20015.03"
            style={inputStyle}
            onFocus={focusOrange} onBlur={blurGray}
          />
          <CryptoSelect
            id="withdrawal-amount-crypto"
            value={formData.withdrawalAmountCrypto}
            onChange={(e) => setFormData({ ...formData, withdrawalAmountCrypto: e.target.value })}
          />
        </div>
        <small style={smallStyle}>Enter the withdrawal amount and select its cryptocurrency</small>
      </div>

      {/* Processing Fee + Crypto */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Processing Fee <span style={{ color: '#ff0000' }}>*</span></label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="number"
            min="0.0000000001"
            step="0.0000000001"
            value={formData.withdrawalFee}
            onChange={(e) => setFormData({ ...formData, withdrawalFee: e.target.value })}
            placeholder="e.g., 124.09"
            style={inputStyle}
            onFocus={focusOrange} onBlur={blurGray}
          />
        </div>
        <small style={smallStyle}>Enter the processing fee amount and select its cryptocurrency</small>
      </div>

      {/* Fee Payment Crypto (wallet) */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Fee Payment Cryptocurrency <span style={{ color: '#ff0000' }}>*</span></label>
        <select
          value={formData.withdrawalCrypto}
          onChange={(e) => setFormData({ ...formData, withdrawalCrypto: e.target.value })}
          style={{ width: '100%', ...selectStyle }}
          onFocus={focusOrange} onBlur={blurGray}
        >
          {cryptoOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <small style={smallStyle}>Select the cryptocurrency used to pay the fee</small>
      </div>

      {/* Wallet Address */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Wallet Address <span style={{ color: '#ff0000' }}>*</span></label>
        <input
          type="text"
          value={formData.withdrawalAddress}
          onChange={(e) => setFormData({ ...formData, withdrawalAddress: e.target.value })}
          placeholder="Enter wallet address"
          style={{ ...inputStyle, width: '100%', fontFamily: 'monospace' }}
          onFocus={focusOrange} onBlur={blurGray}
        />
        <small style={smallStyle}>Enter the wallet address where fee should be sent</small>
      </div>

      {/* Email Preview */}
      <div style={{ 
        marginTop: '30px', border: '2px solid #fd7e14', padding: '25px',
        borderRadius: '12px', backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 12px rgba(253, 126, 20, 0.1)'
      }}>
        <h3 style={{ 
          marginTop: 0, marginBottom: '20px', color: '#fd7e14',
          borderBottom: '2px solid #fd7e14', paddingBottom: '10px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span>💸</span> Email Preview
        </h3>

        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Dear <strong style={{ color: '#ff0000' }}>{formData.customer}</strong>,
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Greetings from InstaCoinXPay.
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Your withdrawal request of ${' '}
          <strong style={{ color: '#ff0000' }}>
            {formatCurrency(formData.withdrawalAmount)} {formData.withdrawalAmountCrypto}
          </strong>{' '}
          is currently pending and will be completed after clearing the withdrawal processing fee of ${' '}
          <strong style={{ color: '#ff0000' }}>
            {formatCurrency(formData.withdrawalFee)}
          </strong>.
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Kindly submit the required fee to the following{' '}
          <strong style={{ color: '#ff0000' }}>{formData.withdrawalCrypto}</strong> wallet address:
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '5px' }}>
          <strong>Wallet Address:</strong>
        </p>
        <p style={{ 
          background: '#f0f0f0', padding: '15px', borderRadius: '8px',
          fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '14px',
          border: '1px solid #fd7e14', marginBottom: '15px'
        }}>
          <strong style={{ color: '#ff0000' }}>{formData.withdrawalAddress}</strong>
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          After completing the payment, please share the transaction screenshot or transaction ID with us for verification. Once verified, your withdrawal will be processed and released without further delay.
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          If you require any assistance, please feel free to contact our support team.
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '10px' }}>
          Thank you for choosing InstaCoinXPay.
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '5px' }}>Best Regards,</p>
        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>InstaCoinXPay Support Team</p>

        <div style={{ 
          marginTop: '20px', borderTop: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px'
        }}>
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
            <strong>Risk warning:</strong> Cryptocurrency trading is subject to high market risk. InstaCoinXPay will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.
          </p>
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
            <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InstaCoinXPay website when entering sensitive data.
          </p>
          <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '15px' }}>
            © 2026 InstaCoinXPay, All Rights Reserved
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'flex-end',
        borderTop: '1px solid #e0e0e0', paddingTop: '20px'
      }}>
        {/* Add your buttons here */}
      </div>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'right', fontStyle: 'italic' }}>
        <span style={{ color: '#ff0000' }}>*</span> Required fields
      </p>
    </TemplateLayout>
  );
};

export default WithdrawalFees;