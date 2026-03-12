import React from "react";

const Sidebar = ({
  D,
  gender,
  setGender,
  count,
  setCount,
  COUNTS = [],
  randomMode,
  setRandomMode,
  country,
  setCountry,
  nameData,
  setShowDropdown,
  showDropdown,
  search,
  setSearch,
  region,
  setRegion,
  REGIONS = [],
  countries = [],
  doGenerate,
  names = [],
}) => {
  if (!D || !nameData) return null;

  // Shared button style helper
  const btnStyle = (isActive) => ({
    flex: 1,
    padding: "12px 4px",
    borderRadius: 12,
    border: "1.5px solid",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    borderColor: isActive ? D.accent : D.cardBorder,
    background: isActive ? D.accentBg : D.inputBg,
    color: isActive ? D.accent : D.muted,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  });

  return (
    <div
      style={{
        position: "sticky",
        top: 80,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Main Control Card */}
      <div
        style={{
          background: D.card,
          border: `1px solid ${D.cardBorder}`,
          borderRadius: 24,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* Gender */}
        <div>
          <label
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: D.muted,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 12,
              display: "block",
            }}
          >
            Gender
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              ["male", "♂ Male"],
              ["female", "♀ Female"],
              ["both", "⚥ Both"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setGender(v)}
                style={btnStyle(gender === v)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: D.muted,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 12,
              display: "block",
            }}
          >
            Quantity
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                style={btnStyle(count === n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Country Mode (Pick vs Random) */}
        <div>
          <label
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: D.muted,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 12,
              display: "block",
            }}
          >
            Country Mode
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setRandomMode(false)}
              style={btnStyle(!randomMode)}
            >
              📌 Pick
            </button>
            <button
              onClick={() => setRandomMode(true)}
              style={btnStyle(randomMode)}
            >
              🎲 Random
            </button>
          </div>
        </div>

        {/* Country & Region Selection */}
        {!randomMode && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 900,
                color: D.muted,
                textTransform: "uppercase",
                letterSpacing: "1px",
                display: "block",
              }}
            >
              Country
            </label>

            {/* Region Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: "1px solid",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    borderColor: region === r ? D.accent : D.cardBorder,
                    background: region === r ? D.accentBg : "transparent",
                    color: region === r ? D.accent : D.muted,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Custom Dropdown */}
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  background: D.inputBg,
                  border: `1.5px solid ${D.cardBorder}`,
                  borderRadius: 12,
                  padding: "12px 16px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <span>
                  {nameData[country]?.flag} {country}
                </span>
                <span style={{ fontSize: 10 }}>▼</span>
              </div>

              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    right: 0,
                    background: D.card,
                    border: `1px solid ${D.cardBorder}`,
                    borderRadius: 16,
                    zIndex: 1000,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: 10,
                      borderBottom: `1px solid ${D.divider}`,
                    }}
                  >
                    <input
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search country..."
                      style={{
                        width: "100%",
                        background: D.inputBg,
                        border: "none",
                        padding: 8,
                        color: D.text,
                        outline: "none",
                        fontSize: 13,
                      }}
                    />
                  </div>
                  <div style={{ maxHeight: 200, overflowY: "auto" }}>
                    {countries.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          setCountry(c);
                          setShowDropdown(false);
                        }}
                        style={{
                          padding: "12px 16px",
                          cursor: "pointer",
                          fontSize: 13,
                          background:
                            country === c ? D.accentBg : "transparent",
                          color: country === c ? D.accent : D.text,
                        }}
                      >
                        {nameData[c].flag} {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={doGenerate}
          style={{
            background: `linear-gradient(135deg, ${D.accent}, #a855f7)`,
            color: "#fff",
            border: "none",
            padding: "16px",
            borderRadius: 16,
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          ✦ Generate Names
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            background: D.card,
            border: `1px solid ${D.cardBorder}`,
            borderRadius: 20,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 8 }}>🌍</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>
            {Object.keys(nameData).length}
          </div>
          <div style={{ fontSize: 11, color: D.muted, fontWeight: 700 }}>
            Countries
          </div>
        </div>
        <div
          style={{
            background: D.card,
            border: `1px solid ${D.cardBorder}`,
            borderRadius: 20,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{names.length}</div>
          <div style={{ fontSize: 11, color: D.muted, fontWeight: 700 }}>
            Generated
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
