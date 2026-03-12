import React from "react";

const NameCard = ({ n, D, index, randomMode, copied, doCopy }) => {
  // Fallback to prevent crash if data isn't ready
  if (!n) return null;

  return (
    <div
      className="namecard"
      style={{
        background: D.card,
        border: `1px solid ${D.cardBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderRadius: "16px",
        transition: "all 0.2s",
        // Using n.first and n.last based on typical genName logic
        animation: `slideIn 0.4s ease forwards ${index * 0.03}s`,
        opacity: 0, // Starts invisible for the animation
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}
      >
        <div
          className="avatar"
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 18,
            flexShrink: 0,
            background: D.accentBg,
            color: D.accent,
          }}
        >
          {(n.firstName || n.first || "?")[0]}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: D.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {n.firstName || n.first}
          </div>
          <div
            style={{
              fontSize: 12,
              color: D.muted,
              fontWeight: 500,
              marginTop: 1,
            }}
          >
            {n.lastName || n.last}
          </div>
          {randomMode && (
            <div
              style={{
                fontSize: 10,
                color: D.accent,
                fontWeight: 800,
                marginTop: 3,
                letterSpacing: ".3px",
                textTransform: "uppercase",
              }}
            >
              {n.country}
            </div>
          )}
        </div>
      </div>

      <button
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          background: copied === n.id ? D.accentBg : "transparent",
          color: copied === n.id ? D.accent : D.muted,
        }}
        onClick={() => doCopy(n.full || `${n.first} ${n.last}`, n.id)}
      >
        {copied === n.id ? "✓" : "⎘"}
      </button>
    </div>
  );
};

export default NameCard;
