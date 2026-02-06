import React from 'react';
import './InstaPlaystore.css';
import logo from '../assets/logo-head-removebg-preview.png';
import screenshot1 from '../assets/screenshot1.png';
import screenshot2 from '../assets/screenshot2.png';
import screenshot3 from '../assets/screenshot3.png';
import { useNavigate } from "react-router-dom";



export default function InstaPlaystore() {
  const navigate = useNavigate();
  return (
    <div className="playstore-container">
      <span className=" instaplaystore-back" onClick={() => navigate('/')}>←</span>
      {/* Header */}
      <div className="app-header">
        <img src={logo} alt="InstaCoinXpay logo" className="app-icon" />
        <div className="app-info">
          <h1 className="app-name">InstaCoinXpay</h1>
          <p className="app-developer">InstaCoinX Global Ltd</p>
          <p className="app-meta">Contains ads · In-app purchases</p>
        </div>
      </div>
      

      {/* Stats */}
      <div className="app-stats">
        <div className="stat-item">
          <div className="stat-value">4.8★</div>
          <div className="stat-label">12K reviews</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-value">973K+</div>
          <div className="stat-label">Downloads</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-value">
            <span className="pegi-badge">PEGI 3</span>
          </div>
          <div className="stat-label">Rated for 3+</div>
        </div>
      </div>

      {/* Install Button */}
     <a
  href="/apk/InstaCoinXpay.apk"
  download
  className="install-btn"
>
  Install
</a>

      {/* Screenshots */}
      <div className="screenshots">
        <img src={screenshot1} alt="App screenshot 1" className="screenshot-img" />
        <img src={screenshot2} alt="App screenshot 2" className="screenshot-img" />
        <img src={screenshot3} alt="App screenshot 3" className="screenshot-img" />
      </div>

      {/* About Section */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">About this app</h2>
          <span className="section-arrow">→</span>
        </div>
        <p className="about-text">
          Experience the next generation of mobile finance with InstaCoinXpay. Built for speed, security, and simplicity. Manage your Crypto wallet, send funds instantly, and stay in full control of your digital assets.
        </p>
        <div className="tags">
          <span className="tag">Finance</span>
          <span className="tag">Secure</span>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Ratings and reviews</h2>
          <span className="section-arrow">→</span>
        </div>
        <p className="ratings-disclaimer">
          Ratings and reviews are verified and are from people who use the same type of device that you use.
        </p>

        {/* Rating Overview */}
        <div className="rating-overview">
          <div className="rating-score">
            <div className="score-number">4.8</div>
            <div className="score-stars">★★★★★</div>
            <div className="score-count">12,431 reviews</div>
          </div>
          <div className="rating-bars">
            {[
              { star: 5, width: '85%' },
              { star: 4, width: '10%' },
              { star: 3, width: '2%' },
              { star: 2, width: '2%' },
              { star: 1, width: '1%' }
            ].map(({ star, width }) => (
              <div key={star} className="rating-bar-row">
                <span className="rating-star-num">{star}</span>
                <div className="rating-bar-bg">
                  <div className="rating-bar-fill" style={{width}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review */}
        <div className="review-card">
          <div className="review-header">
            <div className="reviewer-avatar">S</div>
            <div className="reviewer-name">Sarah Martin</div>
            <span className="review-menu">⋮</span>
          </div>
          <div className="review-stars">★★★★★</div>
          <div className="review-date">January 12, 2026</div>
          <p className="review-text">
            The UI is incredibly clean and transfers happen instantly. Best Crypto wallet app I've used so far.
          </p>
          <div className="review-helpful">
            Was this review helpful?
            <button className="helpful-btn">Yes</button>
            <button className="helpful-btn">No</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-updated">Updated on Jan 1, 2026</div>
        <div className="footer-category">FINANCE</div>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}