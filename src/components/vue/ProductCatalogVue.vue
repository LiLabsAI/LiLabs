<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { LILABS_REPOS, type LiLabsRepo } from "../../data/repos";
import { labActions, vueLabState } from "../../store/labStore";

const repos = ref<LiLabsRepo[]>([...LILABS_REPOS]);
const selectedCategory = ref<string>("ALL");
const searchQuery = ref<string>("");
const activePipelineStep = ref<number>(0);
const copiedCmd = ref<string | null>(null);

const categories = [
  "ALL",
  "AI & On-Device ML",
  "Audio & Media DSP",
  "Creative & Shaders",
  "Research & Workspace",
  "Org & Infrastructure",
];

const filteredRepos = computed(() => {
  return repos.value.filter((r) => {
    const matchesCat =
      selectedCategory.value === "ALL" || r.category === selectedCategory.value;
    const q = searchQuery.value.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.displayName.toLowerCase().includes(q) ||
      r.tagline.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.primaryLanguage.toLowerCase().includes(q) ||
      r.topics.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });
});

const selectedRepo = computed<LiLabsRepo>(() => {
  return (
    repos.value.find(
      (r) => r.id.toLowerCase() === vueLabState.selectedRepoSlug.toLowerCase()
    ) ?? repos.value[0]
  );
});

function selectRepo(id: string) {
  labActions.setSelectedRepo(id);
  activePipelineStep.value = 0;
  const url = new URL(window.location.href);
  url.searchParams.set("repo", id);
  window.history.replaceState({}, "", url.toString());
}

async function copyCloneCommand(repo: LiLabsRepo) {
  const cmd = `git clone ${repo.url}.git`;
  try {
    await navigator.clipboard.writeText(cmd);
    copiedCmd.value = repo.id;
    setTimeout(() => {
      if (copiedCmd.value === repo.id) copiedCmd.value = null;
    }, 2000);
  } catch {
    // Fallback
  }
}

function isoPoint(x: number, y: number, z: number): [number, number] {
  const ox = 430;
  const oy = 195;
  return [
    Number((ox + (x - y) * 24).toFixed(1)),
    Number((oy + (x + y) * 12 - z * 22).toFixed(1)),
  ];
}

function isoBox(x: number, y: number, z: number, w: number, d: number, h: number) {
  const p001 = isoPoint(x, y, z + h);
  const p101 = isoPoint(x + w, y, z + h);
  const p111 = isoPoint(x + w, y + d, z + h);
  const p011 = isoPoint(x, y + d, z + h);
  const p010 = isoPoint(x, y + d, z);
  const p110 = isoPoint(x + w, y + d, z);
  const p100 = isoPoint(x + w, y, z);
  const fmt = (pts: Array<[number, number]>) => pts.map((p) => `${p[0]},${p[1]}`).join(" ");
  return {
    top: fmt([p001, p101, p111, p011]),
    left: fmt([p011, p111, p110, p010]),
    right: fmt([p101, p111, p110, p100]),
    topCenter: isoPoint(x + w / 2, y + d / 2, z + h),
    baseCenter: isoPoint(x + w / 2, y + d / 2, 0),
  };
}

const repoIsoNodes = computed(() => {
  const nodes = selectedRepo.value.pipelineNodes;
  const positions = [
    { x: -6.2, y: 1.2, w: 2.3, d: 2.3, h: 1.9 },
    { x: -2.0, y: 0.2, w: 2.5, d: 2.5, h: 2.4 },
    { x: 2.2, y: -0.8, w: 2.5, d: 2.5, h: 2.2 },
    { x: 6.4, y: -1.8, w: 2.3, d: 2.3, h: 2.6 },
  ];
  const accents = ["#ffffff", "#facc15", "#ec4899", "#ef4444"];
  return nodes.map((node, i) => {
    const pos = positions[i] ?? positions[0];
    return {
      idx: i,
      node,
      accent: accents[i % accents.length],
      ...isoBox(pos.x, pos.y, 0, pos.w, pos.d, pos.h),
      isActive: activePipelineStep.value === i,
    };
  });
});

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const requestedRepo = params.get("repo");
  if (requestedRepo) {
    const match = repos.value.find(
      (r) =>
        r.id.toLowerCase() === requestedRepo.toLowerCase() ||
        r.name.toLowerCase() === requestedRepo.toLowerCase()
    );
    if (match) {
      labActions.setSelectedRepo(match.id);
    }
  }

  try {
    const res = await fetch("/api/repos");
    if (res.ok) {
      const data = (await res.json()) as { repos?: LiLabsRepo[] };
      if (data.repos && data.repos.length > 0) {
        repos.value = data.repos;
      }
    }
  } catch {
    // Fallback
  }
});
</script>

<template>
  <section class="border-b border-white/10">
    <div class="mx-auto max-w-[1440px] px-6 sm:px-10 py-14 space-y-12">
      <!-- Minimalist Header & Filter Row -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div class="space-y-2">
          <div class="text-[11px] font-mono tracking-[0.24em] uppercase text-neutral-500">
            GITHUB.COM/LILABSAI // 09 REPOSITORIES
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Products &amp; Research Systems
          </h1>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            @click="selectedCategory = cat"
            :class="[
              'px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase border transition-colors cursor-pointer',
              selectedCategory === cat
                ? 'bg-white text-black border-white font-semibold'
                : 'bg-transparent text-neutral-400 border-white/15 hover:border-white/40 hover:text-white',
            ]"
          >
            {{ cat }}
          </button>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search..."
            aria-label="Search repositories"
            class="w-48 px-3 py-1.5 bg-[#0a0a0a] border border-white/15 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#facc15]"
          />
        </div>
      </div>

      <!-- All 9 Repositories Minimalist Monochrome Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        <article
          v-for="(repo, idx) in filteredRepos"
          :key="repo.id"
          @click="selectRepo(repo.id)"
          :class="[
            'p-6 flex flex-col justify-between cursor-pointer transition-colors',
            selectedRepo.id === repo.id
              ? 'bg-[#111111]'
              : 'bg-[#050505] hover:bg-[#0b0b0b]',
          ]"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>0{{ idx + 1 }} / {{ repo.primaryLanguage }}</span>
              <span
                class="w-2 h-2 rounded-full"
                :style="{
                  backgroundColor:
                    selectedRepo.id === repo.id
                      ? '#facc15'
                      : idx % 3 === 0
                        ? '#ffffff'
                        : idx % 3 === 1
                          ? '#ec4899'
                          : '#ef4444',
                }"
              />
            </div>

            <div class="flex items-baseline justify-between gap-2">
              <h2 class="text-xl font-bold text-white tracking-tight">
                {{ repo.name }}
              </h2>
              <span
                v-if="repo.latestRelease"
                class="text-[11px] font-mono text-[#facc15]"
              >
                {{ repo.latestRelease.tag }}
              </span>
            </div>

            <p class="text-xs text-neutral-400 leading-relaxed line-clamp-2">
              {{ repo.tagline }}
            </p>
          </div>

          <div class="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span class="text-neutral-500">{{ repo.platforms.join(" · ") }}</span>
            <a
              :href="repo.url"
              target="_blank"
              rel="noreferrer"
              @click.stop
              class="text-neutral-300 hover:text-white transition-colors"
            >
              GITHUB ↗
            </a>
          </div>
        </article>
      </div>

      <!-- Active Repository 3D Isometric SVG Architecture & Best Practices Inspector -->
      <div class="border border-white/15 bg-[#080808] p-6 sm:p-10 space-y-8">
        <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/10">
          <div class="space-y-2 max-w-3xl">
            <div class="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              <span class="text-[#facc15]">SELECTED REPOSITORY</span>
              <span>/</span>
              <span>{{ selectedRepo.primaryLanguage }}</span>
              <span>/</span>
              <span>{{ selectedRepo.license }}</span>
            </div>
            <h3 class="text-2xl sm:text-4xl font-bold text-white">
              LiLabsAI / {{ selectedRepo.name }}
            </h3>
            <p class="text-sm text-neutral-300 leading-relaxed">
              {{ selectedRepo.description }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 font-mono text-xs shrink-0">
            <button
              type="button"
              @click="copyCloneCommand(selectedRepo)"
              class="px-4 py-2 bg-[#111111] hover:bg-[#1a1a1a] border border-white/20 text-neutral-200 cursor-pointer transition-colors"
            >
              {{
                copiedCmd === selectedRepo.id
                  ? "✓ COPIED"
                  : "$ git clone LiLabsAI/" + selectedRepo.name
              }}
            </button>
            <a
              :href="selectedRepo.url"
              target="_blank"
              rel="noreferrer"
              class="px-4 py-2 bg-white hover:bg-[#facc15] text-black font-semibold transition-colors"
            >
              REPOSITORY ↗
            </a>
          </div>
        </div>

        <!-- 3D Isometric SVG Blueprint + Best Practices Split -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div class="lg:col-span-7 space-y-4">
            <div class="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
              3D ISOMETRIC SVG PIPELINE // {{ selectedRepo.name }}
            </div>

            <div class="bg-[#040404] border border-white/10 p-3">
              <svg
                viewBox="0 0 860 320"
                class="w-full h-auto block select-none"
                role="img"
                :aria-label="`3D Isometric SVG Architecture for ${selectedRepo.name}`"
              >
                <polygon
                  :points="isoBox(-8.2, -3.6, -0.35, 18.2, 7.6, 0.35).top"
                  fill="#090909"
                  stroke="rgba(255,255,255,0.22)"
                  stroke-width="1"
                />
                <polygon
                  :points="isoBox(-8.2, -3.6, -0.35, 18.2, 7.6, 0.35).left"
                  fill="#050505"
                  stroke="rgba(255,255,255,0.12)"
                />
                <polygon
                  :points="isoBox(-8.2, -3.6, -0.35, 18.2, 7.6, 0.35).right"
                  fill="#030303"
                  stroke="rgba(255,255,255,0.1)"
                />

                <!-- Connecting Synaptic Buses -->
                <g v-for="(item, idx) in repoIsoNodes.slice(0, 3)" :key="`bus-${idx}`">
                  <line
                    :x1="item.baseCenter[0]"
                    :y1="item.baseCenter[1] - 16"
                    :x2="repoIsoNodes[idx + 1].baseCenter[0]"
                    :y2="repoIsoNodes[idx + 1].baseCenter[1] - 16"
                    stroke="rgba(255,255,255,0.18)"
                    stroke-width="3"
                  />
                  <line
                    :x1="item.baseCenter[0]"
                    :y1="item.baseCenter[1] - 16"
                    :x2="repoIsoNodes[idx + 1].baseCenter[0]"
                    :y2="repoIsoNodes[idx + 1].baseCenter[1] - 16"
                    :stroke="item.accent"
                    stroke-width="1.6"
                    class="svg-flow-forward"
                  />
                </g>

                <!-- 4 Isometric Node Towers -->
                <g
                  v-for="item in repoIsoNodes"
                  :key="item.node.id"
                  class="cursor-pointer"
                  @click="activePipelineStep = item.idx"
                >
                  <polygon
                    :points="item.left"
                    fill="#121212"
                    :stroke="item.isActive ? item.accent : 'rgba(255,255,255,0.35)'"
                    stroke-width="1.2"
                  />
                  <polygon
                    :points="item.right"
                    fill="#0a0a0a"
                    :stroke="item.isActive ? item.accent : 'rgba(255,255,255,0.25)'"
                    stroke-width="1.2"
                  />
                  <polygon
                    :points="item.top"
                    :fill="item.isActive ? item.accent : '#1f1f1f'"
                    :stroke="item.isActive ? '#ffffff' : 'rgba(255,255,255,0.45)'"
                    stroke-width="1.2"
                  />

                  <line
                    :x1="item.topCenter[0]"
                    :y1="item.topCenter[1]"
                    :x2="item.topCenter[0]"
                    :y2="item.topCenter[1] - 28"
                    :stroke="item.accent"
                    stroke-width="1"
                  />
                  <g :transform="`translate(${item.topCenter[0] - 72}, ${item.topCenter[1] - 66})`">
                    <rect
                      x="0"
                      y="0"
                      width="144"
                      height="36"
                      fill="#060606"
                      :stroke="item.isActive ? item.accent : 'rgba(255,255,255,0.22)'"
                      stroke-width="1"
                    />
                    <text
                      x="8"
                      y="15"
                      fill="#ffffff"
                      font-size="10"
                      font-family="Space Grotesk, sans-serif"
                      font-weight="700"
                    >
                      0{{ item.idx + 1 }}. {{ item.node.label.slice(0, 17) }}
                    </text>
                    <text
                      x="8"
                      y="28"
                      :fill="item.accent"
                      font-size="9"
                      font-family="JetBrains Mono, monospace"
                    >
                      {{ item.node.metric }}
                    </text>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          <div class="lg:col-span-5 space-y-4">
            <div class="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
              PROPOSED BEST PRACTICES // {{ selectedRepo.name }}
            </div>

            <div class="space-y-3">
              <div
                v-for="(bp, bpIdx) in selectedRepo.bestPractices"
                :key="bpIdx"
                class="p-4 bg-[#050505] border border-white/10 space-y-2"
              >
                <div class="flex items-center justify-between text-[10px] font-mono uppercase">
                  <span
                    :style="{
                      color:
                        bpIdx === 0 ? '#facc15' : bpIdx === 1 ? '#ec4899' : '#ef4444',
                    }"
                  >
                    {{ bp.impact }} IMPACT · {{ bp.category }}
                  </span>
                </div>
                <h4 class="text-sm font-bold text-white">{{ bp.title }}</h4>
                <p class="text-xs text-neutral-400 leading-relaxed">
                  {{ bp.proposedUpgrade }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
