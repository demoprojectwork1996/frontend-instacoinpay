import React from "react";

function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "#fff",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div>
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          We'll Be Back Soon
        </h1>

        <p style={{ fontSize: "22px", marginBottom: "10px" }}>
          Our platform is currently undergoing maintenance.
        </p>

        <p style={{ fontSize: "18px", opacity: 0.8 }}>
          We are working hard to improve your experience and will get back in
          service shortly.
        </p>

        <p style={{ marginTop: "30px", opacity: 0.6 }}>
          Thank you for your patience and understanding.
        </p>
      </div>
    </div>
  );
}

export default MaintenancePage;