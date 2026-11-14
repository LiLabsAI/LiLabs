<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { LILABS_REPOS, type LiLabsRepo } from "../../data/repos";
import { labActions } from "../../store/labStore";

const repos = ref<LiLabsRepo[]>([...LILABS_REPOS]);
const selectedCategory = ref<string>("ALL");
const searchQuery = ref<string>("");
const activeModalRepoId = ref<string | null>(null);
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

const modalRepo = computed<LiLabsRepo | null>(() => {
  if (!activeModalRepoId.value) return null;
  return (
    repos.value.find(
      (r) => r.id.toLowerCase() === activeModalRepoId.value?.toLowerCase()
    ) ?? null
  );
});

const modalLanguageEntries = computed(() => {
  if (!modalRepo.value) return [];
  const entries = Object.entries(modalRepo.value.languages);
  const total = entries.reduce((acc, [, bytes]) => acc + bytes, 0) || 1;
  return entries.slice(0, 6).map(([lang, bytes]) => ({
    lang,
    pct: Math.max(0.5, Number(((bytes / total) * 100).toFixed(1))),
  }));
});

function openRepoModal(id: string) {
  activeModalRepoId.value = id;
  labActions.setSelectedRepo(id);
  const url = new URL(window.location.href);
  url.searchParams.set("repo", id);
  window.history.replaceState({}, "", url.toString());
}

function closeRepoModal() {
  activeModalRepoId.value = null;
  const url = new URL(window.location.href);
  url.searchParams.delete("repo");
  window.history.replaceState({}, "", url.toString());
}

function stepModalRepo(delta: number) {
  if (!modalRepo.value || filteredRepos.value.length === 0) return;
  const currentIndex = filteredRepos.value.findIndex(
    (r) => r.id === modalRepo.value?.id
  );
  const nextIndex =
    (currentIndex + delta + filteredRepos.value.length) %
    filteredRepos.value.length;
  openRepoModal(filteredRepos.value[nextIndex].id);
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

function handleKeyDown(e: KeyboardEvent) {
  if (!activeModalRepoId.value) return;
  if (e.key === "Escape") {
    closeRepoModal();
  } else if (e.key === "ArrowRight") {
    stepModalRepo(1);
  } else if (e.key === "ArrowLeft") {
    stepModalRepo(-1);
  }
}

watch(activeModalRepoId, (val) => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = val ? "hidden" : "";
  }
});

onMounted(async () => {
  window.addEventListener("keydown", handleKeyDown);

  const params = new URLSearchParams(window.location.search);
  const requestedRepo = params.get("repo");
  if (requestedRepo) {
    const match = repos.value.find(
      (r) =>
        r.id.toLowerCase() === requestedRepo.toLowerCase() ||
        r.name.toLowerCase() === requestedRepo.toLowerCase()
    );
    if (match) {
      activeModalRepoId.value = match.id;
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
    // Fallback to static verified snapshot
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <section class="min-h-[calc(100dvh-9rem)]">
    <div class="mx-auto max-w-[1440px] px-6 sm:px-10 py-14 space-y-10">
      <!-- Minimalist Header & Filter Row -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div class="space-y-2">
          <div class="text-[11px] font-mono tracking-[0.24em] uppercase text-neutral-500">
            GITHUB.COM/LILABSAI // {{ repos.length }} REPOSITORIES
          </div>
          <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Products &amp; Open-Source Systems
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

      <!-- Repositories Minimalist Monochrome Grid (Click any card to open Modal) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        <article
          v-for="(repo, idx) in filteredRepos"
          :key="repo.id"
          @click="openRepoModal(repo.id)"
          class="group p-6 bg-[#050505] hover:bg-[#0d0d0d] flex flex-col justify-between cursor-pointer transition-colors"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>{{ String(idx + 1).padStart(2, "0") }} / {{ repo.primaryLanguage }}</span>
              <span
                class="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
                :style="{
                  backgroundColor:
                    idx % 3 === 0
                      ? '#facc15'
                      : idx % 3 === 1
                        ? '#ec4899'
                        : '#ef4444',
                }"
              />
            </div>

            <div class="flex items-baseline justify-between gap-2">
              <h2 class="text-xl font-bold text-white tracking-tight group-hover:text-[#facc15] transition-colors">
                {{ repo.displayName }}
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
            <span class="text-neutral-300 group-hover:text-white transition-colors">
              DETAILS ↗
            </span>
          </div>
        </article>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <Teleport to="body">
      <div
        v-if="modalRepo"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="`${modalRepo.displayName} Details`"
        @click.self="closeRepoModal"
      >
        <div
          class="relative w-full max-w-4xl max-h-[90dvh] flex flex-col bg-[#070707] border border-white/20 text-white shadow-2xl overflow-hidden"
        >
          <!-- Modal Top Header -->
          <div class="p-6 sm:p-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-[#0a0a0a]">
            <div class="space-y-2 pr-8">
              <div class="flex flex-wrap items-center gap-2.5 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                <span class="text-[#facc15]">{{ modalRepo.category }}</span>
                <span>/</span>
                <span>{{ modalRepo.primaryLanguage }}</span>
                <span>/</span>
                <span>{{ modalRepo.license }}</span>
                <span v-if="modalRepo.latestRelease" class="px-2 py-0.5 bg-white/10 text-white">
                  {{ modalRepo.latestRelease.tag }}
                </span>
              </div>

              <h2 class="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                {{ modalRepo.displayName }}
                <span class="text-neutral-500 font-normal text-lg sm:text-2xl font-mono">
                  ({{ modalRepo.name }})
                </span>
              </h2>
            </div>

            <button
              type="button"
              @click="closeRepoModal"
              aria-label="Close modal"
              class="absolute top-5 right-5 w-9 h-9 flex items-center justify-center border border-white/15 bg-[#111111] hover:bg-white hover:text-black text-neutral-300 font-mono text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Modal Scrollable Content -->
          <div class="p-6 sm:p-8 overflow-y-auto space-y-8">
            <!-- Overview & Action Bar -->
            <div class="space-y-5">
              <p class="text-sm sm:text-base text-neutral-200 leading-relaxed">
                {{ modalRepo.description }}
              </p>

              <div class="flex flex-wrap items-center gap-3 font-mono text-xs pt-1">
                <a
                  :href="modalRepo.url"
                  target="_blank"
                  rel="noreferrer"
                  class="px-4 py-2 bg-white hover:bg-[#facc15] text-black font-semibold transition-colors"
                >
                  GITHUB REPOSITORY ↗
                </a>
                <a
                  v-if="modalRepo.latestRelease"
                  :href="modalRepo.latestRelease.url"
                  target="_blank"
                  rel="noreferrer"
                  class="px-4 py-2 bg-[#121212] hover:bg-[#1d1d1d] border border-[#facc15]/50 text-[#facc15] transition-colors"
                >
                  DOWNLOAD {{ modalRepo.latestRelease.tag }} ↗
                </a>
                <a
                  v-if="modalRepo.homepage"
                  :href="modalRepo.homepage"
                  target="_blank"
                  rel="noreferrer"
                  class="px-4 py-2 bg-[#121212] hover:bg-[#1d1d1d] border border-white/20 text-white transition-colors"
                >
                  WEBSITE ↗
                </a>
                <button
                  type="button"
                  @click="copyCloneCommand(modalRepo)"
                  class="px-4 py-2 bg-[#111111] hover:bg-[#1a1a1a] border border-white/15 text-neutral-300 cursor-pointer transition-colors"
                >
                  {{
                    copiedCmd === modalRepo.id
                      ? "✓ COPIED CLONE URL"
                      : "$ git clone LiLabsAI/" + modalRepo.name
                  }}
                </button>
              </div>
            </div>

            <!-- Details Section -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 class="text-xs font-mono uppercase tracking-[0.2em] text-white">
                  Details
                </h3>
                <span class="text-[11px] font-mono text-neutral-500">
                  ARCHITECTURE &amp; CAPABILITIES
                </span>
              </div>

              <p class="text-xs font-mono text-neutral-400 bg-[#0c0c0c] border border-white/10 p-3.5 leading-relaxed">
                {{ modalRepo.architectureSummary }}
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="(detail, dIdx) in modalRepo.details"
                  :key="dIdx"
                  class="p-4 bg-[#0b0b0b] border border-white/10 space-y-2"
                >
                  <div class="text-[10px] font-mono uppercase tracking-wider">
                    <span
                      :style="{
                        color:
                          dIdx % 3 === 0
                            ? '#facc15'
                            : dIdx % 3 === 1
                              ? '#ec4899'
                              : '#ef4444',
                      }"
                    >
                      {{ detail.category }}
                    </span>
                  </div>
                  <h4 class="text-sm font-bold text-white">
                    {{ detail.title }}
                  </h4>
                  <p class="text-xs text-neutral-400 leading-relaxed">
                    {{ detail.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Key Highlights -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 class="text-xs font-mono uppercase tracking-[0.2em] text-white">
                  Features &amp; Highlights
                </h3>
                <span class="text-[11px] font-mono text-neutral-500">
                  {{ modalRepo.highlights.length }} ITEMS
                </span>
              </div>

              <ul class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <li
                  v-for="(item, hIdx) in modalRepo.highlights"
                  :key="hIdx"
                  class="flex items-start gap-2.5 p-3 bg-[#0a0a0a] border border-white/10 text-xs text-neutral-300 leading-relaxed"
                >
                  <span
                    class="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                    :style="{
                      backgroundColor:
                        hIdx % 3 === 0
                          ? '#facc15'
                          : hIdx % 3 === 1
                            ? '#ec4899'
                            : '#ef4444',
                    }"
                  />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- System Requirements & Releases Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <!-- Requirements & Languages -->
              <div class="space-y-4">
                <h3 class="text-xs font-mono uppercase tracking-[0.2em] text-white border-b border-white/10 pb-2">
                  Requirements &amp; Stack
                </h3>
                <ul class="space-y-2 text-xs text-neutral-300 font-mono">
                  <li
                    v-for="(req, rIdx) in modalRepo.requirements"
                    :key="rIdx"
                    class="flex items-start gap-2"
                  >
                    <span class="text-[#facc15]">→</span>
                    <span>{{ req }}</span>
                  </li>
                </ul>

                <div class="pt-2 space-y-2">
                  <div class="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    LANGUAGE BREAKDOWN
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="entry in modalLanguageEntries"
                      :key="entry.lang"
                      class="px-2.5 py-1 bg-[#111111] border border-white/10 text-[11px] font-mono text-neutral-300"
                    >
                      {{ entry.lang }} · {{ entry.pct }}%
                    </span>
                  </div>
                </div>
              </div>

              <!-- Verified Releases & Artifacts -->
              <div class="space-y-4">
                <h3 class="text-xs font-mono uppercase tracking-[0.2em] text-white border-b border-white/10 pb-2">
                  Releases &amp; Artifacts
                </h3>

                <div v-if="modalRepo.releases.length > 0" class="space-y-3">
                  <div
                    v-for="rel in modalRepo.releases"
                    :key="rel.tag"
                    class="p-3.5 bg-[#0b0b0b] border border-white/10 space-y-2"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <a
                        :href="rel.url"
                        target="_blank"
                        rel="noreferrer"
                        class="text-xs font-mono font-bold text-[#facc15] hover:underline"
                      >
                        {{ rel.name }} ({{ rel.tag }}) ↗
                      </a>
                      <span class="text-[10px] font-mono text-neutral-500">
                        {{ rel.publishedAt.slice(0, 10) }}
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <span
                        v-for="asset in rel.assets"
                        :key="asset"
                        class="px-2 py-0.5 bg-black border border-white/10 text-[10px] font-mono text-neutral-400"
                      >
                        {{ asset }}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="p-4 bg-[#0b0b0b] border border-white/10 text-xs font-mono text-neutral-500"
                >
                  Source-first repository — clone or browse directly on GitHub.
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Bottom Navigation Footer -->
          <div class="px-6 py-4 border-t border-white/10 bg-[#0a0a0a] flex items-center justify-between text-xs font-mono">
            <button
              type="button"
              @click="stepModalRepo(-1)"
              class="px-3 py-1.5 border border-white/15 text-neutral-300 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
            >
              ← PREVIOUS
            </button>
            <span class="text-neutral-500 hidden sm:inline">
              ESC TO CLOSE · ←/→ TO SWITCH
            </span>
            <button
              type="button"
              @click="stepModalRepo(1)"
              class="px-3 py-1.5 border border-white/15 text-neutral-300 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
