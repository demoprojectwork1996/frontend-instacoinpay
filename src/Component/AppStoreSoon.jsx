import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AppStoreSoon.css';
import logo from '../assets/logo.png';
import appStoreBadge from '../assets/app-store-badge.png';

export default function AppStoreSoon() {
  const navigate = useNavigate();

  return (
    <div className="appstore-soon-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Main Content */}
      <div className="appstore-content">
        {/* Logo */}
        <div className="appstore-logo">
          <img src={logo} alt="InstaCoinXPay" />
        </div>

        {/* App Store Badge */}
        <div className="appstore-badge-container">
          <img src={appStoreBadge} alt="App Store" className="appstore-badge-img" />
        </div>

        {/* Main Heading */}
        <h1 className="appstore-title">
          We're Working to Reach You
          <br />
          <span className="highlight">on the App Store</span>
        </h1>

        {/* Description */}
        <p className="appstore-description">
          InstaCoinXPay is coming to iOS soon! We're putting the final touches on our App Store version 
          to bring you the best crypto trading experience on your iPhone and iPad.
        </p>

        {/* Features List */}
        <div className="appstore-features">
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Secure & Fast Transactions</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span>Bank-Level Security</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14H11L11 21L20 10L13 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Lightning-Fast Processing</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>24/7 Support</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-section">
          <div className="progress-label">Development Progress</div>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="progress-percentage">85% Complete</div>
        </div>

        {/* Notify Me Section */}
        <div className="notify-section">
          <h3>Get Notified When We Launch</h3>
          <div className="notify-form">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="notify-input"
            />
            <button className="notify-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Notify Me
            </button>
          </div>
        </div>

        {/* Available Now Section */}
        <div className="available-now">
          <p>Available now on Android:</p>
          <button 
            className="google-play-link"
            onClick={() => navigate('/instaplaystore')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.609 1.814L13.792 12L3.61 22.186C3.218 21.867 3 21.377 3 20.809V3.191C3 2.623 3.218 2.133 3.609 1.814Z" fill="currentColor"/>
              <path d="M14.5 12.707L4.793 22.414L14.5 17.293L19.621 14.732C20.121 14.482 20.5 13.982 20.5 13.5C20.5 13.018 20.207 12.518 19.621 12.268L14.5 9.707V12.707Z" fill="currentColor"/>
              <path d="M4.793 1.586L14.5 11.293V6.707L9.379 4.146C8.879 3.896 8.293 3.793 7.707 3.793L4.793 1.586Z" fill="currentColor"/>
            </svg>
            Get it on Google Play
          </button>
        </div>

        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </button>
      </div>

      {/* Floating Particles */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </div>
  );
}