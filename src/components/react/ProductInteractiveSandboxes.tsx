import React, { useMemo, useState } from "react";
import { labActions } from "../../store/labStore";

const EQ_FREQS = ["31", "62", "125", "250", "500", "1k", "2k", "4k", "8k", "16k"];

export const ProductInteractiveSandboxes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"offmind" | "lieffects" | "lisound">("offmind");

  // Offmind GGUF Planner
  const [paramB, setParamB] = useState(4.0);
  const [bits, setBits] = useState(4.5);
  const [ctxLen, setCtxLen] = useState(8192);

  const vram = useMemo(() => {
    const weights = Number(((paramB * bits) / 8).toFixed(2));
    const kv = Number(((ctxLen / 4096) * (paramB / 4) * 0.38).toFixed(2));
    const total = Number((weights + kv + 0.4).toFixed(2));
    return { weights, kv, total };
  }, [paramB, bits, ctxLen]);

  // LiEffects Film LUT
  const [contrast, setContrast] = useState(1.18);
  const [halation, setHalation] = useState(32);
  const [accentMode, setAccentMode] = useState<"#facc15" | "#ef4444" | "#ec4899">("#facc15");

  // LiSound 10-Band EQ
  const [bands, setBands] = useState<number[]>([2.5, 3.0, 1.0, -0.5, 0.5, 2.0, 3.5, 4.0, 2.5, 1.5]);

  const eqPath = useMemo(() => {
    const w = 640;
    const h = 160;
    const mid = h / 2;
    const pts = bands.map((db, i) => {
      const x = 32 + (i / 9) * (w - 64);
      const y = mid - (db / 12) * (mid - 20);
      return [x, y] as [number, number];
    });
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cx = (pts[i][0] + pts[i + 1][0]) * 0.5;
      d += ` C ${cx} ${pts[i][1]}, ${cx} ${pts[i + 1][1]}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
    }
    return { d, pts, w, h, mid };
  }, [bands]);

  return (
    <section id="sandboxes" className="border-b border-white/10 bg-[#040404]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-14 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">
              INTERACTIVE REPOSITORY MODULES
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Live Engineering Sandboxes
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {(
              [
                { id: "offmind", label: "OFFMIND GGUF MEMORY", repo: "offmind" },
                { id: "lieffects", label: "LIEFFECTS SHADER LUT", repo: "LiEffects" },
                { id: "lisound", label: "LISOUND 10-BAND DSP", repo: "LiSound" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveTab(t.id);
                  labActions.setSelectedRepo(t.repo);
                }}
                className={`px-4 py-2 border cursor-pointer transition-colors ${
                  activeTab === t.id
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-transparent text-neutral-400 border-white/15 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "offmind" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/10 bg-[#080808] p-6 sm:p-8">
            <div className="lg:col-span-6 space-y-5 font-mono text-xs">
              <div className="text-white font-sans text-lg font-bold">
                Offmind — On-Device GGUF Quantization &amp; KV-Cache Estimator
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-neutral-400 mb-1">
                    PARAMETERS: <span className="text-white">{paramB}B</span>
                  </label>
                  <input
                    type="range"
                    min="1.5"
                    max="14"
                    step="0.5"
                    value={paramB}
                    onChange={(e) => setParamB(Number(e.target.value))}
                    className="w-full accent-[#facc15]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">
                    QUANTIZATION BITS/WEIGHT: <span className="text-[#facc15]">{bits} bpw</span>
                  </label>
                  <input
                    type="range"
                    min="3.5"
                    max="8.0"
                    step="0.5"
                    value={bits}
                    onChange={(e) => setBits(Number(e.target.value))}
                    className="w-full accent-[#ec4899]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">
                    CONTEXT WINDOW: <span className="text-[#ef4444]">{ctxLen} tokens</span>
                  </label>
                  <input
                    type="range"
                    min="2048"
                    max="32768"
                    step="2048"
                    value={ctxLen}
                    onChange={(e) => setCtxLen(Number(e.target.value))}
                    className="w-full accent-[#ef4444]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-[#040404] border border-white/10">
                  <div className="text-[10px] text-neutral-500">WEIGHTS</div>
                  <div className="text-sm font-bold text-white mt-0.5">{vram.weights} GB</div>
                </div>
                <div className="p-3 bg-[#040404] border border-white/10">
                  <div className="text-[10px] text-neutral-500">KV CACHE</div>
                  <div className="text-sm font-bold text-[#facc15] mt-0.5">{vram.kv} GB</div>
                </div>
                <div className="p-3 bg-[#040404] border border-white/10">
                  <div className="text-[10px] text-neutral-500">TOTAL RAM</div>
                  <div className="text-sm font-bold text-[#ec4899] mt-0.5">{vram.total} GB</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#040404] border border-white/10 p-4">
              <svg viewBox="0 0 520 240" className="w-full h-auto block">
                <g transform="translate(260, 195)">
                  <polygon
                    points="0,0 130,-50 0,-100 -130,-50"
                    fill="#141414"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                  <g transform="translate(0, -42)">
                    <polygon
                      points="0,0 110,-42 0,-84 -110,-42"
                      fill="#1a1a1a"
                      stroke="#facc15"
                      strokeWidth="1.2"
                    />
                  </g>
                  <g transform="translate(0, -82)">
                    <polygon
                      points="0,0 85,-32 0,-64 -85,-32"
                      fill="#1f1f1f"
                      stroke="#ec4899"
                      strokeWidth="1.2"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        )}

        {activeTab === "lieffects" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/10 bg-[#080808] p-6 sm:p-8">
            <div className="lg:col-span-5 space-y-4 font-mono text-xs">
              <div className="text-white font-sans text-lg font-bold">
                LiEffects — AGSL Spectral Halation &amp; Tone Curve
              </div>
              <div className="flex gap-2">
                {(["#facc15", "#ef4444", "#ec4899"] as const).map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setAccentMode(hex)}
                    className={`px-3 py-1.5 border cursor-pointer ${
                      accentMode === hex ? "border-white text-white" : "border-white/15 text-neutral-500"
                    }`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: hex }}
                    />
                    {hex.toUpperCase()}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  CONTRAST SLOPE: <span className="text-white">{contrast.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="1.6"
                  step="0.02"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  HALATION BLOOM: <span className="text-white">{halation}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={halation}
                  onChange={(e) => setHalation(Number(e.target.value))}
                  className="w-full accent-[#facc15]"
                />
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#040404] border border-white/10 p-4">
              <svg viewBox="0 0 600 220" className="w-full h-auto block">
                <circle
                  cx="300"
                  cy="110"
                  r={30 + halation * 0.55}
                  fill={accentMode}
                  opacity="0.22"
                />
                <circle
                  cx="300"
                  cy="110"
                  r="34"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <path
                  d={`M 60 190 Q 300 ${190 - contrast * 110} 540 30`}
                  fill="none"
                  stroke={accentMode}
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        )}

        {activeTab === "lisound" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/10 bg-[#080808] p-6 sm:p-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-white text-lg font-bold">
                LiSound — 10-Band Biquad Frequency Response
              </div>
              <div className="grid grid-cols-10 gap-1.5 text-center font-mono">
                {bands.map((db, idx) => (
                  <div key={EQ_FREQS[idx]} className="flex flex-col items-center gap-1">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="0.5"
                      value={db}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setBands((prev) => prev.map((b, i) => (i === idx ? v : b)));
                      }}
                      className="h-24 accent-[#facc15] [writing-mode:vertical-lr] [direction:rtl]"
                    />
                    <span className="text-[10px] text-neutral-500">{EQ_FREQS[idx]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#040404] border border-white/10 p-4">
              <svg viewBox={`0 0 ${eqPath.w} ${eqPath.h}`} className="w-full h-auto block">
                <line
                  x1="0"
                  y1={eqPath.mid}
                  x2={eqPath.w}
                  y2={eqPath.mid}
                  stroke="rgba(255,255,255,0.15)"
                  strokeDasharray="3 5"
                />
                <path d={eqPath.d} fill="none" stroke="#facc15" strokeWidth="2" />
                {eqPath.pts.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt[0]}
                    cy={pt[1]}
                    r="3.5"
                    fill={i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#facc15" : "#ec4899"}
                  />
                ))}
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
