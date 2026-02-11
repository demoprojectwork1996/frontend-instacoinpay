import React from "react";
import "./AdminPanel.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "User details", path: "/userdetail" },
    { name: "Balance Control", path: "/adwalletApp" },
    { name: "Payment address change", path: "/deposit-wallet" },
    { name: "Card Activation", path: "/adcardactivation" },
    { name: "Support", path: "/adminsupport" },
    { name: "Report", path: "/adminreport" },
    { name: "History", path: "/Adminhistory" },
    { name: "User Account create", path: "/adminaccountcreate" },
    { name: "Bulk Credit/Debit", path: "/adbulktransaction" },
    { name: "All Bulk Credit/Debit", path: "/adminallbulk" },
    { name: "Card activated and pending users list", path: "/admincardusers" },
    { name: "Transaction Status", path: "/admintransactionstatus" },
     { name: "Change Group Status", path: "/managegroups" },
  ];

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        {/* Header */}
        <div className="admin-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <FaArrowLeft className="back-icon" />
          </button>
          <h2>Admin Panel</h2>
        </div>

        {/* Buttons */}
        <div className="admin-menu">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="admin-btn"
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
