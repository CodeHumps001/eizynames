import React from "react";

const Sidebar = ({
  dark,
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
  resetSession,
  usedNamesCount = 0,
}) => {
  if (!nameData) return null;

  // ── Reusable segment button ──────────────────────────────────────────────
  const SegBtn = ({ isActive, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-1.5 py-3 px-1 rounded-xl
        border-[1.5px] text-[13px] font-bold cursor-pointer
        transition-all duration-200 select-none
        ${
          isActive
            ? "border-orange-400 dark:border-orange-500 bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400"
            : "border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.04] text-slate-400 dark:text-orange-200/30 hover:border-orange-300 dark:hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400"
        }
      `}
    >
      {children}
    </button>
  );

  // ── Section label ────────────────────────────────────────────────────────
  const Label = ({ children }) => (
    <span className="block text-[10px] font-black text-slate-400 dark:text-orange-200/30 uppercase tracking-[1.2px] mb-3">
      {children}
    </span>
  );

  return (
    <div className="lg:sticky lg:top-[80px] flex flex-col gap-5">
      {/* ── Main control card ─────────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-6 flex flex-col gap-6 border"
        style={{
          backgroundColor: dark ? "#1a0d08" : "#ffffff",
          borderColor: dark ? "rgba(251,146,60,0.1)" : "rgba(253,186,116,0.3)",
          boxShadow: dark ? "none" : "0 2px 16px rgba(251,146,60,0.06)",
        }}
      >
        {/* Gender */}
        <div>
          <Label>Gender</Label>
          <div className="flex gap-2">
            {[
              ["male", "♂ Male"],
              ["female", "♀ Female"],
              ["both", "⚥ Both"],
            ].map(([v, l]) => (
              <SegBtn
                key={v}
                isActive={gender === v}
                onClick={() => setGender(v)}
              >
                {l}
              </SegBtn>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <Label>Quantity</Label>
          <div className="flex gap-2">
            {COUNTS.map((n) => (
              <SegBtn
                key={n}
                isActive={count === n}
                onClick={() => setCount(n)}
              >
                {n}
              </SegBtn>
            ))}
          </div>
        </div>

        {/* Country Mode */}
        <div>
          <Label>Country Mode</Label>
          <div className="flex gap-2">
            <SegBtn isActive={!randomMode} onClick={() => setRandomMode(false)}>
              📌 Pick
            </SegBtn>
            <SegBtn isActive={randomMode} onClick={() => setRandomMode(true)}>
              🎲 Random
            </SegBtn>
          </div>
        </div>

        {/* Country & Region picker */}
        {!randomMode && (
          <div className="flex flex-col gap-3">
            <Label>Country</Label>

            {/* Region pills */}
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`
                    px-3 py-1.5 rounded-full border text-[11px] font-semibold
                    cursor-pointer transition-all duration-150
                    ${
                      region === r
                        ? "border-orange-400 dark:border-orange-500 bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400"
                        : "border-slate-200 dark:border-white/[0.07] bg-transparent text-slate-400 dark:text-orange-200/30 hover:border-orange-300 dark:hover:border-orange-500/35 hover:text-orange-500 dark:hover:text-orange-300"
                    }
                  `}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Country dropdown trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 cursor-pointer border-[1.5px]"
                style={{
                  backgroundColor: dark ? "#0f0805" : "#fff8f5",
                  borderColor: showDropdown
                    ? dark
                      ? "rgba(251,146,60,0.5)"
                      : "#fb923c"
                    : dark
                      ? "rgba(251,146,60,0.15)"
                      : "rgba(253,186,116,0.45)",
                  color: dark ? "rgba(253,186,116,0.8)" : "#431407",
                }}
              >
                <span>
                  {nameData[country]?.flag} {country}
                </span>
                <span
                  className="text-[9px] transition-transform duration-200"
                  style={{
                    color: dark ? "rgba(251,146,60,0.4)" : "#fb923c",
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Dropdown panel */}
              {showDropdown && (
                <div
                  className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-2xl overflow-hidden border"
                  style={{
                    backgroundColor: dark ? "#1a0d08" : "#ffffff",
                    borderColor: dark
                      ? "rgba(251,146,60,0.12)"
                      : "rgba(253,186,116,0.4)",
                    boxShadow: dark
                      ? "0 20px 40px rgba(0,0,0,0.5)"
                      : "0 20px 40px rgba(251,146,60,0.12)",
                  }}
                >
                  {/* Search input */}
                  <div
                    className="p-2.5 border-b"
                    style={{
                      borderColor: dark
                        ? "rgba(251,146,60,0.08)"
                        : "rgba(253,186,116,0.2)",
                    }}
                  >
                    <input
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search country..."
                      className="w-full text-[13px] px-3 py-2 rounded-lg outline-none border transition-colors duration-150"
                      style={{
                        backgroundColor: dark ? "#0f0805" : "#fff8f5",
                        color: dark ? "rgba(253,186,116,0.85)" : "#431407",
                        borderColor: dark
                          ? "rgba(251,146,60,0.15)"
                          : "rgba(253,186,116,0.35)",
                      }}
                    />
                  </div>

                  {/* Country list */}
                  <div className="max-h-52 overflow-y-auto overscroll-contain">
                    {countries.length === 0 && (
                      <p
                        className="text-center text-sm py-6"
                        style={{
                          color: dark ? "rgba(251,146,60,0.3)" : "#fdba74",
                        }}
                      >
                        No results
                      </p>
                    )}
                    {countries.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCountry(c);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-[13px] font-medium transition-colors duration-100 cursor-pointer"
                        style={{
                          backgroundColor:
                            country === c
                              ? dark
                                ? "rgba(251,146,60,0.12)"
                                : "#fff1e6"
                              : "transparent",
                          color:
                            country === c
                              ? dark
                                ? "#fb923c"
                                : "#c2410c"
                              : dark
                                ? "rgba(253,186,116,0.7)"
                                : "#57280e",
                          fontWeight: country === c ? 700 : 500,
                        }}
                        onMouseEnter={(e) => {
                          if (country !== c) {
                            e.currentTarget.style.backgroundColor = dark
                              ? "rgba(251,146,60,0.06)"
                              : "#fff8f5";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (country !== c) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }
                        }}
                      >
                        {nameData[c].flag} {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          type="button"
          onClick={doGenerate}
          className="mt-1 w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-extrabold text-[15px] tracking-tight hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer border-0"
          style={{
            background: "linear-gradient(135deg, #f97316, #e11d48)",
            boxShadow: "0 6px 24px rgba(249,115,22,0.35)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 10px 32px rgba(249,115,22,0.48)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 6px 24px rgba(249,115,22,0.35)")
          }
        >
          ✦ Generate Names
        </button>

        {/* Reset session */}
        {usedNamesCount > 0 && (
          <button
            type="button"
            onClick={resetSession}
            className="w-full py-3 rounded-xl bg-transparent text-[13px] font-bold transition-all duration-150 cursor-pointer border-[1.5px]"
            style={{
              borderColor: dark ? "rgba(251,146,60,0.3)" : "#fb923c",
              color: dark ? "#fb923c" : "#c2410c",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = dark
                ? "rgba(251,146,60,0.08)"
                : "#fff1e6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            🔄 Reset Session ({usedNamesCount} tracked)
          </button>
        )}
      </div>

      {/* ── Stats grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          emoji="🌍"
          value={Object.keys(nameData).length}
          label="Countries"
          dark={dark}
        />
        <StatCard
          emoji="👥"
          value={names.length}
          label="Generated"
          dark={dark}
        />
        <div className={usedNamesCount > 0 ? "col-span-1" : "col-span-2"}>
          <StatCard
            emoji="✨"
            value={usedNamesCount}
            label="Unique in Session"
            dark={dark}
            full
          />
        </div>
      </div>
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ emoji, value, label, dark, full }) => (
  <div
    className={`rounded-2xl p-4 border ${full ? "w-full" : ""}`}
    style={{
      backgroundColor: dark ? "#1a0d08" : "#ffffff",
      borderColor: dark ? "rgba(251,146,60,0.1)" : "rgba(253,186,116,0.3)",
      boxShadow: dark ? "none" : "0 2px 12px rgba(251,146,60,0.05)",
    }}
  >
    <div className="text-xl mb-2">{emoji}</div>
    <div
      className="text-xl font-black"
      style={{ color: dark ? "rgba(253,186,116,0.9)" : "#431407" }}
    >
      {value}
    </div>
    <div
      className="text-[11px] font-bold mt-0.5"
      style={{ color: dark ? "rgba(251,146,60,0.35)" : "#fdba74" }}
    >
      {label}
    </div>
  </div>
);

export default Sidebar;
