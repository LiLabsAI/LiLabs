import { reactive } from "vue";
import { useSyncExternalStore } from "react";

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
  accentHex: i === 2 ? "#facc15" : i === 3 ? "#ec4899" : i === 4 ? "#ef4444" : "#ffffff",
}));

const initialSnapshot: LabState = {
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
    vueLabState.projectedClusters = clusters;
    vueLabState.hoveredNeurons = hovered;
  },

  setSelectedRepo(slug: string) {
    vueLabState.selectedRepoSlug = slug;
    emitChange();
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
