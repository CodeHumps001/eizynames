import { useState, useCallback, useEffect, useMemo } from "react";
import { nameData } from "./data/nameData";
import { genName, copyText, fallbackCopy, pick } from "./utils/helpers";
import Sidebar from "./component/sidebar";
import NameCard from "./component/nameCard";

const COUNTS = [10, 20, 50, 100];
const REGIONS = [
  "All",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Middle East",
  "Oceania",
];
const ITEMS_PER_PAGE = 12;

export default function App() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [gender, setGender] = useState("both");
  const [count, setCount] = useState(50);
  const [country, setCountry] = useState("United Kingdom");
  const [randomMode, setRandomMode] = useState(false);
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [names, setNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Monitor scroll for the centered glass header effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const D = dark
    ? {
        bg: "#08090f",
        nav: "rgba(13, 15, 24, 0.85)",
        card: "#121421",
        cardBorder: "rgba(255,255,255,0.06)",
        text: "#f1f3f9",
        muted: "#7e839f",
        accent: "#8b5cf6",
        accentBg: "rgba(139, 92, 246, 0.15)",
        divider: "rgba(255,255,255,0.08)",
        pillBg: "#1a1d2e",
      }
    : {
        bg: "#f8faff",
        nav: "rgba(255, 255, 255, 0.8)",
        card: "#ffffff",
        cardBorder: "rgba(0,0,0,0.05)",
        text: "#0f172a",
        muted: "#64748b",
        accent: "#6366f1",
        accentBg: "rgba(99, 102, 241, 0.08)",
        divider: "rgba(0,0,0,0.06)",
        pillBg: "#e0e4f5",
      };

  const doGenerate = useCallback(() => {
    const list = Array.from({ length: count }, () => {
      const c = randomMode ? pick(Object.keys(nameData)) : country;
      const g = gender === "both" ? pick(["male", "female"]) : gender;
      return genName(c, g);
    });
    setNames(list);
    setCurrentPage(1);
  }, [count, randomMode, country, gender]);

  useEffect(() => {
    doGenerate();
  }, [doGenerate]);

  const totalPages = Math.ceil(names.length / ITEMS_PER_PAGE);
  const currentNames = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return names.slice(start, start + ITEMS_PER_PAGE);
  }, [names, currentPage]);

  const doCopy = (text, id) => {
    copyText(text, fallbackCopy);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const countries = Object.keys(nameData).filter((c) => {
    const matchRegion = region === "All" || nameData[c].region === region;
    const matchSearch = c.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  // ... inside your App function ...

  return (
    <div
      style={{
        minHeight: "100vh",
        background: D.bg,
        color: D.text,
        transition: "0.4s",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden", // Critical for mobile
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .namecard-anim { animation: slideIn 0.3s ease forwards; opacity: 0; }
        
        .glass-nav { 
          backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid ${scrolled ? D.divider : "transparent"};
          border-radius: ${scrolled ? "20px" : "0px"};
          width: ${scrolled ? "calc(100% - 24px)" : "100%"};
          max-width: 1200px;
          margin: ${scrolled ? "10px auto" : "0 auto"};
          position: sticky;
          top: ${scrolled ? "10px" : "0"};
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2);
          display: flex; justify-content: space-between; align-items: center;
          background: ${D.nav}; padding: 12px 20px;
        }

        /* Responsive Grid Logic */
        .app-layout { 
          display: grid; 
          grid-template-columns: 310px 1fr; 
          gap: 40px; 
          align-items: start; 
        }

        @media (max-width: 1024px) {
          .app-layout { grid-template-columns: 1fr; gap: 32px; }
          .hero-section { padding: 60px 20px 40px !important; }
          .glass-nav { padding: 10px 16px; }
        }

        @media (max-width: 600px) {
          .name-grid { grid-template-columns: 1fr !important; }
          .hero-h1 { fontSize: 32px !important; }
          .results-header { flex-direction: column; align-items: flex-start !important; gap: 16px; }
          .copy-all-btn { width: 100%; justify-content: center; }
          .pagination-wrap { flex-wrap: wrap; gap: 6px !important; }
          .footer-content { flex-direction: column; gap: 24px; text-align: center; }
        }

        .page-btn { padding: 10px 14px; border-radius: 10px; border: 1px solid ${D.cardBorder}; background: ${D.card}; color: ${D.text}; cursor: pointer; font-weight: 700; transition: 0.2s; font-size: 13px; }
        .page-btn.active { background: ${D.accent}; color: white; border-color: ${D.accent}; }
      `}</style>

      <nav className="glass-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Stylized Logo Mark */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${D.accent}, #ec4899)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              fontWeight: 900,
              boxShadow: `0 8px 16px -4px ${D.accent}60`,
              flexShrink: 0,
            }}
          >
            e
          </div>

          {/* Full Responsive Branding */}
          <span
            style={{
              fontWeight: 900,
              fontSize: scrolled ? 17 : 20,
              letterSpacing: "-0.8px",
              background: `linear-gradient(135deg, ${dark ? "#c084fc" : D.accent}, #f472b6)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transition: "0.3s ease",
              // On mobile scroll, we can show a shorter version if needed
              whiteSpace: "nowrap",
            }}
          >
            {scrolled ? "eizyName" : "eizyNameGenerator"}
          </span>
        </div>

        {/* Modernized Mode Toggle Switch */}
        <div
          onClick={() => setDark(!dark)}
          style={{
            width: 68,
            height: 34,
            background: dark ? "#1e2235" : "#eef2ff",
            borderRadius: 20,
            padding: 3,
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${D.cardBorder}`,
            transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Sliding Circular Knob */}
          <div
            style={{
              position: "absolute",
              left: dark ? 36 : 3,
              width: 28,
              height: 28,
              background: dark ? "#8b5cf6" : "#ffffff",
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            {dark ? "🌙" : "☀️"}
          </div>

          {/* Background Icons */}
          <span
            style={{ fontSize: 12, marginLeft: 8, opacity: dark ? 0 : 0.4 }}
          >
            ☀️
          </span>
          <span
            style={{ fontSize: 12, marginRight: 8, opacity: dark ? 0.4 : 0 }}
          >
            🌙
          </span>
        </div>
      </nav>

      <div
        className="hero-section"
        style={{ textAlign: "center", padding: "80px 24px 60px" }}
      >
        <div
          style={{
            display: "inline-flex",
            background: D.pillBg,
            padding: "5px 12px",
            borderRadius: 20,
            fontSize: 10,
            fontWeight: 800,
            color: D.accent,
            letterSpacing: 1,
            marginBottom: 18,
            textTransform: "uppercase",
          }}
        >
          ✦ Free • No Ads
        </div>
        <h1
          className="hero-h1"
          style={{
            fontSize: "48px",
            fontWeight: 900,
            marginBottom: 14,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
          }}
        >
          Generate Names
          <br />
          <span style={{ color: D.accent }}>From Any Country</span>
        </h1>
        <p
          style={{
            color: D.muted,
            maxWidth: 480,
            margin: "0 auto",
            fontSize: 15,
            lineHeight: 1.5,
          }}
        >
          Authentic first & last names from {Object.keys(nameData).length}{" "}
          countries.
        </p>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px 80px",
          width: "100%",
        }}
      >
        <div className="app-layout">
          <Sidebar
            D={D}
            gender={gender}
            setGender={setGender}
            count={count}
            setCount={setCount}
            COUNTS={COUNTS}
            randomMode={randomMode}
            setRandomMode={setRandomMode}
            country={country}
            setCountry={setCountry}
            nameData={nameData}
            setShowDropdown={setShowDropdown}
            showDropdown={showDropdown}
            search={search}
            setSearch={setSearch}
            region={region}
            setRegion={setRegion}
            REGIONS={REGIONS}
            countries={countries}
            doGenerate={doGenerate}
            names={names}
          />

          <div className="main-content">
            <div
              className="results-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 24,
                borderBottom: `1px solid ${D.divider}`,
                paddingBottom: 16,
              }}
            >
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>
                  {names.length} Results
                </h2>
                <p style={{ fontSize: 13, color: D.muted, marginTop: 4 }}>
                  {randomMode
                    ? "🌍 Random"
                    : `${nameData[country]?.flag || ""} ${country}`}{" "}
                  • {gender}
                </p>
              </div>
              <button
                className="copy-all-btn"
                onClick={() =>
                  doCopy(
                    names.map((n) => `${n.first} ${n.last}`).join("\n"),
                    "all",
                  )
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: D.accentBg,
                  border: `1px solid ${D.accent}30`,
                  color: D.accent,
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                {copied === "all" ? "✓ Copied" : "⧉ Copy All"}
              </button>
            </div>

            <div
              className="name-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {currentNames.map((n, i) => (
                <div
                  key={n.id}
                  className="namecard-anim"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <NameCard
                    n={n}
                    D={D}
                    index={i}
                    randomMode={randomMode}
                    copied={copied}
                    doCopy={doCopy}
                  />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div
                className="pagination-wrap"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 40,
                }}
              >
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((v) => v - 1);
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                >
                  Prev
                </button>
                <button className="page-btn active">
                  {currentPage} / {totalPages}
                </button>
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((v) => v + 1);
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. Add this to your existing <style> tag in App.js */}
      <style>{`
  @media (max-width: 768px) {
    .footer-main { flex-direction: column !important; gap: 48px !important; text-align: center; align-items: center !important; }
    .footer-links { width: 100%; justify-content: center !important; gap: 60px !important; }
    .footer-bottom { flex-direction: column-reverse !important; gap: 24px !important; text-align: center; }
  }
`}</style>

      {/* 2. The Updated Responsive Footer */}
      <footer
        style={{
          borderTop: `1px solid ${D.divider}`,
          padding: scrolled ? "60px 24px" : "80px 24px",
          background: D.card,
          marginTop: "auto",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          {/* Main Content Area */}
          <div
            className="footer-main"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "32px",
              marginBottom: "60px",
            }}
          >
            {/* Brand Column */}
            <div style={{ maxWidth: "320px" }}>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 22,
                  letterSpacing: "-1px",
                  color: D.text,
                  marginBottom: 16,
                }}
              >
                eizyName<span style={{ color: D.accent }}>Generator</span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: D.muted,
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                The world's most intuitive tool for generating culturally
                accurate names. Built for creators, writers, and developers.
              </p>
            </div>

            {/* Links Group */}
            <div
              className="footer-links"
              style={{
                display: "flex",
                gap: "80px",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: D.accent,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  Legal
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: D.muted,
                    cursor: "pointer",
                  }}
                >
                  Privacy
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: D.muted,
                    cursor: "pointer",
                  }}
                >
                  Terms
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: D.accent,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  Social
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: D.muted,
                    cursor: "pointer",
                  }}
                >
                  GitHub
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: D.muted,
                    cursor: "pointer",
                  }}
                >
                  Twitter
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="footer-bottom"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "32px",
              borderTop: `1px solid ${D.divider}`,
            }}
          >
            <div style={{ fontSize: 13, color: D.muted, fontWeight: 600 }}>
              © 2026 <span style={{ color: D.text }}>eizyName</span>. All rights
              reserved.
            </div>

            {/* codeHumps Signature */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: D.muted,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Developed by
              <span
                style={{
                  background: `linear-gradient(135deg, ${D.accent}, #ec4899)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 900,
                  fontSize: 16,
                  letterSpacing: "-0.5px",
                }}
              >
                codeHumps
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
