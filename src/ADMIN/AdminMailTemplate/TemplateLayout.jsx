import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./MailTemplate.css";

const TemplateLayout = ({ title, children, formData, setFormData, handleSend }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPreview, setShowPreview] = useState(false);
  const email = location.state?.email || "";

  const handleBack = () => {
    // Navigate back to the main MailTemplate page
    navigate('/admin-mail', { state: { email } });
  };

  return (
    <div className="tl-mail-wrapper">
      <div className="tl-mail-card">
        <div className="tl-mail-header">
          <button className="tl-back-btn" onClick={handleBack}>
            <FaArrowLeft />
          </button>
          <h2>{title}</h2>
        </div>

        <div className="tl-template-editor">
          {children}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="tl-send-btn"
              style={{ background: "#6c757d" }}
              onClick={() => setShowPreview(true)}
            >
              Preview
            </button>
            <button className="tl-send-btn" onClick={handleSend}>
              Send Mail
            </button>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="tl-preview-modal">
            <div className="tl-preview-box">
              <div className="tl-preview-header">
                <h3>Email Preview</h3>
                <button onClick={() => setShowPreview(false)} className="tl-close-btn">
                  X
                </button>
              </div>
              <div className="tl-preview-body">
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateLayout;