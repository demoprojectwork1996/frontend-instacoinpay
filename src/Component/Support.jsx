import React, { useState } from "react";
import axios from "axios";
import "./Support.css";
import logo from "../assets/logo.png";

const Support = () => {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // IMAGE PREVIEW ONLY
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("https://backend-instacoinpay-1.onrender.com/api/support", formData);

      setMessage("✅ Support ticket submitted successfully");
      setFormData({ email: "", subject: "", description: "" });
      setPreview(null);
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-page">
      <header className="help-header">
        <div className="help-logo">
          <img src={logo} alt="help-logo" />
        </div>
        <h1>SUPPORT</h1>
      </header>

      <div className="help-card">
        <form onSubmit={handleSubmit}>
          <div className="help-form-group">
            <label>Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="help-form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="help-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* OPTIONAL IMAGE PREVIEW */}
          <div className="help-form-group">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="preview" className="preview-img" />}
          </div>

          <button className="help-submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>

          {message && <p className="help-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Support;
