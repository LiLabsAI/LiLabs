import React from "react";
import { labActions, useLabStore } from "../../store/labStore";

export const LiMarkSvg: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 150 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="LI Labs"
  >
    <path d="M28 25H54V97H84L108 121H51L28 98V25Z" fill="#FFFFFF" />
    <rect x="94" y="25" width="26" height="25" fill="#FACC15" />
    <path d="M94 58H120V121L94 95V58Z" fill="#FFFFFF" />
  </svg>
);

export const SiteHeader: React.FC<{ activePage: "home" | "product" }> = ({ activePage }) => {
  const isHome = activePage === "home";
  return (
    <header
      className={
        isHome
          ? "fixed top-0 inset-x-0 z-40 pointer-events-none"
          : "sticky top-0 z-40 border-b border-white/10 bg-[#040404]/90 backdrop-blur-md"
      }
    >
      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 h-16 flex items-center justify-between">
        <a
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2.5 group focus:outline-none"
          aria-label="LI Labs Home"
        >
          <LiMarkSvg className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" />
          <span className="font-mono text-xs font-semibold tracking-[0.26em] text-white uppercase">
            LI LABS
          </span>
        </a>

        <nav className="pointer-events-auto flex items-center gap-6 font-mono text-[11px] tracking-[0.2em] uppercase">
          <a
            href="/"
            className={`transition-colors ${
              activePage === "home"
                ? "text-white"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            INDEX
          </a>
          <a
            href="/product"
            className={`transition-colors flex items-center gap-1.5 ${
              activePage === "product"
                ? "text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>PRODUCT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#facc15]" />
          </a>
          <a
            href="https://github.com/LiLabsAI"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            GITHUB ↗
          </a>
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
        <div className="mx-auto max-w-[1680px] px-6 sm:px-10 h-14 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-500">
          <div className="pointer-events-auto flex items-center gap-3">
            <span className="text-neutral-300">LI LABS</span>
            <span className="hidden sm:inline text-neutral-700">/</span>
            <span className="hidden sm:inline">
              INDEPENDENT SOFTWARE &amp; AI RESEARCH BY{" "}
              <a
                href="https://aliahad.com"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                ALI AHAD
              </a>
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-4">
            <button
              type="button"
              onClick={() => labActions.setPulseMode("neural")}
              className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                lab.pulseMode === "neural" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
              title="Neural Network Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="hidden md:inline">NEURAL</span>
            </button>
            <button
              type="button"
              onClick={() => labActions.setPulseMode("finetune")}
              className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                lab.pulseMode === "finetune"
                  ? "text-[#facc15]"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
              title="Fine-Tune Wave Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#facc15]" />
              <span className="hidden md:inline">FINE-TUNE</span>
            </button>
            <button
              type="button"
              onClick={() => labActions.setPulseMode("synapse")}
              className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                lab.pulseMode === "synapse"
                  ? "text-[#ec4899]"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
              title="Synapse Backprop Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
              <span className="hidden md:inline">BACKPROP</span>
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/10 bg-[#040404]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono tracking-[0.18em] uppercase text-neutral-500">
        <div>
          LI LABS — INDEPENDENT SOFTWARE &amp; AI RESEARCH INITIATIVE BY{" "}
          <a
            href="https://aliahad.com"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-300 hover:text-white"
          >
            ALI AHAD
          </a>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" className="hover:text-white transition-colors">
            INDEX
          </a>
          <a href="/product" className="hover:text-white transition-colors">
            PRODUCT (9)
          </a>
          <a
            href="https://github.com/LiLabsAI"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            GITHUB ↗
          </a>
        </div>
      </div>
    </footer>
  );
};
