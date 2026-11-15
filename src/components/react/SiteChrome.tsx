import type React from "react";
import { LILABS_REPOS } from "../../data/repos";
import { labActions, type ThemeMode, useLabStore } from "../../store/labStore";

export const LiMarkSvg: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 150 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="LI Labs"
  >
    <path d="M28 25H54V97H84L108 121H51L28 98V25Z" fill="currentColor" />
    <rect
      x="94"
      y="25"
      width="26"
      height="25"
      fill="#FACC15"
      stroke="var(--mark-dot-stroke)"
      strokeWidth="2.5"
    />
    <path d="M94 58H120V121L94 95V58Z" fill="currentColor" />
  </svg>
);

const GitHubMarkSvg: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const GitHubOrgLink: React.FC<{ className?: string }> = ({ className = "" }) => (
  <a
    href="https://github.com/LiLabsAI"
    target="_blank"
    rel="noreferrer"
    aria-label="LI Labs on GitHub"
    title="GitHub — LiLabsAI"
    className={`ui-pressable w-8 h-8 inline-flex items-center justify-center border border-transparent hover:border-[var(--border-control)] hover:bg-[var(--bg-control)] text-[var(--text-secondary)] hover:text-[var(--text-strong)] focus-visible:outline-none focus-visible:border-[var(--accent-focus)] shrink-0 ${className}`}
  >
    <GitHubMarkSvg className="w-4 h-4 shrink-0" />
  </a>
);

const ThemeSwitchButton: React.FC<{ theme: ThemeMode; compact?: boolean }> = ({
  theme,
  compact = false,
}) => {
  const nextTheme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => labActions.toggleTheme()}
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === "light"}
      title={
        theme === "dark" ? "Switch to light theme (#f0f0f0)" : "Switch to dark theme (#040404)"
      }
      className={`ui-pressable inline-flex items-center gap-1.5 border border-[var(--border-control)] bg-[var(--bg-control)] hover:bg-[var(--bg-control-hover)] hover:border-[var(--border-hover)] text-[var(--text-control)] hover:text-[var(--text-strong)] focus-visible:outline-none focus-visible:border-[var(--accent-focus)] cursor-pointer shrink-0 ${
        compact ? "px-2 py-1 text-[10px]" : "px-2.5 py-1 text-[11px]"
      }`}
    >
      <span
        aria-hidden="true"
        className="w-2.5 h-2.5 rounded-full border border-current shrink-0"
        style={{
          background:
            theme === "light"
              ? "linear-gradient(90deg, currentColor 50%, transparent 50%)"
              : "linear-gradient(90deg, transparent 50%, currentColor 50%)",
        }}
      />
      <span>{theme === "dark" ? "LIGHT" : "DARK"}</span>
    </button>
  );
};

const NAV_LINK_FOCUS_CLASS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--accent-focus)] focus-visible:outline-offset-4";

export const SiteHeader: React.FC<{ activePage: "home" | "product" }> = ({ activePage }) => {
  const isHome = activePage === "home";
  return (
    <header
      className={
        isHome
          ? "fixed top-0 inset-x-0 z-40 pointer-events-none"
          : "sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-header)] backdrop-blur-md"
      }
    >
      <div
        className={`mx-auto ${
          isHome ? "max-w-[1680px]" : "max-w-[1440px]"
        } px-6 sm:px-10 h-16 flex items-center justify-between gap-4`}
      >
        <a
          href="/"
          className={`pointer-events-auto ui-pressable inline-flex items-center gap-2.5 group text-[var(--text-strong)] shrink-0 ${NAV_LINK_FOCUS_CLASS}`}
          aria-label="LI Labs Home"
        >
          <LiMarkSvg className="w-6 h-6 shrink-0 ui-brand-mark" />
          <span className="font-mono text-xs font-semibold tracking-[0.26em] uppercase">
            LI LABS
          </span>
        </a>

        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto flex items-center gap-4 sm:gap-6 font-mono text-[11px] tracking-[0.2em] uppercase"
        >
          <a
            href="/"
            aria-current={activePage === "home" ? "page" : undefined}
            className={`relative ui-pressable inline-flex items-center py-1.5 ${NAV_LINK_FOCUS_CLASS} ${
              activePage === "home"
                ? "text-[var(--text-strong)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-strong)]"
            }`}
          >
            <span>INDEX</span>
            {activePage === "home" && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-[var(--accent-focus)]"
              />
            )}
          </a>
          <a
            href="/product/"
            aria-current={activePage === "product" ? "page" : undefined}
            className={`relative ui-pressable inline-flex items-center gap-1.5 py-1.5 ${NAV_LINK_FOCUS_CLASS} ${
              activePage === "product"
                ? "text-[var(--text-strong)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-strong)]"
            }`}
          >
            <span>PRODUCT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-yellow)] ring-1 ring-[var(--dot-ring)] shrink-0" />
            {activePage === "product" && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-[var(--accent-focus)]"
              />
            )}
          </a>
          <span
            aria-hidden="true"
            className="h-3.5 w-px bg-[var(--border-control)] shrink-0"
          />
          <GitHubOrgLink className="-mr-1.5" />
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
        <div className="mx-auto max-w-[1680px] px-6 sm:px-10 h-14 flex items-center justify-between gap-4 text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--text-muted)]">
          <div className="pointer-events-auto flex items-center gap-3 min-w-0">
            <span className="text-[var(--text-control)] shrink-0">LI LABS</span>
            <span className="hidden sm:inline opacity-40">/</span>
            <span className="hidden sm:inline truncate">
              <span className="hidden lg:inline">INDEPENDENT SOFTWARE &amp; AI RESEARCH </span>
              BY{" "}
              <a
                href="https://aliahad.com"
                target="_blank"
                rel="noreferrer"
                className={`ui-pressable inline-block text-[var(--text-control)] hover:text-[var(--text-strong)] ${NAV_LINK_FOCUS_CLASS}`}
              >
                ALI AHAD
              </a>
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => labActions.setPulseMode("neural")}
              className={`ui-pressable flex items-center gap-1.5 py-1 px-1 cursor-pointer ${NAV_LINK_FOCUS_CLASS} ${
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
              className={`ui-pressable flex items-center gap-1.5 py-1 px-1 cursor-pointer ${NAV_LINK_FOCUS_CLASS} ${
                lab.pulseMode === "finetune"
                  ? "text-[var(--accent-yellow-text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-control)]"
              }`}
              title="Fine-Tune Wave Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-yellow)] ring-1 ring-[var(--dot-ring)] shrink-0" />
              <span className="hidden md:inline">FINE-TUNE</span>
            </button>
            <button
              type="button"
              onClick={() => labActions.setPulseMode("synapse")}
              className={`ui-pressable flex items-center gap-1.5 py-1 px-1 cursor-pointer ${NAV_LINK_FOCUS_CLASS} ${
                lab.pulseMode === "synapse"
                  ? "text-[var(--accent-pink)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-control)]"
              }`}
              title="Synapse Backprop Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] ring-1 ring-[var(--dot-ring)] shrink-0" />
              <span className="hidden md:inline">BACKPROP</span>
            </button>
            <span
              aria-hidden="true"
              className="h-3 w-px bg-[var(--border-control)] shrink-0"
            />
            <ThemeSwitchButton theme={lab.theme} compact />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono tracking-[0.18em] uppercase text-[var(--text-muted)]">
        <div className="text-center sm:text-left leading-relaxed">
          LI LABS — INDEPENDENT SOFTWARE &amp; AI RESEARCH INITIATIVE BY{" "}
          <a
            href="https://aliahad.com"
            target="_blank"
            rel="noreferrer"
            className={`ui-pressable inline-block text-[var(--text-control)] hover:text-[var(--text-strong)] ${NAV_LINK_FOCUS_CLASS}`}
          >
            ALI AHAD
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5 sm:gap-6 tabular-nums shrink-0">
          <a
            href="/"
            className={`ui-pressable inline-block hover:text-[var(--text-strong)] ${NAV_LINK_FOCUS_CLASS}`}
          >
            INDEX
          </a>
          <a
            href="/product/"
            className={`ui-pressable inline-block hover:text-[var(--text-strong)] ${NAV_LINK_FOCUS_CLASS}`}
          >
            PRODUCT ({LILABS_REPOS.length})
          </a>
          <GitHubOrgLink />
          <span aria-hidden="true" className="h-3.5 w-px bg-[var(--border-control)] shrink-0" />
          <ThemeSwitchButton theme={lab.theme} />
        </div>
      </div>
    </footer>
  );
};
