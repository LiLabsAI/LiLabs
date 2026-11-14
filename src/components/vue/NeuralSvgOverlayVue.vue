<script setup lang="ts">
import { computed } from "vue";
import { vueLabState } from "../../store/labStore";

const clusters = computed(() => vueLabState.projectedClusters);
const pointer = computed(() => vueLabState.pointerSvg);
const hovered = computed(() => vueLabState.hoveredNeurons);
const isLight = computed(() => vueLabState.theme === "light");
const spineColor = computed(() => (isLight.value ? "#171717" : "#ffffff"));

const forwardPaths = computed(() => {
  const list: Array<{ id: string; d: string; color: string; opacity: number }> = [];
  const pts = clusters.value;
  const mono = spineColor.value;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const mx = ((a.x + b.x) * 0.5).toFixed(1);

    // Primary monochrome spine
    list.push({
      id: `spine-${i}`,
      d: `M ${a.x} ${a.y} C ${mx} ${a.y - 45}, ${mx} ${b.y + 45}, ${b.x} ${b.y}`,
      color: mono,
      opacity: isLight.value ? 0.28 : 0.38,
    });

    // Upper attention arc (Yellow / Monochrome)
    list.push({
      id: `upper-${i}`,
      d: `M ${a.topX} ${a.topY} C ${mx} ${a.topY - 70}, ${mx} ${b.topY - 70}, ${b.topX} ${b.topY}`,
      color:
        i === 1 || i === 2
          ? isLight.value
            ? "#b45309"
            : "#facc15"
          : i === 3
            ? isLight.value
              ? "#be185d"
              : "#ec4899"
            : mono,
      opacity: i >= 1 && i <= 3 ? (isLight.value ? 0.8 : 0.72) : 0.22,
    });

    // Lower backprop gradient arc (Red / Pink / Monochrome)
    list.push({
      id: `lower-${i}`,
      d: `M ${b.bottomX} ${b.bottomY} C ${mx} ${b.bottomY + 70}, ${mx} ${a.bottomY + 70}, ${a.bottomX} ${a.bottomY}`,
      color:
        i === 2
          ? isLight.value
            ? "#b91c1c"
            : "#ef4444"
          : i === 3 || i === 4
            ? isLight.value
              ? "#be185d"
              : "#ec4899"
            : mono,
      opacity: i >= 2 && i <= 4 ? (isLight.value ? 0.78 : 0.68) : 0.2,
    });
  }
  return list;
});

// Long-range residual skip connections across the 3D neural network
const skipArcs = computed(() => {
  const pts = clusters.value;
  if (pts.length < 7) return [];
  const c0 = pts[0];
  const c3 = pts[3];
  const c6 = pts[6];
  return [
    {
      id: "skip-top",
      d: `M ${c0.topX} ${c0.topY} C ${c0.topX + 180} ${c0.topY - 155}, ${c3.topX - 140} ${
        c3.topY - 155
      }, ${c3.topX} ${c3.topY}`,
      stroke: isLight.value ? "#b45309" : "#facc15",
    },
    {
      id: "skip-bot",
      d: `M ${c6.bottomX} ${c6.bottomY} C ${c6.bottomX - 180} ${c6.bottomY + 155}, ${
        c3.bottomX + 140
      } ${c3.bottomY + 155}, ${c3.bottomX} ${c3.bottomY}`,
      stroke: isLight.value ? "#be185d" : "#ec4899",
    },
  ];
});
</script>

<template>
  <svg
    viewBox="0 0 1000 1000"
    preserveAspectRatio="none"
    class="fixed inset-0 w-screen h-dvh pointer-events-none z-20"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="cursorFieldGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" :stop-color="isLight ? '#171717' : '#ffffff'" :stop-opacity="isLight ? 0.08 : 0.16" />
        <stop offset="50%" :stop-color="isLight ? '#b45309' : '#facc15'" :stop-opacity="isLight ? 0.07 : 0.05" />
        <stop offset="100%" :stop-color="isLight ? '#f0f0f0' : '#000000'" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Subtle Ambient 3D SVG Perspective Horizon & Meridian Rings -->
    <g :stroke="isLight ? 'rgba(0,0,0,0.065)' : 'rgba(255,255,255,0.045)'" stroke-width="0.8" fill="none">
      <ellipse cx="500" cy="500" rx="440" ry="210" />
      <ellipse cx="500" cy="500" rx="310" ry="145" stroke-dasharray="3 7" />
      <line x1="60" y1="500" x2="940" y2="500" />
    </g>

    <!-- Long-Range Residual Skip-Connection Filaments -->
    <g fill="none">
      <path
        v-for="arc in skipArcs"
        :key="arc.id"
        :d="arc.d"
        :stroke="arc.stroke"
        stroke-width="1.1"
        stroke-opacity="0.55"
        class="svg-flow-forward"
      />
    </g>

    <!-- 3D Projected Forward & Backprop Bézier Neural Filaments -->
    <g fill="none">
      <path
        v-for="path in forwardPaths"
        :key="path.id"
        :d="path.d"
        :stroke="path.color"
        :stroke-opacity="path.opacity * 0.35"
        stroke-width="0.9"
      />
      <path
        v-for="path in forwardPaths"
        :key="`pulse-${path.id}`"
        :d="path.d"
        :stroke="path.color"
        :stroke-opacity="path.opacity"
        stroke-width="1.35"
        :class="path.id.startsWith('lower') ? 'svg-flow-backward' : 'svg-flow-forward'"
      />
    </g>

    <!-- Interactive Mouse-to-3D-Neuron Magnetic Synaptic Filaments -->
    <g v-if="pointer.active">
      <circle :cx="pointer.x" :cy="pointer.y" r="95" fill="url(#cursorFieldGlow)" />
      <circle
        :cx="pointer.x"
        :cy="pointer.y"
        r="14"
        fill="none"
        :stroke="isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.45)'"
        stroke-width="0.9"
        stroke-dasharray="2 3"
      />
      <circle :cx="pointer.x" :cy="pointer.y" r="2.2" :fill="isLight ? '#b45309' : '#facc15'" />

      <g v-for="node in hovered" :key="`hover-${node.id}`">
        <path
          :d="`M ${pointer.x} ${pointer.y} Q ${(pointer.x + node.x) * 0.5} ${
            (pointer.y + node.y) * 0.5 - 24
          } ${node.x} ${node.y}`"
          fill="none"
          :stroke="node.color"
          :stroke-opacity="Math.max(0.2, 0.85 - node.dist * 0.004)"
          stroke-width="1.15"
        />
        <circle
          :cx="node.x"
          :cy="node.y"
          r="5.5"
          fill="none"
          :stroke="node.color"
          stroke-width="1.1"
          stroke-opacity="0.85"
        />
      </g>
    </g>

    <!-- 3D Projected Layer Cluster Reticles (Pure Minimalist Geometry, Zero Text) -->
    <g v-for="c in clusters" :key="`cluster-${c.index}`">
      <!-- Vertical Tensor Axis Line -->
      <line
        :x1="c.topX"
        :y1="c.topY"
        :x2="c.bottomX"
        :y2="c.bottomY"
        :stroke="isLight ? 'rgba(0,0,0,0.13)' : 'rgba(255,255,255,0.12)'"
        stroke-width="0.8"
        stroke-dasharray="2 4"
      />
      <circle :cx="c.topX" :cy="c.topY" r="2.2" :fill="c.accentHex" fill-opacity="0.8" />
      <circle :cx="c.bottomX" :cy="c.bottomY" r="2.2" :fill="c.accentHex" fill-opacity="0.8" />

      <!-- Concentric Node Ring -->
      <circle
        :cx="c.x"
        :cy="c.y"
        :r="c.index === 3 ? 22 : 12"
        fill="none"
        :stroke="c.accentHex"
        :stroke-opacity="0.4 + c.energy * 0.45"
        stroke-width="1"
        stroke-dasharray="4 3"
      />
      <circle
        :cx="c.x"
        :cy="c.y"
        :r="c.index === 3 ? 3.5 : 2.4"
        :fill="c.accentHex"
      />
    </g>
  </svg>
</template>
