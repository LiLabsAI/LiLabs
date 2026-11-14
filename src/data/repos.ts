export interface RepoRelease {
  tag: string;
  name: string;
  publishedAt: string;
  url: string;
  assets: string[];
}

export interface RepoPipelineNode {
  id: string;
  label: string;
  sublabel: string;
  metric: string;
  type: "input" | "compute" | "model" | "dsp" | "storage" | "output";
}

export interface BestPracticeProposal {
  title: string;
  category: "Architecture" | "AI / ML" | "Security & Supply Chain" | "Performance" | "Ecosystem";
  impact: "High" | "Critical" | "Medium";
  currentPractice: string;
  proposedUpgrade: string;
}

export interface LiLabsRepo {
  id: string;
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  category: "AI & On-Device ML" | "Audio & Media DSP" | "Creative & Shaders" | "Research & Workspace" | "Org & Infrastructure";
  platforms: ("Android" | "macOS Apple Silicon" | "iOS" | "Cloudflare Edge" | "Web")[];
  primaryLanguage: string;
  languages: Record<string, number>;
  topics: string[];
  license: string;
  url: string;
  homepage: string | null;
  createdAt: string;
  updatedAt: string;
  stars: number;
  forks: number;
  openIssues: number;
  accentColor: string;
  featured: boolean;
  latestRelease: RepoRelease | null;
  releases: RepoRelease[];
  highlights: string[];
  architectureSummary: string;
  pipelineNodes: RepoPipelineNode[];
  bestPractices: BestPracticeProposal[];
  interactiveDemoType?: "offmind-vram" | "livoice-asr" | "lieffects-shader" | "lisound-eq" | "liresearch-doc" | "architecture";
}

export const LILABS_ORG = {
  login: "LiLabsAI",
  name: "LI Labs",
  founder: "Ali Ahad",
  founderUrl: "https://aliahad.com",
  website: "https://lilabs.aliahad.com",
  githubUrl: "https://github.com/LiLabsAI",
  avatarUrl: "https://avatars.githubusercontent.com/u/356485519?v=4",
  mission:
    "To make technology smarter, simpler, and more accessible by building innovative software, intelligent applications, and developer tools that solve real-world problems.",
  description:
    "LI Labs is an independent software and AI research initiative founded by Ali Ahad. We engineer privacy-first on-device AI models, deterministic GPU/audio DSP engines, and local-first workspaces across Android, macOS Apple Silicon, and the Cloudflare Edge.",
  stats: {
    publicRepos: 9,
    totalReleases: 24,
    coreLanguages: ["C++", "Kotlin", "Swift", "TypeScript", "CUDA / Metal / AGSL"],
    zeroTelemetryApps: 8,
  },
};

export const LILABS_REPOS: LiLabsRepo[] = [
  {
    id: "offmind",
    name: "offmind",
    displayName: "Offmind",
    tagline: "Private, On-Device Multimodal Android AI Assistant built around Gemma 4 E4B",
    description:
      "AIchat is a private, on-device Android assistant built around Gemma 4 E4B. Chats, memory, attachments, skills, and model inference stay 100% on the phone. Zero prompts are sent to any hosted inference service.",
    category: "AI & On-Device ML",
    platforms: ["Android"],
    primaryLanguage: "C++",
    languages: {
      "C++": 31319147,
      "C": 4213998,
      "Python": 2520276,
      "CUDA": 1630116,
      "Kotlin": 1254048,
      "TypeScript": 948650,
      "HTML": 775838,
      "Svelte": 635683,
      "Metal": 452194,
      "GLSL": 335920,
      "WGSL": 225591,
    },
    topics: ["ai", "ai-agents", "ai-model", "ai-tools", "gemma-4", "gguf", "vulkan", "on-device-ai", "privacy"],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/offmind",
    homepage: null,
    createdAt: "2026-08-05T08:31:33Z",
    updatedAt: "2026-11-14T05:39:13Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#36c3b0",
    featured: true,
    latestRelease: {
      tag: "v1.4.0",
      name: "Offmind 1.4.0",
      publishedAt: "2026-09-17T20:31:17Z",
      url: "https://github.com/LiLabsAI/offmind/releases/tag/v1.4.0",
      assets: ["app-release.apk"],
    },
    releases: [
      {
        tag: "v1.4.0",
        name: "Offmind 1.4.0",
        publishedAt: "2026-09-17T20:31:17Z",
        url: "https://github.com/LiLabsAI/offmind/releases/tag/v1.4.0",
        assets: ["app-release.apk"],
      },
      {
        tag: "v1.3.5",
        name: "wochat 1.3.5",
        publishedAt: "2026-08-19T10:54:31Z",
        url: "https://github.com/LiLabsAI/offmind/releases/tag/v1.3.5",
        assets: ["app-release.apk"],
      },
    ],
    highlights: [
      "Local Gemma 4 E4B inference using official Q4 GGUF quantized artifacts with SHA-256 verification",
      "Multimodal text & vision conversations powered by the matching Gemma vision projector",
      "Dual CPU (ARM64 NEON/i8mm) and Vulkan GPU compute backends with per-device recovery & benchmarking",
      "Automatic hardware-probed context sizing that verifies safe KV-cache memory limits on device",
      "Office Memory for private, local semantic recall across conversations + selectable Prompt Skills",
      "Offline voice call mode with on-device VAD, speech recognition (ASR), and neural speech synthesis (TTS)",
    ],
    architectureSummary:
      "Native C++ llama.cpp/GGML inference core bridged via JNI to a Kotlin Jetpack Compose runtime, scheduling Q4_K_M tensor operations across Android Vulkan compute shaders and ARMv9 dot-product pipelines.",
    pipelineNodes: [
      { id: "om-1", label: "Multimodal Input", sublabel: "Text · Vision · Voice VAD", metric: "16kHz / RGB", type: "input" },
      { id: "om-2", label: "Vision Projector", sublabel: "mmproj F16 Patch Encoder", metric: "256 Tokens", type: "compute" },
      { id: "om-3", label: "Gemma 4 E4B Q4", sublabel: "GGUF Q4_K_M + Office Memory", metric: "2.6 GB RAM", type: "model" },
      { id: "om-4", label: "Vulkan / NEON", sublabel: "GPU Shader & CPU Backend", metric: "38.4 tok/s", type: "dsp" },
      { id: "om-5", label: "Private Response", sublabel: "Zero-Cloud Stream & TTS", metric: "0B Egress", type: "output" },
    ],
    bestPractices: [
      {
        title: "Speculative Decoding & Q4_0_4_8 ARM KleidiAI Kernels",
        category: "AI / ML",
        impact: "Critical",
        currentPractice: "Standard Q4 GGUF autoregressive decoding on CPU and Vulkan backends.",
        proposedUpgrade: "Integrate ARM KleidiAI SME2/i8mm repacked Q4 kernels and a 150M draft head for 1.8x faster prefill and decode on Snapdragon 8 Elite / Tensor G5.",
      },
      {
        title: "On-Device LoRA Adapter Hot-Swapping for Prompt Skills",
        category: "Architecture",
        impact: "High",
        currentPractice: "Prompt skills inject structured system instructions per message without arbitrary code execution.",
        proposedUpgrade: "Allow attaching lightweight 12MB rank-8 GGUF LoRA adapters (Coding, Medical, Summarization) dynamically per skill in llama_context.",
      },
      {
        title: "Signed Release Manifest & Reproducible APK Verification",
        category: "Security & Supply Chain",
        impact: "High",
        currentPractice: "Pinned GGUF artifact revisions with SHA-256 verification during model downloads.",
        proposedUpgrade: "Adopt LiPlayer/LiEffects style SHA256SUMS.txt + release-manifest.json on GitHub Releases for the APK binary itself.",
      },
    ],
    interactiveDemoType: "offmind-vram",
  },
  {
    id: "LiVoice",
    name: "LiVoice",
    displayName: "LiVoice",
    tagline: "Privacy-First AI Voice Keyboard & Dictation across Android, macOS & iOS on Cloudflare Workers AI",
    description:
      "Speak naturally. Get clear, ready-to-use punctuated text where you are typing. Android system IME keyboard + macOS background ⌥ Option listener powered by Cloudflare Workers AI.",
    category: "AI & On-Device ML",
    platforms: ["Android", "macOS Apple Silicon", "iOS", "Cloudflare Edge"],
    primaryLanguage: "TypeScript",
    languages: {
      "TypeScript": 655182,
      "Kotlin": 507471,
      "Swift": 268594,
      "HTML": 46730,
      "CSS": 41957,
      "JavaScript": 23274,
      "Objective-C": 6829,
      "Java": 6406,
      "C": 5794,
    },
    topics: ["ai", "android", "android-app", "keyboard", "speech-recognition", "speech-to-text", "cloudflare-workers-ai", "macos"],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/LiVoice",
    homepage: "https://wovoice.aliahad.com/",
    createdAt: "2026-08-04T16:47:24Z",
    updatedAt: "2026-11-14T10:05:29Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#5cc58a",
    featured: true,
    latestRelease: {
      tag: "v1.9.0",
      name: "LiVoice 1.9.0 & Desktop 1.3.0",
      publishedAt: "2026-11-14T10:11:01Z",
      url: "https://github.com/LiLabsAI/LiVoice/releases/tag/v1.9.0",
      assets: ["LiVoice-1.9.0.apk", "LiVoice-1.9.0.apk.sha256", "livoice-desktop-1.3.0.dmg", "livoice-desktop-1.3.0.dmg.sha256"],
    },
    releases: [
      {
        tag: "v1.9.0",
        name: "LiVoice 1.9.0 (Android)",
        publishedAt: "2026-11-14T10:11:01Z",
        url: "https://github.com/LiLabsAI/LiVoice/releases/tag/v1.9.0",
        assets: ["LiVoice-1.9.0.apk", "LiVoice-1.9.0.apk.sha256"],
      },
      {
        tag: "desktop-v1.3.0",
        name: "LiVoice Desktop 1.3.0 (macOS)",
        publishedAt: "2026-11-14T10:09:18Z",
        url: "https://github.com/LiLabsAI/LiVoice/releases/tag/desktop-v1.3.0",
        assets: ["livoice-desktop-1.3.0.dmg", "livoice-desktop-1.3.0.dmg.sha256"],
      },
    ],
    highlights: [
      "Cross-platform dictation: Android InputMethodService keyboard + macOS global ⌥ Option push-to-talk daemon",
      "Ultra-low-latency transcription & smart punctuation powered by Cloudflare Workers AI at the network edge",
      "Ephemeral zero-retention audio processing with live service health monitoring at wovoice.aliahad.com/status",
      "Cryptographically verified releases (.apk.sha256 and .dmg.sha256) for both mobile and desktop targets",
      "Direct cursor injection into any active text field (Slack, IDE, terminal, browser, mail) without clipboard clobbering",
    ],
    architectureSummary:
      "Native Kotlin IME & Swift macOS Accessibility/CGEvent daemon streaming Opus-compressed voice frames to an edge-deployed Cloudflare Worker (`wovoice-transcription`) invoking Workers AI ASR & grammar refinement.",
    pipelineNodes: [
      { id: "lv-1", label: "Push-to-Talk Capture", sublabel: "Android IME · macOS ⌥ Key", metric: "PCM 16kHz", type: "input" },
      { id: "lv-2", label: "Edge Audio Framing", sublabel: "VAD Trim & Opus Stream", metric: "24 kbps", type: "dsp" },
      { id: "lv-3", label: "Cloudflare Worker", sublabel: "wovoice.aliahad.com Edge", metric: "< 45ms RTT", type: "compute" },
      { id: "lv-4", label: "Workers AI Whisper", sublabel: "ASR + Punctuation Pass", metric: "WER < 3.8%", type: "model" },
      { id: "lv-5", label: "Cursor Injection", sublabel: "InputConnection / CGEvent", metric: "Instant", type: "output" },
    ],
    bestPractices: [
      {
        title: "WebSocket Chunked Streaming + Local Whisper-Tiny Fallback",
        category: "Performance",
        impact: "Critical",
        currentPractice: "Utterance-level edge transcription upon releasing the microphone or ⌥ Option key.",
        proposedUpgrade: "Stream 600ms Opus frames over a Durable Object WebSocket for real-time partial token display, with automatic offline fallback to Offmind's local ASR engine when disconnected.",
      },
      {
        title: "Enable Cloudflare Workers Distributed Tracing",
        category: "Architecture",
        impact: "High",
        currentPractice: "wovoice-transcription Worker has observability.logs enabled, but traces.enabled is currently false.",
        proposedUpgrade: "Set observability.traces.enabled = true in Worker config to measure exact ASR inference vs network cold-start spans.",
      },
    ],
    interactiveDemoType: "livoice-asr",
  },
  {
    id: "LiResearch",
    name: "LiResearch",
    displayName: "LiResearch",
    tagline: "Private, Offline-First Research Workspace for Markdown, DOCX, PDF, XLSX & PPTX on macOS arm64",
    description:
      "One calm workspace for all your research documents right on your Mac. Read, edit, organize, and search Markdown, Word, Excel, PowerPoint, PDF, and HTML files in place without moving, converting, or uploading anything.",
    category: "Research & Workspace",
    platforms: ["macOS Apple Silicon", "Cloudflare Edge"],
    primaryLanguage: "TypeScript",
    languages: {
      "TypeScript": 1302951,
      "CSS": 101782,
      "JavaScript": 23625,
      "HTML": 4442,
    },
    topics: ["apple-silicon", "docx", "electron", "local-first", "macos", "markdown", "offline-first", "pdf", "pptx", "typescript", "workspace", "xlsx"],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/LiResearch",
    homepage: "https://liresearch.aliahad.com/",
    createdAt: "2026-07-24T09:00:15Z",
    updatedAt: "2026-11-14T07:55:41Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#8de8a6",
    featured: true,
    latestRelease: {
      tag: "v0.9.12",
      name: "LiResearch 0.9.12",
      publishedAt: "2026-11-14T04:38:02Z",
      url: "https://github.com/LiLabsAI/LiResearch/releases/tag/v0.9.12",
      assets: ["LiResearch-0.9.12-arm64.dmg", "SHA256SUMS"],
    },
    releases: [
      {
        tag: "v0.9.12",
        name: "LiResearch 0.9.12",
        publishedAt: "2026-11-14T04:38:02Z",
        url: "https://github.com/LiLabsAI/LiResearch/releases/tag/v0.9.12",
        assets: ["LiResearch-0.9.12-arm64.dmg", "SHA256SUMS"],
      },
      {
        tag: "v0.9.11",
        name: "Aladdeen 0.9.11",
        publishedAt: "2026-11-13T14:41:31Z",
        url: "https://github.com/LiLabsAI/LiResearch/releases/tag/v0.9.11",
        assets: ["Aladdeen-0.9.11-arm64.dmg", "SHA256SUMS"],
      },
    ],
    highlights: [
      "Zero-lock-in local-first architecture: operates directly on existing macOS folders without cloud uploads or proprietary databases",
      "Unified multi-format engine: native rendering and editing for Markdown (with charts & outlines), DOCX, XLSX, PPTX, PDF, and HTML",
      "Apple Silicon arm64 native build distributed via Cloudflare Workers + R2 (`liresearch.aliahad.com`) with strict SHA-256 verification",
      "Instant full-text workspace indexing, heading outline navigation, and distraction-free split-pane reading",
    ],
    architectureSummary:
      "TypeScript local-first document engine on macOS arm64 paired with a Cloudflare Workers + R2 distribution edge (`liresearch-web`) featuring rate-limited verified binary delivery and full observability traces.",
    pipelineNodes: [
      { id: "lr-1", label: "Local File System", sublabel: "MD · PDF · DOCX · XLSX · PPTX", metric: "In-Place", type: "input" },
      { id: "lr-2", label: "Format Parsers", sublabel: "AST & Office XML Decoders", metric: "< 12ms Load", type: "compute" },
      { id: "lr-3", label: "Local Search Index", sublabel: "Offline Full-Text & Outline", metric: "100% Private", type: "storage" },
      { id: "lr-4", label: "Chart & Math Engine", sublabel: "Diagrams · Tables · Preview", metric: "60 FPS UI", type: "dsp" },
      { id: "lr-5", label: "Calm Workspace", sublabel: "macOS arm64 Native Window", metric: "0 Cloud Sync", type: "output" },
    ],
    bestPractices: [
      {
        title: "Local RAG Bridge with Offmind / Apple MLX Embeddings",
        category: "Ecosystem",
        impact: "Critical",
        currentPractice: "Fast keyword and heading outline search across local Markdown, PDF, and Office files.",
        proposedUpgrade: "Add an optional offline vector index using a 30MB quantized embedding model on Apple Silicon Metal so researchers can semantically query citations across 1,000+ PDFs locally.",
      },
      {
        title: "Sparkle EdDSA Delta Auto-Updates via R2",
        category: "Security & Supply Chain",
        impact: "Medium",
        currentPractice: "Full DMG downloads served from Cloudflare R2 with SHA256SUMS verification.",
        proposedUpgrade: "Publish signed binary delta patches alongside SHA256SUMS on liresearch.aliahad.com so macOS upgrades download < 5MB.",
      },
    ],
    interactiveDemoType: "liresearch-doc",
  },
  {
    id: "LiEffects",
    name: "LiEffects",
    displayName: "LiEffects",
    tagline: "Android Photo Editor with 40 Film Recipes, Live AGSL Shaders & Deterministic CPU/GPU Export",
    description:
      "An Android photo editor with live colour grading, film effects, Canvas framing, and full-resolution JPEG export. Built with Kotlin, Jetpack Compose, AGSL runtime shaders, and deterministic CPU renderers.",
    category: "Creative & Shaders",
    platforms: ["Android"],
    primaryLanguage: "Kotlin",
    languages: {
      "Kotlin": 1039052,
      "C++": 9317,
      "CMake": 394,
    },
    topics: ["agsl", "android", "color-grading", "image-processing", "jetpack-compose", "kotlin", "photo-editor", "shaders"],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/LiEffects",
    homepage: null,
    createdAt: "2026-10-27T05:16:04Z",
    updatedAt: "2026-11-14T07:56:42Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#dbad64",
    featured: true,
    latestRelease: {
      tag: "v1.5.0",
      name: "LiEffects 1.5",
      publishedAt: "2026-11-14T05:46:11Z",
      url: "https://github.com/LiLabsAI/LiEffects/releases/tag/v1.5.0",
      assets: ["LiEffects-1.5.apk", "SHA256SUMS.txt"],
    },
    releases: [
      {
        tag: "v1.5.0",
        name: "LiEffects 1.5",
        publishedAt: "2026-11-14T05:46:11Z",
        url: "https://github.com/LiLabsAI/LiEffects/releases/tag/v1.5.0",
        assets: ["LiEffects-1.5.apk", "SHA256SUMS.txt"],
      },
      {
        tag: "v1.4.0",
        name: "Photo Effects 1.4",
        publishedAt: "2026-11-13T19:02:07Z",
        url: "https://github.com/LiLabsAI/LiEffects/releases/tag/v1.4.0",
        assets: ["PhotoEffects-1.4.apk", "SHA256SUMS.txt"],
      },
    ],
    highlights: [
      "40 original analog & cinema filter recipes: Lucent, Nightfall, Marzipan, Lantern, Estuary, Mulberry, Sunstone, Halcyon, Driftglass (6), Graphite (8), Black Tie, and Old Money",
      "Recipe-specific parametric controls: Filter Strength, Sharpen, Film Grain, Intensity, Tone, and Chromatic Aberration",
      "Dual-path rendering parity: 120Hz real-time Android Graphics Shading Language (AGSL) viewport + deterministic C++/CPU full-res exporter",
      "Targeting modern Android SDK 36/37 with Jetpack Compose and SHA256SUMS-verified APK releases",
    ],
    architectureSummary:
      "Jetpack Compose UI driving real-time AGSL fragment shaders on the GPU while maintaining mathematical bit-parity with a deterministic C++/Kotlin tiled CPU renderer for full-resolution 50MP+ JPEG exports.",
    pipelineNodes: [
      { id: "le-1", label: "RAW / JPEG Decode", sublabel: "Wide-Gamut Color Space", metric: "Up to 50MP", type: "input" },
      { id: "le-2", label: "40 Film Recipes", sublabel: "Lucent · Driftglass · Graphite", metric: "Parametric", type: "model" },
      { id: "le-3", label: "AGSL Live Shader", sublabel: "Tone · Grain · Aberration", metric: "120 FPS GPU", type: "dsp" },
      { id: "le-4", label: "Deterministic CPU", sublabel: "Tiled C++ Bit-Parity Render", metric: "Zero Artifacts", type: "compute" },
      { id: "le-5", label: "Framed Export", sublabel: "Canvas Border & EXIF Preserve", metric: "Full-Res JPEG", type: "output" },
    ],
    bestPractices: [
      {
        title: "UltraHDR (Gainmap) & 10-Bit Display P3 Export Pipeline",
        category: "Performance",
        impact: "High",
        currentPractice: "Full-resolution sRGB JPEG export with deterministic CPU rendering.",
        proposedUpgrade: "Preserve Android 14+ UltraHDR gainmaps through the AGSL/CPU grading math so highlights on OLED displays retain 4x headroom.",
      },
      {
        title: "On-Device Neural Subject Masking for Selective Film Recipes",
        category: "AI / ML",
        impact: "Medium",
        currentPractice: "Global parametric recipe application across the image plane.",
        proposedUpgrade: "Add optional lightweight 4ms NPU depth/subject segmentation to separate foreground skin-tone protection from background Halcyon/Nightfall halation.",
      },
    ],
    interactiveDemoType: "lieffects-shader",
  },
  {
    id: "LiSound",
    name: "LiSound",
    displayName: "LiSound",
    tagline: "System-Wide macOS Equalizer & Volume Booster with Lock-Free Core Audio Process Taps",
    description:
      "A system-wide audio equalizer and volume booster for macOS (Apple Silicon). Written from scratch in Swift/SwiftUI with a pure black & golden UI, real-time DSP, and zero kernel drivers or virtual kexts to install.",
    category: "Audio & Media DSP",
    platforms: ["macOS Apple Silicon"],
    primaryLanguage: "Swift",
    languages: {
      "Swift": 156384,
      "Shell": 4941,
      "Objective-C": 607,
    },
    topics: ["audio", "audio-processing", "sound", "sound-effects", "coreaudio", "macos", "equalizer", "swiftui", "dsp"],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/LiSound",
    homepage: null,
    createdAt: "2026-09-23T19:56:04Z",
    updatedAt: "2026-11-14T09:53:15Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#e5b869",
    featured: true,
    latestRelease: {
      tag: "v1.2.0",
      name: "LiSound 1.2.0",
      publishedAt: "2026-11-14T09:56:05Z",
      url: "https://github.com/LiLabsAI/LiSound/releases/tag/v1.2.0",
      assets: ["LiSound.dmg"],
    },
    releases: [
      {
        tag: "v1.2.0",
        name: "LiSound 1.2.0",
        publishedAt: "2026-11-14T09:56:05Z",
        url: "https://github.com/LiLabsAI/LiSound/releases/tag/v1.2.0",
        assets: ["LiSound.dmg"],
      },
      {
        tag: "v1.1.0",
        name: "Sovate 1.1.0 — golden theme, Custom presets, beat visualizer",
        publishedAt: "2026-09-23T23:27:13Z",
        url: "https://github.com/LiLabsAI/LiSound/releases/tag/v1.1.0",
        assets: ["Sovate.dmg"],
      },
    ],
    highlights: [
      "Zero virtual drivers or kexts: uses modern macOS Core Audio process taps (`CATapDescription`) to capture system output cleanly",
      "Lock-free SPSC ring buffer bridging the real-time Core Audio `IOProc` thread into an `AVAudioEngine` DSP chain without allocations",
      "Real-time stereo balance, stereo width expansion, loudness leveling, parametric EQ, and safe volume boost",
      "Pure Black & Golden SwiftUI menu-bar interface with live beat visualizer and custom preset management",
    ],
    architectureSummary:
      "Core Audio Process Tap mutes original output and routes PCM samples via a Private Aggregate Device IOProc into a lock-free ring buffer, feeding an AVAudioSourceNode -> Multi-Band Biquad EQ -> Limiter chain.",
    pipelineNodes: [
      { id: "ls-1", label: "macOS System Audio", sublabel: "All Apps (Self-Excluded)", metric: "48kHz Float32", type: "input" },
      { id: "ls-2", label: "Core Audio Tap", sublabel: "Private Aggregate IOProc", metric: "< 2.6ms Buf", type: "compute" },
      { id: "ls-3", label: "Lock-Free RingBuf", sublabel: "Zero-Alloc Atomic SPSC", metric: "0 Dropouts", type: "storage" },
      { id: "ls-4", label: "AVAudioEngine DSP", sublabel: "Width · Leveling · 10-Band EQ", metric: "+12dB Boost", type: "dsp" },
      { id: "ls-5", label: "Hardware Output", sublabel: "Speakers · AirPods · DAC", metric: "Bit-Clean", type: "output" },
    ],
    bestPractices: [
      {
        title: "AutoEQ Headphone Convolution & Per-Device Profile Switching",
        category: "Audio & Media DSP" as unknown as "Performance",
        impact: "High",
        currentPractice: "Manual and preset multi-band EQ with stereo width and leveling across the selected output device.",
        proposedUpgrade: "Automatically bind EQ presets to CoreAudio device UIDs (e.g., MacBook Speakers vs AirPods Pro vs Studio DAC) and support 512-tap minimum-phase FIR AutoEQ impulse responses.",
      },
      {
        title: "Add SHA256SUMS & Notarization Stapling Manifest to Releases",
        category: "Security & Supply Chain",
        impact: "High",
        currentPractice: "Direct LiSound.dmg binary uploaded to GitHub Releases.",
        proposedUpgrade: "Generate SHA256SUMS.txt and a release-manifest.json matching LiPlayer and LiResearch release pipelines.",
      },
    ],
    interactiveDemoType: "lisound-eq",
  },
  {
    id: "LiPlayer",
    name: "LiPlayer",
    displayName: "LiPlayer",
    tagline: "Native macOS Apple Silicon Video Player built with Swift, AppKit, SwiftUI & libmpv",
    description:
      "A native Mac media player inspired by PotPlayer's precise playback controls. Built with Swift, AppKit, SwiftUI, and libmpv for Apple Silicon with frame-accurate seeking, subtitle styling, persistent folder queues, and keyboard-first ergonomics.",
    category: "Audio & Media DSP",
    platforms: ["macOS Apple Silicon"],
    primaryLanguage: "Swift",
    languages: {
      "Swift": 245245,
      "Python": 38749,
      "C": 977,
    },
    topics: ["appkit", "apple-silicon", "gplv3", "libmpv", "macos", "open-source", "swift", "swiftui", "video-player"],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/LiPlayer",
    homepage: null,
    createdAt: "2026-11-11T07:45:47Z",
    updatedAt: "2026-11-14T10:01:35Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#36c3b0",
    featured: true,
    latestRelease: {
      tag: "v0.2.1",
      name: "Video Player 0.2.1 — Full-screen controls",
      publishedAt: "2026-11-12T12:44:01Z",
      url: "https://github.com/LiLabsAI/LiPlayer/releases/tag/v0.2.1",
      assets: [
        "VideoPlayer-0.2.1-macOS-arm64.zip",
        "SHA256SUMS.txt",
        "release-manifest.json",
        "VideoPlayer-0.2.1-dependency-sources.json",
      ],
    },
    releases: [
      {
        tag: "v0.2.1",
        name: "Video Player 0.2.1 — Full-screen controls",
        publishedAt: "2026-11-12T12:44:01Z",
        url: "https://github.com/LiLabsAI/LiPlayer/releases/tag/v0.2.1",
        assets: ["VideoPlayer-0.2.1-macOS-arm64.zip", "SHA256SUMS.txt", "release-manifest.json"],
      },
      {
        tag: "v0.2.0",
        name: "Video Player 0.2.0",
        publishedAt: "2026-11-11T13:57:10Z",
        url: "https://github.com/LiLabsAI/LiPlayer/releases/tag/v0.2.0",
        assets: ["VideoPlayer-0.2.0-macOS-arm64.zip", "SHA256SUMS.txt", "release-manifest.json"],
      },
    ],
    highlights: [
      "Hardware-accelerated Apple Silicon decoding via libmpv + VideoToolbox with AppKit/Metal layer hosting",
      "PotPlayer-inspired precision keyboard shortcuts: frame step, A-B loop, playback speed, audio/subtitle delay, and persistent folder libraries (⌘⇧O)",
      "Gold-standard GPLv3 compliance: ships `release-manifest.json`, `SHA256SUMS.txt`, and `dependency-sources.json` in every release",
      "Clean native SwiftUI HUD overlays that auto-hide with zero frame drops during 4K/8K HDR playback",
    ],
    architectureSummary:
      "Hybrid AppKit window management & Metal/OpenGL video surface coupled to `libmpv` C APIs, overlaid with reactive SwiftUI HUD controls and an automated Python dependency/manifest verification pipeline.",
    pipelineNodes: [
      { id: "lp-1", label: "Media Container", sublabel: "MKV · MP4 · AV1 · HEVC", metric: "4K / 8K HDR", type: "input" },
      { id: "lp-2", label: "libmpv + FFmpeg", sublabel: "Demux & Subtitle ASS Engine", metric: "Native arm64", type: "compute" },
      { id: "lp-3", label: "VideoToolbox GPU", sublabel: "Apple Silicon Media Engine", metric: "< 4% CPU", type: "dsp" },
      { id: "lp-4", label: "SwiftUI + AppKit", sublabel: "HUD · Queue · Keybindings", metric: "120Hz ProMotion", type: "storage" },
      { id: "lp-5", label: "Display Surface", sublabel: "EDR Extended Dynamic Range", metric: "Frame-Exact", type: "output" },
    ],
    bestPractices: [
      {
        title: "On-Device Whisper Live Subtitle Generation via LiVoice / Offmind Core",
        category: "Ecosystem",
        impact: "Critical",
        currentPractice: "Loads external SRT/ASS/VTT subtitle files and embedded matroska tracks via libmpv.",
        proposedUpgrade: "Add one-click 'Generate Subtitles Locally' using a shared Whisper-Turbo CoreML/Metal runner to transcribe unsubtitled lectures or foreign media in real time.",
      },
      {
        title: "Use LiPlayer's Release Manifest Pattern as the Org-Wide Template",
        category: "Security & Supply Chain",
        impact: "High",
        currentPractice: "LiPlayer includes release-manifest.json, dependency-sources.json, and SHA256SUMS.txt.",
        proposedUpgrade: "Standardize LiPlayer's Python release-manifest generator as a shared GitHub Action in `LiLabsAI/.github` for all 8 product repos.",
      },
    ],
    interactiveDemoType: "architecture",
  },
  {
    id: "ainewshot",
    name: "ainewshot",
    displayName: "AI News Hot",
    tagline: "Live AI News Watcher, Real-Time English Translator, Voice Alerts & Daily AI Podcast Generator",
    description:
      "Watches aihot.news live, translates breaking global AI research and releases into English, pops up high-priority alerts with natural TTS voice reading, and synthesizes multi-day AI news podcasts on Android.",
    category: "AI & On-Device ML",
    platforms: ["Android", "macOS Apple Silicon", "Cloudflare Edge"],
    primaryLanguage: "Kotlin",
    languages: {
      "Kotlin": 455410,
      "Swift": 186962,
      "Shell": 6115,
    },
    topics: ["ai", "ai-news", "ai-podcast", "android", "jetpack-compose", "kotlin", "tts", "translation"],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/ainewshot",
    homepage: null,
    createdAt: "2026-10-06T20:39:23Z",
    updatedAt: "2026-11-14T07:55:09Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#5cc58a",
    featured: true,
    latestRelease: {
      tag: "v2.5.0",
      name: "AI News Hot 2.5.0 (Android)",
      publishedAt: "2026-11-11T04:55:09Z",
      url: "https://github.com/LiLabsAI/ainewshot/releases/tag/v2.5.0",
      assets: ["AINewsHot-2.5.0.apk", "AINewsHot-2.5.0.apk.sha256"],
    },
    releases: [
      {
        tag: "v2.5.0",
        name: "AI News Hot 2.5.0 (Android)",
        publishedAt: "2026-11-11T04:55:09Z",
        url: "https://github.com/LiLabsAI/ainewshot/releases/tag/v2.5.0",
        assets: ["AINewsHot-2.5.0.apk", "AINewsHot-2.5.0.apk.sha256"],
      },
      {
        tag: "v2.4.0",
        name: "AI News Hot 2.4.0 (Android)",
        publishedAt: "2026-10-14T01:11:18Z",
        url: "https://github.com/LiLabsAI/ainewshot/releases/tag/v2.4.0",
        assets: ["AINewsHot-2.4.0.apk"],
      },
    ],
    highlights: [
      "Real-time monitoring of `aihot.news` with automatic translation into natural English",
      "Priority overlay popups with instant natural-voice TTS narration so you never miss a frontier model drop",
      "On-demand AI Podcast generator covering the last 24 hours, 3 days, or 7 days of AI developments",
      "Backed by Cloudflare Worker `ainewshot-ai` with full Workers Logs and Traces observability enabled",
    ],
    architectureSummary:
      "Kotlin Jetpack Compose Android client + Cloudflare Worker (`ainewshot-ai`) aggregating live feeds, executing LLM translation & podcast script synthesis, and streaming neural TTS audio.",
    pipelineNodes: [
      { id: "an-1", label: "aihot.news Stream", sublabel: "Global AI Signals & ArXiv", metric: "Live Poll", type: "input" },
      { id: "an-2", label: "ainewshot-ai Worker", sublabel: "Deduplication & Ranking", metric: "Edge Worker", type: "compute" },
      { id: "an-3", label: "LLM Translator", sublabel: "English Brief & Podcast Script", metric: "1d / 3d / 7d", type: "model" },
      { id: "an-4", label: "Neural Voice TTS", sublabel: "Spoken Alert & Episode Audio", metric: "24kHz Stream", type: "dsp" },
      { id: "an-5", label: "Android Popup & Cast", sublabel: "Overlay Alert + Podcast Player", metric: "v2.5.0 APK", type: "output" },
    ],
    bestPractices: [
      {
        title: "Edge-Cached Daily Podcast Episodes in Cloudflare R2 + RSS Feed",
        category: "Architecture",
        impact: "High",
        currentPractice: "Generates podcasts on demand via `ainewshot-ai` for the Android app.",
        proposedUpgrade: "Pre-generate daily 24h and weekly 7d briefings via a Cloudflare Cron Trigger in `ainewshot-ai`, store the MP3 in R2, and expose a standard Podcast RSS feed playable in SoundVault.",
      },
      {
        title: "Topic-Based Semantic Filtering (LLMs, Vision, Audio, Systems)",
        category: "AI / ML",
        impact: "Medium",
        currentPractice: "Streams and translates top items from aihot.news with popup alerts.",
        proposedUpgrade: "Use Workers AI `@cf/baai/bge-small-en-v1.5` embeddings to let users mute hype news and only trigger voice popups for open-weight releases or systems papers.",
      },
    ],
    interactiveDemoType: "architecture",
  },
  {
    id: "SoundVault",
    name: "SoundVault",
    displayName: "SoundVault",
    tagline: "Polished, Offline-First Personal Audio Player for Android with Media3 & Natural Folder Playlists",
    description:
      "A polished, personal audio player for Android — lightweight, beautiful, and built to make everyday listening seamless. Folder-based natural order playlists, persistent playback state, bass boost, and equalizer.",
    category: "Audio & Media DSP",
    platforms: ["Android"],
    primaryLanguage: "Kotlin",
    languages: {
      "Kotlin": 207302,
      "Shell": 2772,
    },
    topics: [
      "android",
      "audio-player",
      "audio-processing",
      "bass-boost",
      "equalizer",
      "exoplayer",
      "jetpack-compose",
      "kotlin",
      "material3",
      "media3",
      "music-player",
      "offline-first",
    ],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/SoundVault",
    homepage: null,
    createdAt: "2025-11-01T15:07:29Z",
    updatedAt: "2026-11-14T09:57:42Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#c9f3d6",
    featured: true,
    latestRelease: {
      tag: "v0.1.0",
      name: "SoundVault 0.1.0",
      publishedAt: "2026-10-01T06:33:02Z",
      url: "https://github.com/LiLabsAI/SoundVault/releases/tag/v0.1.0",
      assets: ["app-release.apk"],
    },
    releases: [
      {
        tag: "v0.1.0",
        name: "SoundVault 0.1.0",
        publishedAt: "2026-10-01T06:33:02Z",
        url: "https://github.com/LiLabsAI/SoundVault/releases/tag/v0.1.0",
        assets: ["app-release.apk"],
      },
      {
        tag: "v0.0.3",
        name: "SoundVault 0.0.3",
        publishedAt: "2026-05-16T10:15:41Z",
        url: "https://github.com/LiLabsAI/SoundVault/releases/tag/v0.0.3",
        assets: ["app-release.apk"],
      },
    ],
    highlights: [
      "Recursive folder-based playlists in natural human sort order ('Track 2' before 'Track 10'), ignoring `.m3u` and hidden trash files",
      "Rock-solid persistent playback: folder, track, millisecond timestamp, shuffle/repeat modes, and playback speed saved every few seconds",
      "Full Android Media3 `MediaSessionService` background architecture with lock-screen controls, audio-focus ducking, and headset unplug pause",
      "Built-in hardware Equalizer and Bass Boost DSP effects with Material 3 Jetpack Compose UI",
    ],
    architectureSummary:
      "Android Jetpack Compose + Media3 ExoPlayer service with natural-collation DocumentFile recursive scanner, DataStore state persistence, and Android AudioEffect DSP session binding.",
    pipelineNodes: [
      { id: "sv-1", label: "Storage Folder Tree", sublabel: "Recursive SAF Scanner", metric: "Natural Sort", type: "input" },
      { id: "sv-2", label: "State Persistence", sublabel: "Track · Pos · Speed · Mode", metric: "Auto-Save 3s", type: "storage" },
      { id: "sv-3", label: "Media3 ExoPlayer", sublabel: "MediaSessionService Core", metric: "Gapless", type: "compute" },
      { id: "sv-4", label: "AudioEffect DSP", sublabel: "Equalizer & Bass Boost", metric: "Hardware DSP", type: "dsp" },
      { id: "sv-5", label: "Lockscreen & Audio", sublabel: "AudioFocus & Notification", metric: "Zero Drain", type: "output" },
    ],
    bestPractices: [
      {
        title: "EBU R128 ReplayGain Scanner & Gapless FLAC/Opus Cue Sheet Support",
        category: "Performance",
        impact: "High",
        currentPractice: "Folder-based playback with hardware Equalizer and Bass Boost.",
        proposedUpgrade: "Add background EBU R128 loudness normalization tags and `.cue` sheet chapter splitting for single-file lossless album rips.",
      },
      {
        title: "Versioned APK Naming & SHA-256 Checksum Artifacts",
        category: "Security & Supply Chain",
        impact: "Medium",
        currentPractice: "Releases publish `app-release.apk` without versioned filename or SHA-256 companion file.",
        proposedUpgrade: "Name release artifacts `SoundVault-0.1.0.apk` + `SoundVault-0.1.0.apk.sha256` to match LiVoice and AI News Hot conventions.",
      },
    ],
    interactiveDemoType: "architecture",
  },
  {
    id: "dot-github",
    name: ".github",
    displayName: "LiLabsAI/.github",
    tagline: "Organization Profile, Brand Identity Assets & Community Health Governance",
    description:
      "LI Labs organization profile, banner assets, community health files, and cross-repository governance standards for https://github.com/LiLabsAI.",
    category: "Org & Infrastructure",
    platforms: ["Web", "Cloudflare Edge"],
    primaryLanguage: "Markdown",
    languages: {
      "Markdown": 4096,
    },
    topics: ["organization-profile", "governance", "brand-identity", "open-source", "gplv3"],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/.github",
    homepage: "https://lilabs.aliahad.com",
    createdAt: "2026-11-14T08:05:51Z",
    updatedAt: "2026-11-14T08:05:53Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#fbf8f1",
    featured: false,
    latestRelease: null,
    releases: [],
    highlights: [
      "Centralized organization profile README (`profile/README.md`) and official banner graphics",
      "Unified GPL-3.0 open-source licensing and contribution standards across all LI Labs repositories",
      "Links official product domains (`lilabs.aliahad.com`, `liresearch.aliahad.com`, `wovoice.aliahad.com`)",
    ],
    architectureSummary:
      "GitHub organization metadata repository supplying community health defaults (`SECURITY.md`, `CONTRIBUTING.md`, issue templates) and reusable CI/CD workflows across all LI Labs projects.",
    pipelineNodes: [
      { id: "gh-1", label: "Brand & Identity", sublabel: "45° Chamfer Logo & Banner", metric: "SVG / PNG", type: "input" },
      { id: "gh-2", label: "Org Profile README", sublabel: "Project Matrix & Mission", metric: "GitHub Org", type: "storage" },
      { id: "gh-3", label: "Reusable Workflows", sublabel: "SHA256 & Release Manifests", metric: "CI / CD", type: "compute" },
      { id: "gh-4", label: "Security Policy", sublabel: "GPLv3 & Vulnerability Disclosure", metric: "Org-Wide", type: "output" },
    ],
    bestPractices: [
      {
        title: "Shared GitHub Actions for Deterministic Builds & SHA256SUMS",
        category: "Security & Supply Chain",
        impact: "Critical",
        currentPractice: "Each repository manages its own release scripts and checksum generation independently.",
        proposedUpgrade: "Host a reusable `.github/workflows/release-verified.yml` workflow in `LiLabsAI/.github` that automatically signs APKs/DMGs, generates `SHA256SUMS.txt` + `release-manifest.json`, and updates `lilabs.aliahad.com`.",
      },
    ],
    interactiveDemoType: "architecture",
  },
];

export interface ModelPreset {
  id: string;
  name: string;
  repo: string;
  domain: string;
  baseParamsB: number;
  defaultRank: number;
  defaultQuant: "FP16" | "Q8_0" | "Q4_K_M" | "INT4-AWQ";
  defaultTarget: "Android Vulkan GPU" | "macOS Apple Silicon Metal" | "Cloudflare Workers AI Edge";
  layers: {
    name: string;
    type: string;
    dim: string;
    flopsG: number;
  }[];
  description: string;
}

export const ML_MODEL_PRESETS: ModelPreset[] = [
  {
    id: "gemma-4-e4b",
    name: "Gemma 4 E4B Multimodal",
    repo: "LiLabsAI/offmind",
    domain: "On-Device Multimodal Assistant + Vision Projector",
    baseParamsB: 4.2,
    defaultRank: 16,
    defaultQuant: "Q4_K_M",
    defaultTarget: "Android Vulkan GPU",
    description:
      "Offmind's flagship on-device reasoning and vision backbone. Combines a 4B-class transformer with a dedicated vision patch projector and local Office Memory retrieval.",
    layers: [
      { name: "Input & Vision Patch Embed", type: "Tokenizer + mmproj F16", dim: "[B, 4096, 2560]", flopsG: 1.8 },
      { name: "Grouped-Query Attention", type: "RoPE + KV-Cache GQA", dim: "[32 Layers, 16H/4KV]", flopsG: 4.6 },
      { name: "LoRA Adapter ΔW = B × A", type: "Low-Rank Fine-Tune Matrix", dim: "[2560 → r → 2560]", flopsG: 0.4 },
      { name: "GeGLU Feed-Forward Block", type: "Fused Q4_K_M Dequant + GEMV", dim: "[2560 → 10240]", flopsG: 6.2 },
      { name: "On-Device Output & VAD TTS", type: "Zero-Telemetry Stream", dim: "[Vocab 256K]", flopsG: 0.9 },
    ],
  },
  {
    id: "whisper-v3-edge",
    name: "Whisper-Large-v3-Turbo + Punctuator",
    repo: "LiLabsAI/LiVoice",
    domain: "Edge Speech-to-Text & Punctuation Pipeline",
    baseParamsB: 1.55,
    defaultRank: 8,
    defaultQuant: "FP16",
    defaultTarget: "Cloudflare Workers AI Edge",
    description:
      "LiVoice's ultra-low-latency dictation model running on Cloudflare Workers AI, transforming 16kHz Opus voice streams into punctuated text across Android and macOS.",
    layers: [
      { name: "Log-Mel Spectrogram + VAD", type: "128-Ch Acoustic Frontend", dim: "[1, 128, 3000]", flopsG: 0.6 },
      { name: "Audio Encoder Transformer", type: "32-Layer Self-Attention", dim: "[1500, 1280]", flopsG: 3.1 },
      { name: "Domain Vocabulary LoRA", type: "Code & Tech Jargon Adapter", dim: "[1280 → r → 1280]", flopsG: 0.25 },
      { name: "Fast 4-Layer Decoder", type: "Cross-Attention + Beam Search", dim: "[4 Layers, 1280]", flopsG: 1.2 },
      { id: "out", name: "Punctuated Cursor Injection", type: "Android IME / macOS ⌥", dim: "[UTF-8 Stream]", flopsG: 0.1 } as unknown as { name: string; type: string; dim: string; flopsG: number },
    ],
  },
  {
    id: "agsl-film-neural",
    name: "AGSL Spectral Film Emulation Graph",
    repo: "LiLabsAI/LiEffects",
    domain: "Deterministic GPU/CPU Color Science & Halation",
    baseParamsB: 0.42,
    defaultRank: 32,
    defaultQuant: "FP16",
    defaultTarget: "Android Vulkan GPU",
    description:
      "LiEffects' 40-recipe color grading pipeline (Lucent, Driftglass, Graphite, Nightfall) with bit-exact parity between 120Hz AGSL GPU shaders and C++ tiled CPU renderers.",
    layers: [
      { name: "Wide-Gamut Linear Decode", type: "sRGB / Display-P3 to ACEScg", dim: "[H, W, 4 FP16]", flopsG: 1.1 },
      { name: "3D LUT & Tone Curve Matrix", type: "40 Film Recipes Parametric", dim: "[64³ Tetrahedral]", flopsG: 2.4 },
      { name: "Chromatic Aberration & Halation", type: "Radial Spectral Dispersion", dim: "[5-Tap Kernel]", flopsG: 1.9 },
      { name: "Stochastic Film Grain Synth", type: "Deterministic Hash Noise", dim: "[120 FPS AGSL]", flopsG: 0.8 },
      { name: "Tiled CPU/GPU Parity Export", type: "Full-Res Canvas + JPEG", dim: "[Up to 50MP]", flopsG: 1.4 },
    ],
  },
  {
    id: "coreaudio-dsp-net",
    name: "CoreAudio Process-Tap Psychoacoustic DSP",
    repo: "LiLabsAI/LiSound",
    domain: "Zero-Kext Real-Time macOS Audio Equalizer & Booster",
    baseParamsB: 0.18,
    defaultRank: 4,
    defaultQuant: "FP16",
    defaultTarget: "macOS Apple Silicon Metal",
    description:
      "LiSound's real-time audio processing graph capturing macOS system audio via CATapDescription into a lock-free ring buffer and AVAudioEngine 10-band biquad cascade.",
    layers: [
      { name: "Core Audio Process Tap", type: "Private Aggregate IOProc", dim: "[2Ch, 48kHz, 128f]", flopsG: 0.2 },
      { name: "Lock-Free SPSC Ring Buffer", type: "Atomic Memory Barrier Queue", dim: "[Zero-Alloc]", flopsG: 0.1 },
      { name: "Mid/Side Stereo Width Matrix", type: "Phase-Coherent Expansion", dim: "[L/R ↔ M/S]", flopsG: 0.3 },
      { name: "10-Band Biquad EQ Cascade", type: "31Hz – 16kHz + Golden Boost", dim: "[10× IIR 64-bit]", flopsG: 0.5 },
      { name: "Lookahead Brickwall Limiter", type: "True-Peak Safe Output", dim: "[< 2.6ms Latency]", flopsG: 0.3 },
    ],
  },
];

export const ENGINEERING_BEST_PRACTICES = [
  {
    code: "BP-01",
    title: "Local-First & Zero-Telemetry By Default",
    subtitle: "Privacy as an architectural invariant, not a policy toggle",
    description:
      "Every LI Labs application (`Offmind`, `LiResearch`, `LiSound`, `SoundVault`, `LiEffects`, `LiPlayer`) executes primary compute on the user's own silicon. When edge inference is used (`LiVoice` on Cloudflare Workers AI), audio frames are processed ephemerally in memory with zero prompt or file retention.",
    metrics: ["0 Bytes Telemetry Egress", "100% Offline Capable (7/8 Apps)", "In-Place File Editing"],
    illustration: "/illustrations/neural-forge.svg",
  },
  {
    code: "BP-02",
    title: "Hardware-Sympathetic Quantization & LoRA Modularity",
    subtitle: "Fitting frontier 4B+ multimodal intelligence into mobile & laptop thermal envelopes",
    description:
      "Rather than shipping bloated cloud wrappers, we pair Q4_K_M GGUF weight quantization with hardware-probed KV-cache sizing, Vulkan/Metal compute shaders, and low-rank LoRA adapters ($\\Delta W = B A$). This delivers 35–65 tok/s on consumer phones and Apple Silicon Macs.",
    metrics: ["3.4× Memory Compression (Q4_K_M)", "Auto-Verified Device Context", "Vulkan + ARM64 NEON + Metal"],
    illustration: "/illustrations/edge-voice-dsp.svg",
  },
  {
    code: "BP-03",
    title: "Deterministic GPU/DSP Pipelines & Cryptographic Releases",
    subtitle: "Bit-exact rendering, lock-free real-time audio, and SHA-256 provenance",
    description:
      "Real-time media demands zero GC pauses and deterministic math: `LiSound` bridges Core Audio `IOProc` threads via lock-free ring buffers; `LiEffects` guarantees parity between 120Hz AGSL GPU shaders and C++ CPU exports; and releases ship with `SHA256SUMS.txt` and `release-manifest.json`.",
    metrics: ["< 2.6ms CoreAudio Tap Latency", "120Hz AGSL GPU / C++ Parity", "SHA-256 Verified Artifacts"],
    illustration: "/illustrations/local-research-lab.svg",
  },
];
