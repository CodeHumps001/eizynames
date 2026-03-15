import React from "react";

const NameCard = ({ n, dark, index, randomMode, copied, doCopy }) => {
  if (!n) return null;

  const isCopied = copied === n.id;
  const displayFirst = n.firstName || n.first || "?";
  const displayLast = n.lastName || n.last || "";
  const displayFull = n.full || `${displayFirst} ${displayLast}`;
  const initial = displayFirst[0].toUpperCase();

  return (
    <div
      className="group relative flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: dark ? "#1a0d08" : "#ffffff",
        borderColor: dark ? "rgba(251,146,60,0.09)" : "rgba(253,186,116,0.3)",
        boxShadow: dark ? "none" : "0 1px 8px rgba(251,146,60,0.05)",
        animation: `slideIn 0.4s ease forwards ${index * 0.03}s`,
        opacity: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = dark
          ? "rgba(251,146,60,0.3)"
          : "#fb923c";
        e.currentTarget.style.boxShadow = dark
          ? "0 4px 20px rgba(249,115,22,0.12)"
          : "0 6px 24px rgba(249,115,22,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = dark
          ? "rgba(251,146,60,0.09)"
          : "rgba(253,186,116,0.3)";
        e.currentTarget.style.boxShadow = dark
          ? "none"
          : "0 1px 8px rgba(251,146,60,0.05)";
      }}
    >
      {/* Left — avatar + name */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Avatar */}
        <div
          className="w-[42px] h-[42px] shrink-0 rounded-xl flex items-center justify-center text-lg font-black transition-colors duration-200"
          style={{
            backgroundColor: dark ? "rgba(251,146,60,0.12)" : "#fff1e6",
            color: dark ? "#fb923c" : "#c2410c",
          }}
        >
          {initial}
        </div>

        {/* Name text */}
        <div className="min-w-0">
          <p
            className="font-bold text-[15px] leading-tight truncate"
            style={{ color: dark ? "rgba(253,186,116,0.9)" : "#431407" }}
          >
            {displayFirst}
          </p>
          <p
            className="text-[12px] font-medium mt-0.5 truncate"
            style={{ color: dark ? "rgba(251,146,60,0.35)" : "#fdba74" }}
          >
            {displayLast}
          </p>

          {/* Country badge — random mode only */}
          {randomMode && n.country && (
            <span
              className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-wider"
              style={{ color: dark ? "#fb923c" : "#ea580c" }}
            >
              {n.country}
            </span>
          )}
        </div>
      </div>

      {/* Right — copy button */}
      <button
        type="button"
        onClick={() => doCopy(displayFull, n.id)}
        aria-label={isCopied ? "Copied!" : "Copy name"}
        className="ml-3 shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold border-0 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
        style={{
          backgroundColor: isCopied
            ? dark
              ? "rgba(34,197,94,0.15)"
              : "#dcfce7"
            : dark
              ? "rgba(251,146,60,0.1)"
              : "#fff1e6",
          color: isCopied
            ? dark
              ? "#4ade80"
              : "#16a34a"
            : dark
              ? "#fb923c"
              : "#c2410c",
          opacity: isCopied ? 1 : undefined, // keep visible when copied
        }}
      >
        {isCopied ? "✓" : "⎘"}
      </button>
    </div>
  );
};

export default NameCard;
