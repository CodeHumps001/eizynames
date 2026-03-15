import { useState, useCallback, useEffect, useMemo } from "react";
import { nameData } from "./data/nameData";
import { genName, copyText, fallbackCopy, pick } from "./utils/helpers";
import Sidebar from "./component/sidebar";
import NameCard from "./component/nameCard";
// import { Analytics } from "@vercel/analytics/next";

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
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
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
  const [usedNames, setUsedNames] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const doGenerate = useCallback(() => {
    const newNames = [];
    const newUsedNames = new Set(usedNames);
    let attempts = 0;
    const maxAttempts = count * 15;

    while (newNames.length < count && attempts < maxAttempts) {
      const c = randomMode ? pick(Object.keys(nameData)) : country;
      const g = gender === "both" ? pick(["male", "female"]) : gender;
      const nameObj = genName(c, g);
      const nameKey = `${nameObj.full}|${nameObj.country}`;
      if (!newUsedNames.has(nameKey)) {
        newNames.push(nameObj);
        newUsedNames.add(nameKey);
      }
      attempts++;
    }

    setNames(newNames);
    setUsedNames(newUsedNames);
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

  const resetSession = () => {
    setUsedNames(new Set());
    doGenerate();
  };

  const countries = Object.keys(nameData).filter((c) => {
    const matchRegion = region === "All" || nameData[c].region === region;
    const matchSearch = c.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300"
      style={{
        backgroundColor: dark ? "#0f0a08" : "#fff8f5",
        color: dark ? "#f1ede9" : "#1c0f08",
      }}
    >
      {/* <Analytics /> */}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .namecard-anim { animation: slideIn 0.3s ease forwards; opacity: 0; }
        .glass { backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); }
      `}</style>

      {/* ══════════════════════════════════════════
          HEADER — fixed, gains depth on scroll
      ══════════════════════════════════════════ */}
      <header
        className="glass fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: dark
            ? scrolled
              ? "rgba(15,10,8,0.94)"
              : "rgba(15,10,8,0.85)"
            : scrolled
              ? "rgba(255,248,245,0.96)"
              : "rgba(255,248,245,0.85)",
          borderBottom: `1px solid ${
            scrolled
              ? dark
                ? "rgba(251,146,60,0.16)"
                : "rgba(251,146,60,0.2)"
              : dark
                ? "rgba(251,146,60,0.07)"
                : "rgba(253,186,116,0.15)"
          }`,
          boxShadow: scrolled
            ? dark
              ? "0 4px 32px rgba(0,0,0,0.5)"
              : "0 4px 24px rgba(251,146,60,0.1)"
            : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-[62px] flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-500/30 shrink-0">
              e
            </div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent whitespace-nowrap select-none">
              eizyNameGenerator
            </span>
          </div>

          {/* Dark / Light toggle */}
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="relative w-[68px] h-[34px] rounded-full flex items-center justify-between px-2 cursor-pointer transition-colors duration-300 shrink-0"
            style={{
              border: `1.5px solid ${dark ? "rgba(251,146,60,0.22)" : "rgba(253,186,116,0.55)"}`,
              backgroundColor: dark ? "#1f1008" : "#fff1e6",
            }}
            aria-label="Toggle theme"
          >
            {/* Sliding knob */}
            <span
              className={`absolute top-[3px] w-7 h-7 rounded-full shadow-md flex items-center justify-center text-sm z-10 transition-all duration-300
                ${dark ? "left-[36px] bg-orange-500" : "left-[3px] bg-white"}`}
            >
              {dark ? "🌙" : "☀️"}
            </span>
            {/* Background icons */}
            <span
              className={`text-xs transition-opacity duration-200 ${dark ? "opacity-0" : "opacity-35"}`}
            >
              ☀️
            </span>
            <span
              className={`text-xs transition-opacity duration-200 ${dark ? "opacity-35" : "opacity-0"}`}
            >
              🌙
            </span>
          </button>
        </div>
      </header>

      {/* Push content below the fixed 62px header */}
      <div className="h-[62px] shrink-0" />

      {/* ════════════════════════
          HERO
      ════════════════════════ */}
      <section className="text-center px-6 pt-16 pb-14 md:pt-20 md:pb-16">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[1.5px] px-3 py-1.5 rounded-full mb-5 border"
          style={{
            backgroundColor: dark ? "rgba(251,146,60,0.08)" : "#fff1e6",
            borderColor: dark
              ? "rgba(251,146,60,0.18)"
              : "rgba(251,146,60,0.3)",
            color: dark ? "#fb923c" : "#c2410c",
          }}
        >
          ✦ Free • No Ads
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-[52px] font-black tracking-tight leading-[1.08] mb-4">
          Generate Names
          <br />
          <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
            From Any Country
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="max-w-md mx-auto text-[15px] leading-relaxed"
          style={{ color: dark ? "rgba(253,186,116,0.45)" : "#92400e" }}
        >
          Authentic first &amp; last names from{" "}
          <span
            className="font-bold"
            style={{ color: dark ? "rgba(253,186,116,0.8)" : "#431407" }}
          >
            {Object.keys(nameData).length}
          </span>{" "}
          countries.
        </p>
      </section>

      {/* ════════════════════════
          MAIN LAYOUT
      ════════════════════════ */}
      <main className="w-full max-w-6xl mx-auto px-5 pb-20 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[310px_1fr] gap-8 lg:gap-10 items-start">
          {/* Sidebar */}
          <Sidebar
            dark={dark}
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
            resetSession={resetSession}
            usedNamesCount={usedNames.size}
          />

          {/* Results panel */}
          <div>
            {/* Results header */}
            <div
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b"
              style={{
                borderColor: dark
                  ? "rgba(251,146,60,0.1)"
                  : "rgba(253,186,116,0.3)",
              }}
            >
              <div>
                <h2 className="text-xl font-black tracking-tight">
                  {names.length} Results
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: dark ? "rgba(253,186,116,0.4)" : "#92400e" }}
                >
                  {randomMode
                    ? "🌍 Random"
                    : `${nameData[country]?.flag ?? ""} ${country}`}{" "}
                  • <span className="capitalize">{gender}</span>
                </p>
              </div>

              {/* Copy All */}
              <button
                type="button"
                onClick={() =>
                  doCopy(
                    names.map((n) => `${n.first} ${n.last}`).join("\n"),
                    "all",
                  )
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 sm:w-auto w-full justify-center"
                style={
                  copied === "all"
                    ? {
                        backgroundColor: "#10b981",
                        color: "#fff",
                        borderColor: "#10b981",
                      }
                    : {
                        backgroundColor: dark
                          ? "rgba(251,146,60,0.08)"
                          : "#fff1e6",
                        color: dark ? "#fb923c" : "#c2410c",
                        borderColor: dark
                          ? "rgba(251,146,60,0.2)"
                          : "rgba(251,146,60,0.3)",
                      }
                }
              >
                {copied === "all" ? "✓ Copied" : "⧉ Copy All"}
              </button>
            </div>

            {/* Name grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {currentNames.map((n, i) => (
                <div
                  key={n.id}
                  className="namecard-anim"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <NameCard
                    n={n}
                    dark={dark}
                    index={i}
                    randomMode={randomMode}
                    copied={copied}
                    doCopy={doCopy}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((v) => v - 1);
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className="px-4 py-2.5 rounded-xl border text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                  style={{
                    backgroundColor: dark ? "#1a0d08" : "#ffffff",
                    borderColor: dark
                      ? "rgba(251,146,60,0.18)"
                      : "rgba(253,186,116,0.4)",
                    color: dark ? "rgba(253,186,116,0.7)" : "#7c2d12",
                  }}
                >
                  ← Prev
                </button>

                <span
                  className="px-4 py-2.5 rounded-xl text-white text-sm font-bold min-w-[90px] text-center shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #e11d48)",
                    boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                  }}
                >
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((v) => v + 1);
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className="px-4 py-2.5 rounded-xl border text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                  style={{
                    backgroundColor: dark ? "#1a0d08" : "#ffffff",
                    borderColor: dark
                      ? "rgba(251,146,60,0.18)"
                      : "rgba(253,186,116,0.4)",
                    color: dark ? "rgba(253,186,116,0.7)" : "#7c2d12",
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ════════════════════════
          FOOTER
      ════════════════════════ */}
      <footer
        className="border-t mt-auto w-full"
        style={{
          borderColor: dark ? "rgba(251,146,60,0.1)" : "rgba(253,186,116,0.3)",
          backgroundColor: dark ? "#100a06" : "#fff8f4",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Top row */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 mb-14">
            {/* Brand blurb */}
            <div className="max-w-xs">
              <p className="text-[22px] font-black tracking-tight mb-3">
                eizyName
                <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                  Generator
                </span>
              </p>
              <p
                className="text-sm leading-relaxed font-medium"
                style={{ color: dark ? "rgba(253,186,116,0.35)" : "#92400e" }}
              >
                The world's most intuitive tool for generating culturally
                accurate names. Built for creators, writers, and developers.
              </p>
            </div>

            {/* Link columns */}
            <div className="flex gap-16 md:gap-20">
              {[
                ["Legal", ["Privacy", "Terms"]],
                ["Social", ["GitHub", "Twitter"]],
              ].map(([heading, items]) => (
                <div key={heading} className="flex flex-col gap-3">
                  <span
                    className="text-[10px] font-black uppercase tracking-[1.5px]"
                    style={{ color: dark ? "#fb923c" : "#ea580c" }}
                  >
                    {heading}
                  </span>
                  {items.map((item) => (
                    <span
                      key={item}
                      className="text-sm font-semibold cursor-pointer transition-colors duration-150"
                      style={{
                        color: dark ? "rgba(253,186,116,0.35)" : "#92400e",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = dark
                          ? "#fb923c"
                          : "#c2410c")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = dark
                          ? "rgba(253,186,116,0.35)"
                          : "#92400e")
                      }
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4 pt-7 border-t"
            style={{
              borderColor: dark
                ? "rgba(251,146,60,0.08)"
                : "rgba(253,186,116,0.22)",
            }}
          >
            <p
              className="text-[13px] font-semibold"
              style={{ color: dark ? "rgba(253,186,116,0.28)" : "#92400e" }}
            >
              © 2026{" "}
              <span
                style={{ color: dark ? "rgba(253,186,116,0.6)" : "#431407" }}
              >
                eizyName
              </span>
              . All rights reserved.
            </p>
            <p
              className="text-sm font-semibold flex items-center gap-2"
              style={{ color: dark ? "rgba(253,186,116,0.28)" : "#92400e" }}
            >
              Developed by{" "}
              <span className="font-black text-base bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent tracking-tight">
                codeHumps
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
