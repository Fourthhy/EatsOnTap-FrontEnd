import React from "react";

// This compoenent displays a list of recent claims
function ClaimsPanel({ claims }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, boxShadow: "0 2px 6px #e5eaf0",
      padding: 20, display: "flex", flexDirection: "column", width: 'auto', justifyContent: "center"
    }}>
      <div
        style={{ marginBottom: 20 }}
        className="w-full h-auto flex justify-between">
        <p
          style={{
            fontFamily: "geist",
            fontWeight: "500",
            color: "#000",
            fontSize: 15
          }}
        >Recent Claims</p>
        <p
          style={{
            fontFamily: "geist",
            fontWeight: "500",
            color: "#667085",
            fontSize: 11
          }}
        >Date today</p>
      </div>
      {claims.map(claim =>
        <div key={claim.id} style={{
          display: "flex",
          alignItems: "center", gap: 14,
          marginBottom: 13, background: "#dce0f980", padding: "10px 0px 10px 10px",
          borderRadius: 6
        }}>
          <img src={claim.avatarUrl} alt={claim.name} style={{ width: 28, borderRadius: "50%", border: "2px solid #E4EAFA" }} />
          <div className="w-full h-auto flex flex-col">
            <span style={{ fontWeight: "bold", fontSize: 14, fontFamily: "geist" }}>{claim.name}</span>
            <span style={{ fontSize: 12, color: "#667085", fontFamily: "geist" }}>{claim.cohort}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export {
  ClaimsPanel
}