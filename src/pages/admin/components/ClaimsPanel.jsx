import React from "react";

function ClaimsPanel({ claims }) {
  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 18 }}>
      <h4>Recent Claims</h4>
      {claims.map(claim =>
        <div key={claim.id} style={{
          display: "flex", alignItems: "center", gap: 14,
          marginBottom: 8, background: "#F8FAFC", padding: 7,
          borderRadius: 6
        }}>
          <img src={claim.avatarUrl} alt={claim.name} style={{ width: 28, borderRadius: "50%", border: "2px solid #E4EAFA" }} />
          <span style={{ fontWeight: "bold", fontSize: 14 }}>{claim.name}</span>
          <span style={{ fontSize: 12, color: "#789" }}>{claim.claimId}</span>
        </div>
      )}
    </div>
  );
}

export {
  ClaimsPanel
}