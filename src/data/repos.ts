export interface RepoRelease {
  tag: string;
  name: string;
  publishedAt: string;
  url: string;
  assets: string[];
}

export interface RepoDetailSection {
  category: string;
  title: string;
  description: string;
}

export interface LiLabsRepo {
  id: string;
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  category:
    | "AI & On-Device ML"
    | "Audio & Media DSP"
    | "Creative & Shaders"
    | "Research & Workspace"
    | "Org & Infrastructure";
  platforms: ("Android" | "macOS Apple Silicon" | "Cloudflare Edge" | "Web")[];
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
  requirements: string[];
  highlights: string[];
  architectureSummary: string;
  details: RepoDetailSection[];
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
    "LI Labs is an independent software and AI research initiative founded by Ali Ahad. We build intelligent applications, creative tools, and developer-focused software across Android, macOS Apple Silicon, and the web.",
  stats: {
    publicRepos: 10,
    totalReleases: 24,
    coreLanguages: ["C++", "Kotlin", "Swift", "TypeScript", "AGSL / Vulkan / Metal"],
    license: "GPL-3.0",
  },
};

export const LILABS_REPOS: LiLabsRepo[] = [
  {
    id: "offmind",
    name: "offmind",
    displayName: "Offmind",
    tagline: "Private, on-device Android assistant built around Gemma 4 E4B with local vision and voice.",
    description:
      "Offmind is a private, on-device Android assistant built around Gemma 4 E4B. Chats, memory, attachments, skills, and model inference stay on the phone. The app does not send prompts to any hosted inference service.",
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
    accentColor: "#facc15",
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
    requirements: [
      "Android 13 or newer (minSdk 33)",
      "64-bit ARM device (arm64-v8a)",
      "~4.80 GB storage for Gemma 4 E4B IT Q4 GGUF model",
      "~946 MB storage for optional Gemma 4 E4B vision projector",
      "~8 GB total free space recommended during download & setup",
    ],
    highlights: [
      "Local Gemma 4 E4B inference using the official Q4 GGUF artifact",
      "Text and image conversations with the matching Gemma vision projector",
      "CPU, KleidiAI, OpenMP, and Vulkan backends with per-device recovery and benchmarking",
      "Automatic context sizing that verifies safe context limits on the device",
      "Resumable model downloads with pinned artifact revisions, SHA-256 verification, progress, ETA, pause, and retry controls",
      "Office Memory for optional, private context drawn exclusively from your own conversations",
      "Prompt skills selectable per message without running arbitrary code",
      "Offline voice call mode with on-device VAD, speech recognition, and speech synthesis",
      "Opt-in device actions: set alarms and timers, open the dialer or calendar, and toggle the flashlight from chat",
      "Encrypted local database backed by SQLCipher and encrypted portable backups",
    ],
    architectureSummary:
      "Native runtime built from vendored llama.cpp sources (Android SDK 36, NDK 29.0.13113456, CMake 3.31.6) with CPU, ARM KleidiAI, OpenMP, and Vulkan support, paired with a SQLCipher-encrypted local database.",
    details: [
      {
        category: "INFERENCE & RUNTIME",
        title: "Gemma 4 E4B Q4 GGUF + Vulkan / KleidiAI",
        description:
          "Runs official Gemma 4 E4B IT Q4 GGUF weights (~4.80 GB) and the optional vision projector (~946 MB) locally via vendored llama.cpp with CPU, KleidiAI, OpenMP, and Vulkan backends. Verifies a conservative context window tailored to device RAM.",
      },
      {
        category: "VOICE & MULTIMODAL",
        title: "Offline Voice Call Mode & Image Understanding",
        description:
          "Supports multimodal image + text chats and a dedicated offline voice call mode with on-device voice activity detection (VAD), speech recognition, and speech synthesis.",
      },
      {
        category: "MEMORY & SKILLS",
        title: "Office Memory, Prompt Skills & Opt-In Actions",
        description:
          "Builds optional Office Memory solely from your local conversations, applies per-message Prompt Skills without executing arbitrary code, and triggers opt-in Android intents (alarms, timers, dialer, calendar, flashlight).",
      },
      {
        category: "PRIVACY & STORAGE",
        title: "SQLCipher Database & Zero Telemetry Collectors",
        description:
          "Stores model weights in app-private storage with Android backup disabled. Requests zero usage-statistics, notification, accessibility, location, contacts, calendar, or Health Connect permissions.",
      },
    ],
  },
  {
    id: "LiVoice",
    name: "LiVoice",
    displayName: "LiVoice",
    tagline: "Private voice dictation for your Android phone and your Mac, tuned for English (India).",
    description:
      "Speak naturally. Get clear, ready-to-use text. LiVoice turns your speech into clean, punctuated text and puts it exactly where you were typing — as a keyboard on Android or a background ⌥ Option listener on Mac.",
    category: "AI & On-Device ML",
    platforms: ["Android", "macOS Apple Silicon"],
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
    topics: ["ai", "android", "android-app", "keyboard", "speech-recognition", "speech-to-text", "macos"],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/LiVoice",
    homepage: "https://wovoice.aliahad.com/",
    createdAt: "2026-08-04T16:47:24Z",
    updatedAt: "2026-11-14T10:05:29Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#ec4899",
    featured: true,
    latestRelease: {
      tag: "v1.9.0",
      name: "LiVoice 1.9.0 & Desktop 1.3.0",
      publishedAt: "2026-11-14T10:11:01Z",
      url: "https://github.com/LiLabsAI/LiVoice/releases/tag/v1.9.0",
      assets: [
        "LiVoice-1.9.0.apk",
        "LiVoice-1.9.0.apk.sha256",
        "livoice-desktop-1.3.0.dmg",
        "livoice-desktop-1.3.0.dmg.sha256",
      ],
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
    requirements: [
      "Android 7.0 and later (Android keyboard APK)",
      "macOS (Desktop background ⌥ Option listener DMG)",
      "Free LiVoice account (passwordless 6-digit email sign-in)",
      "10 minutes of dictation per day (resets at midnight UTC / 5:30 AM IST)",
    ],
    highlights: [
      "On Android: system keyboard that dictates into any app (Messages, WhatsApp, Gmail, Notes, Browser)",
      "On Mac: background listener — hold the ⌥ Option key anywhere, speak, let go, and text is typed at your cursor",
      "Tuned for English (India) with special care for South Asian pronunciation, names, numbers, and everyday sentences",
      "Adds punctuation, capital letters, and spacing automatically without speaking 'comma' or 'full stop'",
      "Lightly cleans up filler words like 'um' and obvious grammar slips without rewriting your meaning",
      "Formats spoken numbers ('Four eight two nine' → 4829) and understands 'new line' or 'new paragraph'",
      "Automatic context adapts to the active app and text field, with optional Nearby text snippet guidance",
      "Shared Dictionary and History synced across your Android phone and Mac, with zero voice recording retention",
    ],
    architectureSummary:
      "Native Kotlin Android keyboard and Swift macOS background listener connected to a passwordless account sync service with SHA-256 verified APK and DMG releases.",
    details: [
      {
        category: "ANDROID & MAC WORKFLOW",
        title: "System Keyboard on Android + ⌥ Option Key on Mac",
        description:
          "Tap the microphone on Android or hold ⌥ Option on macOS in any text field. Includes a full offline-capable standard keyboard on Android when not dictating.",
      },
      {
        category: "SPEECH INTELLIGENCE",
        title: "Tuned for English (India) & Smart Formatting",
        description:
          "Built specifically for South Asian pronunciation, names, and numbers. Automatically punctuates, removes filler words, converts spoken digits into numbers, and handles line/paragraph commands.",
      },
      {
        category: "AUTOMATIC CONTEXT",
        title: "App-Aware Tone & Optional Nearby Text Guidance",
        description:
          "Adapts formatting to the writing task of the active app. Separately enabling Nearby text uses a small cursor snippet to guide grammar and tone without saving context to History.",
      },
      {
        category: "SYNC & PRIVACY",
        title: "Shared Dictionary, History & Zero Voice Retention",
        description:
          "Sign in with a 6-digit email code (no password) to sync your custom Dictionary and dictation History across Android and Mac. No ads, no tracking, and your voice is never saved.",
      },
    ],
  },
  {
    id: "LiResearch",
    name: "LiResearch",
    displayName: "LiResearch",
    tagline: "One calm workspace for all your research documents on Mac. Read, edit, and search in place.",
    description:
      "Research ends up scattered across notes, reports, spreadsheets, slide decks, and PDFs. LiResearch brings Markdown, HTML, Word (.docx), PDF, Excel (.xlsx), and PowerPoint (.pptx) into one calm macOS window without moving, copying, converting, or uploading anything.",
    category: "Research & Workspace",
    platforms: ["macOS Apple Silicon"],
    primaryLanguage: "TypeScript",
    languages: {
      "TypeScript": 1302951,
      "CSS": 101782,
      "JavaScript": 23625,
      "HTML": 4442,
    },
    topics: [
      "apple-silicon",
      "docx",
      "electron",
      "local-first",
      "macos",
      "markdown",
      "offline-first",
      "pdf",
      "pptx",
      "typescript",
      "workspace",
      "xlsx",
    ],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/LiResearch",
    homepage: "https://liresearch.aliahad.com/",
    createdAt: "2026-07-24T09:00:15Z",
    updatedAt: "2026-11-14T07:55:41Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#ffffff",
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
    requirements: [
      "Mac with Apple Silicon (M1, M2, M3, M4, or newer)",
      "macOS 12 Monterey or later",
      "100% offline — no account, cloud sync, or internet required",
    ],
    highlights: [
      "Every format in one place: Markdown, HTML, Word (.docx), PDF, Excel (.xlsx), and PowerPoint (.pptx)",
      "In-place editing: opens documents where they already live on disk and saves changes back to the same file",
      "Named Environments ('Personal', 'Thesis', 'Client work') that remember open tabs and folder filters",
      "Full-text cross-document search that finds the exact passage and jumps straight to the match",
      "Markdown editor & side-by-side preview with tables, task lists, code blocks, footnotes, math, Mermaid diagrams, and PDF/Word export",
      "Excel (.xlsx) workbook editor with formulas, multiple sheets, sorting, filters, conditional formatting, and data validation",
      "PowerPoint (.pptx) editor for slides, text, layouts, speaker notes, and full-screen presentation",
      "Word (.docx) rich formatting, comments, and tracked changes + PDF search, outlines, form filling, highlights, stamps, and page tools",
    ],
    architectureSummary:
      "Offline-first Apple Silicon macOS workspace operating directly on local Finder folders with dedicated native editors for Markdown/Mermaid, XLSX, PPTX, DOCX, HTML, and PDF.",
    details: [
      {
        category: "LOCAL-FIRST WORKSPACE",
        title: "Zero File Lock-In & Named Environments",
        description:
          "Files stay in your existing macOS folders without copying or converting. Group folders into named Environments ('Thesis', 'Client work'), filter visible document types per folder, and switch workspaces with preserved tab state.",
      },
      {
        category: "MARKDOWN & DIAGRAMS",
        title: "Live Mermaid, Math, Wide Tables & PDF/Word Export",
        description:
          "Write side-by-side with live rendering for Mermaid diagrams, math equations, footnotes, and code blocks. Click any preview paragraph to jump to that editor line, expand diagrams/mindmaps full-window with pan/zoom, or export to PDF and Word.",
      },
      {
        category: "OFFICE DOCUMENTS",
        title: "Native Excel (.xlsx), PowerPoint (.pptx) & Word (.docx)",
        description:
          "Edit spreadsheets with formulas, conditional formatting, and data validation (with read-only/copy protection for unsupported features); edit and present PowerPoint slides with speaker notes; and edit Word documents with tracked changes.",
      },
      {
        category: "PDF & DEEP SEARCH",
        title: "PDF Annotation & Cross-Document Passage Search",
        description:
          "Read password-protected or standard PDFs, fill forms, highlight, add notes/stamps, and rotate or remove pages. Search inside every document across your workspace at once and jump directly to the matching passage.",
      },
    ],
  },
  {
    id: "LiEffects",
    name: "LiEffects",
    displayName: "LiEffects",
    tagline: "Android photo editor with 40 filter recipes, 59 Adjust controls, 35 Effects & full-res JPEG export.",
    description:
      "An Android photo editor with live colour grading, film effects, nondestructive Canvas framing, and full-resolution JPEG export. Built with Kotlin, Jetpack Compose (minSdk 36 / targetSdk 37), AGSL GPU shaders, and a matching deterministic CPU renderer.",
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
    accentColor: "#ef4444",
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
    requirements: [
      "Android (minSdk 36 / targetSdk 37)",
      "Kotlin & Jetpack Compose with AGSL GPU shader support",
      "Application ID: com.aliahad.photoeffects (supports seamless in-place upgrades)",
    ],
    highlights: [
      "40 original filter recipes: Lucent, Nightfall, Marzipan, Lantern, Estuary, Mulberry, Sunstone, and Halcyon (3 variants each); Driftglass (6); Graphite (8); Black Tie and Old Money (1 each)",
      "Recipe-specific parametric controls: Filter/Sharpen, Driftglass Filter/Intensity/Grain, Lantern Filter/Grain, and Graphite Highlights/Shadows/Aberration",
      "Adjust layer with 8 categories and 59 analytic controls: Light, Color, 6-band HSL, Details, Stylize, vertical tilt-shift Refocus, Optical, and Blur",
      "35 Effects across 10 families: Motes, Lumen, Daymark, Velour, Paperlight, Prism, Nocturne, Marquee, Solstice (light leaks), and Screenprint (halftone ink looks)",
      "Nondestructive Canvas geometry pass (1:1, 9:16, 16:9, 4:5, 5:4, 3:4, 4:3, 2:3, 3:2) with pan/pinch zoom, 90° rotation, flip, and −45°…45° straightening",
      "Progressive 3-stage bottom disclosure panel (Categories → Items → Edit), press-and-hold comparison, Undo history, and full-resolution sRGB JPEG export",
    ],
    architectureSummary:
      "Four-stage nondestructive rendering pipeline (Filter → Adjust → Effect → Canvas) driven by AGSL GPU shaders for live preview and an identical deterministic Kotlin CPU renderer for thumbnails and full-resolution JPEG export.",
    details: [
      {
        category: "40 FILTER RECIPES",
        title: "Parameterized Colour Science & Directional Motion",
        description:
          "Recipes live in catalogue.properties and control exposure gain, contrast, saturation, tonal endpoints, shadow/highlight tinting, radial chromatic separation, sharpening, directional motion blur (Driftglass/Halcyon), and bounded procedural grain.",
      },
      {
        category: "59 ADJUST CONTROLS",
        title: "8 Analytic Adjustment Categories (Zero External LUTs)",
        description:
          "Covers Light & Color pointwise curves (including Whites), 6-band HSL hue/saturation/lightness, Details (unsharp, clarity, dehaze, colour denoise), Stylize (grain, dust, vignette, vintage), vertical tilt-shift Refocus, Optical (fisheye, RGB split, aberration), and 7 Blur modes.",
      },
      {
        category: "35 FINISHING EFFECTS",
        title: "Nocturne, Marquee, Solstice Leaks & Screenprint Halftones",
        description:
          "Single-pass asset-free effects including Marquee dark-blue cinema grades, Solstice elliptical light leaks (Ember, Tidal, Rosette), and Screenprint antialiased circular halftone ink screens (Carbon, Duet, Terracotta) within a 16 B/pixel export budget.",
      },
      {
        category: "CANVAS & EXPORT",
        title: "Affine Geometry Framing & Deterministic CPU Export",
        description:
          "Applies nondestructive aspect-ratio framing, rotation, flip, and straightening around the render graph without rebuilding shaders during gestures, exporting source-limited full-resolution sRGB JPEGs with optional metadata preservation.",
      },
    ],
  },
  {
    id: "LiSound",
    name: "LiSound",
    displayName: "LiSound",
    tagline: "System-wide macOS audio equalizer and volume booster with real-time DSP and no drivers to install.",
    description:
      "A system-wide audio equalizer and volume booster for macOS (Apple Silicon). Written from scratch in Swift/SwiftUI with a pure black & golden UI, Core Audio process taps, lock-free ring buffer DSP, and zero virtual drivers or kexts.",
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
    accentColor: "#facc15",
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
    requirements: [
      "macOS 15.0 or later",
      "Apple Silicon Mac",
      "macOS Audio Recording permission (one-click self-test in Settings → Permissions)",
    ],
    highlights: [
      "Driverless capture: macOS Core Audio process taps capture system output with mute-safe instant teardown on power off",
      "13 built-in presets (Default, Music, Voice, Volume Boost, Bass Boost, Gaming, Movies, TV, Transcription, and more)",
      "Custom presets with rolling 'Custom' scratch state, Save As New / Overwrite / Undo / Delete, and shareable JSON export/import",
      "Graphic EQ with 5, 10, 15, 20, or 31 bands (±12 dB, movable centers, Q 1–3) that interpolates your curve when switching band counts",
      "5 real-time effects (Bass, Fidelity, Ambience, Surround, Dynamic Boost 0–10) + Master gain (−20…+20 dB with peak limiter), balance (±20 dB), and volume leveling (0–4 dB)",
      "Beat-sensitive waveform visualizer with 128 FFT sticks, Lite/Pro pure black & golden views, 5 global hotkeys, and CLI control",
    ],
    architectureSummary:
      "Core Audio process tap (mutes original, excludes self) bound to a private aggregate device IOProc → lock-free ring buffer → AVAudioEngine (AVAudioSourceNode → AVAudioUnitEQ → PeakLimiter → output device).",
    details: [
      {
        category: "CORE AUDIO TAP ENGINE",
        title: "Zero Virtual Drivers or Kernel Extensions",
        description:
          "Binds a macOS Core Audio process tap to your real output device via a private aggregate device and lock-free ring buffer. Powering off destroys the tap and restores normal system audio instantaneously.",
      },
      {
        category: "GRAPHIC EQ & EFFECTS",
        title: "5/10/15/20/31-Band Parametric EQ & Peak Limiter",
        description:
          "Supports ±12 dB per band with movable center frequencies and Q (1–3), interpolating curves across band counts. Pairs with Bass, Fidelity, Ambience, Surround, Dynamic Boost (0–10), and a +20 dB master gain peak limiter.",
      },
      {
        category: "VISUALIZER & OUTPUTS",
        title: "128-Stick FFT Beat Visualizer & Smart Device Routing",
        description:
          "Renders a 128-bar per-band FFT spectrum with fast attack and smooth release. Automatically follows the system default output, prioritizes newly connected headphones/DACs, and cycles outputs via hotkey.",
      },
      {
        category: "CONTROLS & CLI",
        title: "Lite/Pro Menu Bar UI, 5 Global Hotkeys & CLI Flags",
        description:
          "Switch between Lite and Pro views in the menu bar, bind 5 global shortcuts (⌃/⌥ + key), or automate from Terminal with --power=1, --preset=<name>, --set-band-gain=<index>:<dB>, and --view=2.",
      },
    ],
  },
  {
    id: "LiPlayer",
    name: "LiPlayer",
    displayName: "LiPlayer",
    tagline: "Native Apple Silicon Mac media player built with Swift, AppKit, SwiftUI, and libmpv.",
    description:
      "A native Mac media player inspired by PotPlayer's precise playback controls (formerly Video Player). Built with Swift 6.2, AppKit, SwiftUI, and libmpv for Apple Silicon with persistent folder libraries, dual subtitles, frame stepping, and A–B repeat.",
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
    accentColor: "#ffffff",
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
    requirements: [
      "Apple Silicon Mac (macOS 27.2 or later)",
      "Self-contained app bundle — no Homebrew or external mpv required at runtime",
      "Build from source: Xcode 27.2 toolchain (Swift 6.2+) & Python 3",
    ],
    highlights: [
      "Plays local video/audio files and direct HTTP, HTTPS, RTSP, RTMP, and HLS media addresses",
      "Persistent folder Library (⌘⇧O / ⌘⇧L) with expandable subfolders, background browsing, natural ordering, and missing-drive recovery",
      "Queue with natural folder ordering, reorder/remove, repeat, saved .lpqueue (and legacy .vpqueue) files, and local M3U import",
      "Frame stepping, playback speed with pitch correction, A–B repeat, chapters, and screenshots",
      "Embedded and external subtitles with primary/secondary tracks, timing, scale, position, ASS styling, and multilingual rendering",
      "Image adjustments, aspect ratio, rotation, zoom/pan, deinterlacing, audio device selection, and A/V delay",
      "Auto-hiding full-screen controls, compact floating mode, searchable command list, customizable shortcuts, and live codec/dropped-frame inspector",
    ],
    architectureSummary:
      "Native Swift 6.2 + AppKit + SwiftUI interface backed by locked libmpv C libraries and OpenGL video rendering (with HDR-to-SDR tone mapping) and automated Python playback verification.",
    details: [
      {
        category: "PLAYBACK & STREAMS",
        title: "libmpv Engine + Precision PotPlayer-Style Controls",
        description:
          "Bundled with locked native libmpv dependencies so it runs standalone without Homebrew. Supports local media and HTTP/HTTPS/RTSP/RTMP/HLS streams with frame stepping, pitch-corrected speed, A–B loops, and chapters.",
      },
      {
        category: "LIBRARY & QUEUES",
        title: "Persistent Folder Library & .lpqueue Session Files",
        description:
          "Open persistent folder libraries (⌘⇧O) with background directory scanning, natural human file sorting, missing-drive recovery, M3U import, and saved .lpqueue queue files.",
      },
      {
        category: "SUBTITLES & VIDEO",
        title: "Dual Subtitles, ASS Styling & Video Geometry",
        description:
          "Simultaneous primary and secondary subtitle tracks with timing/scale/position controls and ASS rendering. Adjust image brightness/contrast, aspect ratio, rotation, zoom/pan, deinterlacing, and A/V sync offset.",
      },
      {
        category: "INSPECTOR & VERIFICATION",
        title: "Codec Telemetry & Automated Fixture QA Suite",
        description:
          "Real-time inspector reports codec, decoder, resolution, frame rate, and dropped frames. Ships with SHA256SUMS.txt, release-manifest.json, dependency-sources.json, and automated x264/x265/VP9/AV1 playback verification scripts.",
      },
    ],
  },
  {
    id: "ainewshot",
    name: "ainewshot",
    displayName: "AI News Hot",
    tagline: "Watches aihot.news live, translates to English, reads alerts aloud, and produces AI podcasts.",
    description:
      "An Android app that watches aihot.news live, translates everything to English with DeepSeek, pops important news up in front of whatever you're doing with natural Xiaomi MiMo voice reading, and produces 1-, 3-, or 7-day AI podcasts.",
    category: "AI & On-Device ML",
    platforms: ["Android"],
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
    accentColor: "#ec4899",
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
    requirements: [
      "Android 10 or later (tested on Redmi K80 Pro running HyperOS 4 / Android 17)",
      "Direct DeepSeek & Xiaomi MiMo API keys (encrypted on-device with Android Keystore AES-GCM)",
      "No Cloudflare account or sign-in required (legacy macOS 1.0.0 app in macos/ is deprecated)",
    ],
    highlights: [
      "Mirrors aihot.news across 5 tabs (Selected · Hot · Daily · Podcast · Me) with Warm Light, Dark, Auto, and Material You themes",
      "Direct DeepSeek integration: DeepSeek Flash translates and summarizes articles in parallel chunks; V4 Pro writes podcast scripts",
      "Direct Xiaomi MiMo TTS integration: pre-generates natural voice clips before popup alerts appear and streams article narration in ~3s",
      "Live deduplicated alerts (90s foreground check + ~4m allow-while-idle alarm + 15m WorkManager backup) with one alert per event (factId)",
      "Official selected/snapshot + selected/changes sync that updates corrected stories and removes retracted items automatically",
      "AI Podcast studio covering 1, 3, or 7 days (~450 items/day) with 1 or 2 hosts, MiMo Director mode emotion/audio tags, sung intro jingle, and Media3 playback",
      "Built-in HyperOS 4 / Android 17 Reliability Setup that inspects Xiaomi AppOpsManager switches and deep-links to exact system settings",
    ],
    architectureSummary:
      "Native Kotlin Android app calling DeepSeek (Flash / V4 Pro) and Xiaomi MiMo TTS endpoints directly with Android Keystore AES-GCM credential encryption, Media3 audio playback, and Xiaomi HyperOS AppOps reliability diagnostics.",
    details: [
      {
        category: "LIVE FEEDS & TRANSLATION",
        title: "5-Tab aihot.news Mirror & Parallel English Streaming",
        description:
          "Includes Selected (~10–25/day) and All (~360/day) feeds, 48-hour Hot Top 10 with heat sparklines, Newspaper-style Daily/Weekly/Monthly reports, and developer-focused Explain briefs. Full articles translate into English in parallel chunks with an English/中文 toggle.",
      },
      {
        category: "POPUP ALERTS & VOICE",
        title: "Pre-Recorded Xiaomi MiMo Voice Popups",
        description:
          "Wakes the screen and opens a full-screen card over any app with instant pre-generated MiMo speech, a 0.8s accidental-tap guard, 3+ story digest grouping, quiet hours, snooze, and keyword filters.",
      },
      {
        category: "AI PODCAST GENERATOR",
        title: "1 / 3 / 7-Day Multi-Host Episodes with Director Mode",
        description:
          "Merges and ranks ~450 daily stories, writes deep dives and quick hits via DeepSeek V4 Pro, and synthesizes 1- or 2-host audio via Xiaomi MiMo Director mode ([Character], [Scene], [Guidance], inline [laughs]/[pause] tags, and Singing mode intro jingles) saved as AAC in Music/AI News Hot.",
      },
      {
        category: "HYPEROS RELIABILITY",
        title: "Hardware-Verified Wakeups & Xiaomi AppOps Inspector",
        description:
          "Reads Xiaomi miui-framework.jar AppOps (10021 background pop-ups, 10020 lock-screen show, 10008 autostart, Super Island focus notifications) and pairs a 90s foreground service with allow-while-idle alarms and a 30-min watchdog.",
      },
    ],
  },
  {
    id: "SoundVault",
    name: "SoundVault",
    displayName: "SoundVault",
    tagline: "Polished Android audio player with natural folder playlists, timestamp bookmarks, and 10-band EQ.",
    description:
      "A polished audio playback app for Android tailored for personal libraries. Built with Kotlin, Jetpack Compose (Material 3), and Media3 ExoPlayer with recursive natural-order folder playlists, persistent state, timestamp bookmarks, and an in-player 10-band equalizer and bass booster.",
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
    accentColor: "#facc15",
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
    requirements: [
      "Android 12 or later (minSdk 31, targetSdk 36)",
      "Supported formats: mp3, wav, m4a, aac, ogg/oga, opus, flac",
      "Kotlin + Jetpack Compose (Material 3) + Media3 ExoPlayer + Room + DataStore",
    ],
    highlights: [
      "Folder-based playlists (including subfolders) sorted in natural file order ('Track 2' before 'Track 10'), ignoring .m3u and hidden/trashed files",
      "Persistent playback: chosen folder, current track, playback position (saved every few seconds), shuffle/repeat modes, and 0.75×–2.0× speed",
      "Background Media3 MediaSessionService with persistent notification, lock-screen controls, audio-focus pause, and headphone-unplug pause",
      "Timestamp bookmarks stored in Room — save the current position of any track with an optional note and jump back later",
      "Configurable skip-back and skip-forward steps (5 s, 10 s, 20 s, or 1 min) synced with lock-screen and headset buttons",
      "In-player Equalizer & Bass Booster: 0–100% bass boost (Off/Low/Mid/High/Max shortcuts), loudness boost, 16 presets, and 10-band EQ (31 Hz – 16 kHz, ±12 dB) with automatic pre-gain and limiter",
    ],
    architectureSummary:
      "Kotlin + Jetpack Compose (Material 3) audio player powered by Media3 ExoPlayer and MediaSessionService, using DataStore for playback state persistence, Room for timestamp bookmarks, and Kotest for property testing.",
    details: [
      {
        category: "EQUALIZER & BASS BOOSTER",
        title: "In-Player 10-Band EQ, 16 Presets & Auto Limiter",
        description:
          "Processed directly inside SoundVault's player pipeline so it works identically on every phone. Includes a 0–100% bass boost, loudness boost, 16 presets (Subwoofer, Deep Bass, Hip-Hop, Vocal, Phone Speaker, etc.), and a 10-band 31 Hz–16 kHz (±12 dB) EQ with automatic pre-gain and distortion limiter.",
      },
      {
        category: "FOLDER PLAYLISTS",
        title: "Recursive Natural Sorting & Dynamic Auto-Scroll",
        description:
          "Select any device storage folder to build a playlist across all subfolders in natural human order ('Track 2' before 'Track 10'). Automatically keeps the active song scrolled into view and skips unplayable files cleanly.",
      },
      {
        category: "BOOKMARKS & PERSISTENCE",
        title: "Room Timestamp Notes & 3-Second Position Checkpoints",
        description:
          "Save timestamp bookmarks with custom notes on long mixes, audiobooks, or lectures. Folder, track, position, shuffle/repeat, and 0.75×–2.0× speed are restored automatically across app restarts.",
      },
      {
        category: "MEDIA3 & MATERIAL 3",
        title: "Lock-Screen Controls, Custom Skip Steps & Night/Light UI",
        description:
          "Full MediaSessionService integration with independent skip-back/skip-forward intervals (5s, 10s, 20s, 1m), audio focus handling, haptic feedback, track detail sheet, and Night/Light themes.",
      },
    ],
  },
  {
    id: "LiLabs",
    name: "LiLabs",
    displayName: "LiLabs Website",
    tagline: "Official website and interactive 3D & 3D SVG neural network showcase for LI Labs.",
    description:
      "The official website for LI Labs (lilabs.aliahad.com), featuring a full-viewport interactive 3D & 3D SVG neural network and model fine-tuning showcase on the home page and an open-source repository catalog on /product.",
    category: "Org & Infrastructure",
    platforms: ["Web", "Cloudflare Edge"],
    primaryLanguage: "TypeScript",
    languages: {
      "TypeScript": 58420,
      "Vue": 22027,
      "CSS": 4200,
      "HTML": 1950,
    },
    topics: ["ai", "neural-network", "threejs", "webgl", "react", "vue", "typescript", "cloudflare-workers", "gplv3"],
    license: "GPL-3.0",
    url: "https://github.com/LiLabsAI/LiLabs",
    homepage: "https://lilabs.aliahad.com",
    createdAt: "2026-11-14T15:14:00Z",
    updatedAt: "2026-11-14T15:14:30Z",
    stars: 0,
    forks: 0,
    openIssues: 0,
    accentColor: "#ef4444",
    featured: false,
    latestRelease: null,
    releases: [],
    requirements: [
      "Node.js 22+ and pnpm 10+",
      "Cloudflare Workers runtime (lilabs-web)",
      "WebGL2-capable browser for 3D neural showcase",
    ],
    highlights: [
      "Full-viewport (100vw × 100dvh), zero-scroll interactive 3D + 3D SVG neural network and model fine-tuning showcase on /",
      "Hybrid TypeScript runtime combining React 19, Vue.js 3.5, and Three.js WebGL synchronized at 60fps",
      "Minimalist monochrome (#040404 / #FFFFFF) palette with Yellow (#FACC15), Red (#EF4444), and Pink (#EC4899) neural signal pulses",
      "Deployed on Cloudflare Workers at lilabs.aliahad.com with live GitHub API enrichment and full observability traces",
    ],
    architectureSummary:
      "Multi-page Vite 7 + TypeScript application mounting React 19 and Three.js WebGL alongside Vue.js 3.5 components via a shared reactive store, served from Cloudflare Workers.",
    details: [
      {
        category: "3D NEURAL SHOWCASE",
        title: "7-Layer 3D Transformer & Synchronized 3D SVG Filaments",
        description:
          "Renders 206 interactive 3D neurons, 680+ vertex-colored synaptic links, 140 traveling signal pulses, and a central 3D Li monolith with frame-rate-independent pointer orbit and magnetic cursor attraction.",
      },
      {
        category: "HYBRID RUNTIME",
        title: "React 19 + Vue.js 3.5 + Three.js on Cloudflare Workers",
        description:
          "Synchronizes 3D WebGL camera projections with a reactive Vue 3.5 SVG overlay and serves live repository metadata from the Cloudflare Edge at lilabs.aliahad.com.",
      },
    ],
  },
  {
    id: "dot-github",
    name: ".github",
    displayName: "LiLabsAI/.github",
    tagline: "Organization profile, banner graphics, and open-source governance for LI Labs.",
    description:
      "Organization profile repository for https://github.com/LiLabsAI containing the public organization README, brand banner assets, and links to flagship LI Labs projects.",
    category: "Org & Infrastructure",
    platforms: ["Web"],
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
    accentColor: "#ffffff",
    featured: false,
    latestRelease: null,
    releases: [],
    requirements: ["GitHub Organization Profile (profile/README.md)"],
    highlights: [
      "Official GitHub organization profile README (profile/README.md) and banner graphics (profile/assets/banner.png)",
      "Presents LI Labs' core focus areas: Artificial Intelligence & Machine Learning, Software Engineering, Mobile & Desktop Applications, and R&D",
      "Links flagship open-source projects (LiEffects, LiResearch, Offmind, AI News Hot) and official domains (lilabs.aliahad.com, aliahad.com)",
    ],
    architectureSummary:
      "GitHub organization metadata repository rendering the public profile header, mission overview, and project directory on github.com/LiLabsAI.",
    details: [
      {
        category: "ORGANIZATION PROFILE",
        title: "Public Landing Profile on github.com/LiLabsAI",
        description:
          "Houses profile/README.md and profile/assets/banner.png displayed at the top of the LiLabsAI GitHub organization page.",
      },
      {
        category: "OPEN-SOURCE IDENTITY",
        title: "Unified GPLv3 Licensing & Project Directory",
        description:
          "Connects developers to LI Labs' flagship Android, macOS Apple Silicon, and AI research repositories founded by Ali Ahad.",
      },
    ],
  },
];

