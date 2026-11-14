import type React from "react";
import { LILABS_REPOS } from "../../data/repos";
import { labActions, useLabStore } from "../../store/labStore";

export const LiMarkSvg: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 150 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="LI Labs"
  >
    <path d="M28 25H54V97H84L108 121H51L28 98V25Z" fill="currentColor" />
    <rect x="94" y="25" width="26" height="25" fill="#FACC15" />
    <path d="M94 58H120V121L94 95V58Z" fill="currentColor" />
  </svg>
);

export const SiteHeader: React.FC<{ activePage: "home" | "product" }> = ({ activePage }) => {
  const lab = useLabStore();
  const isHome = activePage === "home";
  const nextTheme = lab.theme === "dark" ? "light" : "dark";
  return (
    <header
      className={
        isHome
          ? "fixed top-0 inset-x-0 z-40 pointer-events-none"
          : "sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-header)] backdrop-blur-md"
      }
    >
      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 h-16 flex items-center justify-between gap-4">
        <a
          href="/"
          className="pointer-events-auto ui-pressable inline-flex items-center gap-2.5 group focus:outline-none text-[var(--text-strong)] shrink-0"
          aria-label="LI Labs Home"
        >
          <LiMarkSvg className="w-6 h-6 shrink-0 ui-brand-mark" />
          <span className="font-mono text-xs font-semibold tracking-[0.26em] uppercase">
            LI LABS
          </span>
        </a>

        <nav className="pointer-events-auto flex items-center gap-3.5 sm:gap-6 font-mono text-[11px] tracking-[0.2em] uppercase">
          <a
            href="/"
            className={`ui-pressable inline-block ${
              activePage === "home"
                ? "text-[var(--text-strong)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-strong)]"
            }`}
          >
            INDEX
          </a>
          <a
            href="/product/"
            className={`ui-pressable inline-flex items-center gap-1.5 ${
              activePage === "product"
                ? "text-[var(--text-strong)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-strong)]"
            }`}
          >
            <span>PRODUCT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-yellow)] shrink-0" />
          </a>
          <a
            href="https://github.com/LiLabsAI"
            target="_blank"
            rel="noreferrer"
            className="ui-pressable inline-block text-[var(--text-secondary)] hover:text-[var(--text-strong)]"
          >
            GITHUB ↗
          </a>
          <button
            type="button"
            onClick={() => labActions.toggleTheme()}
            aria-label={`Switch to ${nextTheme} theme`}
            aria-pressed={lab.theme === "light"}
            title={lab.theme === "dark" ? "Switch to light theme (#f0f0f0)" : "Switch to dark theme (#040404)"}
            className="ui-pressable inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--border-control)] bg-[var(--bg-control)] hover:bg-[var(--bg-control-hover)] hover:border-[var(--border-hover)] text-[var(--text-control)] hover:text-[var(--text-strong)] cursor-pointer shrink-0"
          >
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-full border border-current shrink-0"
              style={{
                background:
                  lab.theme === "light"
                    ? "linear-gradient(90deg, currentColor 50%, transparent 50%)"
                    : "linear-gradient(90deg, transparent 50%, currentColor 50%)",
              }}
            />
            <span className="hidden sm:inline">{lab.theme === "dark" ? "LIGHT" : "DARK"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export const SiteFooter: React.FC<{ activePage?: "home" | "product" }> = ({
  activePage = "product",
}) => {
  const lab = useLabStore();
  const isHome = activePage === "home";

  if (isHome) {
    return (
      <footer className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
        <div className="mx-auto max-w-[1680px] px-6 sm:px-10 h-14 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--text-muted)]">
          <div className="pointer-events-auto flex items-center gap-3">
            <span className="text-[var(--text-control)]">LI LABS</span>
            <span className="hidden sm:inline opacity-40">/</span>
            <span className="hidden sm:inline">
              INDEPENDENT SOFTWARE &amp; AI RESEARCH BY{" "}
              <a
                href="https://aliahad.com"
                target="_blank"
                rel="noreferrer"
                className="ui-pressable inline-block text-[var(--text-control)] hover:text-[var(--text-strong)]"
              >
                ALI AHAD
              </a>
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-4">
            <button
              type="button"
              onClick={() => labActions.setPulseMode("neural")}
              className={`ui-pressable flex items-center gap-1.5 cursor-pointer ${
                lab.pulseMode === "neural"
                  ? "text-[var(--text-strong)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-control)]"
              }`}
              title="Neural Network Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
              <span className="hidden md:inline">NEURAL</span>
            </button>
            <button
              type="button"
              onClick={() => labActions.setPulseMode("finetune")}
              className={`ui-pressable flex items-center gap-1.5 cursor-pointer ${
                lab.pulseMode === "finetune"
                  ? "text-[var(--accent-yellow-text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-control)]"
              }`}
              title="Fine-Tune Wave Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-yellow)] shrink-0" />
              <span className="hidden md:inline">FINE-TUNE</span>
            </button>
            <button
              type="button"
              onClick={() => labActions.setPulseMode("synapse")}
              className={`ui-pressable flex items-center gap-1.5 cursor-pointer ${
                lab.pulseMode === "synapse"
                  ? "text-[var(--accent-pink)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-control)]"
              }`}
              title="Synapse Backprop Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] shrink-0" />
              <span className="hidden md:inline">BACKPROP</span>
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono tracking-[0.18em] uppercase text-[var(--text-muted)]">
        <div>
          LI LABS — INDEPENDENT SOFTWARE &amp; AI RESEARCH INITIATIVE BY{" "}
          <a
            href="https://aliahad.com"
            target="_blank"
            rel="noreferrer"
            className="ui-pressable inline-block text-[var(--text-control)] hover:text-[var(--text-strong)]"
          >
            ALI AHAD
          </a>
        </div>
        <div className="flex items-center gap-6 tabular-nums">
          <a href="/" className="ui-pressable inline-block hover:text-[var(--text-strong)]">
            INDEX
          </a>
          <a href="/product/" className="ui-pressable inline-block hover:text-[var(--text-strong)]">
            PRODUCT ({LILABS_REPOS.length})
          </a>
          <a
            href="https://github.com/LiLabsAI"
            target="_blank"
            rel="noreferrer"
            className="ui-pressable inline-block hover:text-[var(--text-strong)]"
          >
            GITHUB ↗
          </a>
        </div>
      </div>
    </footer>
  );
};
