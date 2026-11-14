import { markRaw, reactive } from "vue";
import { useSyncExternalStore } from "react";

export type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "lilabs-theme";

export function applyDocumentTheme(theme: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
}

function resolveInitialTheme(): ThemeMode {
  if (typeof window !== "undefined") {
    try {
      const param = new URLSearchParams(window.location.search).get("theme");
      if (param === "light" || param === "dark") return param;
    } catch {
      // Ignore search parse failures in restricted environments
    }
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      // Ignore storage access restrictions (e.g. private mode / sandboxed iframe)
    }
  }
  return "dark";
}

function persistTheme(theme: ThemeMode): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage access restrictions
  }
}

const initialTheme = resolveInitialTheme();
applyDocumentTheme(initialTheme);

export interface ProjectedCluster {
  index: number;
  x: number;
  y: number;
  topX: number;
  topY: number;
  bottomX: number;
  bottomY: number;
  scale: number;
  energy: number;
  accentHex: string;
}

export interface HoveredNeuron {
  id: number;
  x: number;
  y: number;
  dist: number;
  color: string;
}

export interface LabState {
  theme: ThemeMode;
  pulseMode: "neural" | "finetune" | "synapse";
  pulseWaveTime: number;
  pointerSvg: {
    x: number;
    y: number;
    active: boolean;
  };
  projectedClusters: ProjectedCluster[];
  hoveredNeurons: HoveredNeuron[];
  selectedRepoSlug: string;
}

const defaultClusters: ProjectedCluster[] = Array.from({ length: 7 }, (_, i) => ({
  index: i,
  x: 140 + i * 120,
  y: 500,
  topX: 140 + i * 120,
  topY: 360,
  bottomX: 140 + i * 120,
  bottomY: 640,
  scale: 1,
  energy: i === 3 ? 1 : 0.4,
  accentHex:
    i === 2
      ? initialTheme === "light"
        ? "#b45309"
        : "#facc15"
      : i === 3
        ? initialTheme === "light"
          ? "#be185d"
          : "#ec4899"
        : i === 4
          ? initialTheme === "light"
            ? "#b91c1c"
            : "#ef4444"
          : initialTheme === "light"
            ? "#171717"
            : "#ffffff",
}));

const initialSnapshot: LabState = {
  theme: initialTheme,
  pulseMode: "neural",
  pulseWaveTime: 0,
  pointerSvg: {
    x: 500,
    y: 500,
    active: false,
  },
  projectedClusters: defaultClusters,
  hoveredNeurons: [],
  selectedRepoSlug: "offmind",
};

export const vueLabState = reactive<LabState>({
  ...initialSnapshot,
  pointerSvg: { ...initialSnapshot.pointerSvg },
  projectedClusters: [...initialSnapshot.projectedClusters],
  hoveredNeurons: [],
});

let reactSnapshot: LabState = { ...initialSnapshot };
const listeners = new Set<() => void>();

function emitChange() {
  reactSnapshot = {
    ...vueLabState,
    pointerSvg: { ...vueLabState.pointerSvg },
    projectedClusters: [...vueLabState.projectedClusters],
    hoveredNeurons: [...vueLabState.hoveredNeurons],
  };
  for (const listener of listeners) {
    listener();
  }
}

export const labActions = {
  setPulseMode(mode: "neural" | "finetune" | "synapse") {
    vueLabState.pulseMode = mode;
    vueLabState.pulseWaveTime = performance.now();
    emitChange();
  },

  triggerFineTuneWave() {
    vueLabState.pulseWaveTime = performance.now();
    emitChange();
  },

  updateProjectionFrame(
    pointerSvg: { x: number; y: number; active: boolean },
    clusters: ProjectedCluster[],
    hovered: HoveredNeuron[]
  ) {
    vueLabState.pointerSvg.x = pointerSvg.x;
    vueLabState.pointerSvg.y = pointerSvg.y;
    vueLabState.pointerSvg.active = pointerSvg.active;
    vueLabState.projectedClusters = markRaw(clusters);
    vueLabState.hoveredNeurons = markRaw(hovered);
  },

  setSelectedRepo(slug: string) {
    vueLabState.selectedRepoSlug = slug;
    emitChange();
  },

  setTheme(theme: ThemeMode) {
    if (vueLabState.theme === theme) return;
    vueLabState.theme = theme;
    applyDocumentTheme(theme);
    persistTheme(theme);
    emitChange();
  },

  toggleTheme() {
    this.setTheme(vueLabState.theme === "dark" ? "light" : "dark");
  },
};

export function subscribeLabStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLabSnapshot(): LabState {
  return reactSnapshot;
}

export function useLabStore(): LabState {
  return useSyncExternalStore(subscribeLabStore, getLabSnapshot, getLabSnapshot);
}
