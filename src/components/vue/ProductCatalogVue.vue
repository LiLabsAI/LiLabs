<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { LILABS_REPOS, type LiLabsRepo } from "../../data/repos";
import { labActions } from "../../store/labStore";
import { sanitizeHttpUrl } from "../../utils/url";

const repos = ref<LiLabsRepo[]>([...LILABS_REPOS]);
const selectedCategory = ref<string>("ALL");
const searchQuery = ref<string>("");
const activeModalRepoId = ref<string | null>(null);
const copiedCmdState = ref<{ id: string; status: "copied" | "failed" } | null>(null);

const modalPanelRef = ref<HTMLElement | null>(null);
const closeBtnRef = ref<HTMLButtonElement | null>(null);

let lastFocusedElement: HTMLElement | null = null;
let fetchAbortController: AbortController | null = null;
let copyResetTimer: ReturnType<typeof setTimeout> | null = null;

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

const safeRepoUrl = computed(() => sanitizeHttpUrl(modalRepo.value?.url));
const safeReleaseUrl = computed(() =>
  sanitizeHttpUrl(modalRepo.value?.latestRelease?.url)
);
const safeHomepageUrl = computed(() => sanitizeHttpUrl(modalRepo.value?.homepage));

function openRepoModal(id: string) {
  if (!activeModalRepoId.value && typeof document !== "undefined") {
    lastFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
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
  const safeUrl = sanitizeHttpUrl(repo.url);
  if (!safeUrl) {
    copiedCmdState.value = { id: repo.id, status: "failed" };
    return;
  }
  const cmd = `git clone ${safeUrl}.git`;
  if (copyResetTimer !== null) {
    clearTimeout(copyResetTimer);
  }
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard unavailable");
    }
    await navigator.clipboard.writeText(cmd);
    copiedCmdState.value = { id: repo.id, status: "copied" };
  } catch {
    copiedCmdState.value = { id: repo.id, status: "failed" };
  }
  copyResetTimer = setTimeout(() => {
    if (copiedCmdState.value?.id === repo.id) {
      copiedCmdState.value = null;
    }
    copyResetTimer = null;
  }, 2200);
}

function handleTabTrap(e: KeyboardEvent) {
  const panel = modalPanelRef.value;
  if (!panel) return;
  const focusable = Array.from(
    panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute("hidden"));
  if (focusable.length === 0) {
    e.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (e.shiftKey) {
    if (active === first || !panel.contains(active)) {
      e.preventDefault();
      last.focus();
    }
  } else if (active === last || !panel.contains(active)) {
    e.preventDefault();
    first.focus();
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (!activeModalRepoId.value) return;

  if (e.key === "Tab") {
    handleTabTrap(e);
    return;
  }

  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

  const target = e.target as HTMLElement | null;
  const tagName = target?.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA") return;

  if (e.key === "Escape") {
    e.preventDefault();
    closeRepoModal();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    stepModalRepo(1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    stepModalRepo(-1);
  }
}

watch(activeModalRepoId, async (val, prevVal) => {
  if (typeof document === "undefined") return;
  document.documentElement.style.overflow = val ? "hidden" : "";
  document.body.style.overflow = val ? "hidden" : "";

  await nextTick();
  if (val && !prevVal) {
    closeBtnRef.value?.focus();
  } else if (
    !val &&
    lastFocusedElement &&
    lastFocusedElement.isConnected &&
    lastFocusedElement !== document.body
  ) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
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

  fetchAbortController = new AbortController();
  try {
    const res = await fetch("/api/repos", { signal: fetchAbortController.signal });
    if (res.ok) {
      const data = (await res.json()) as { repos?: LiLabsRepo[] };
      if (Array.isArray(data.repos) && data.repos.length > 0) {
        repos.value = data.repos.map((repo) => ({
          ...repo,
          homepage: sanitizeHttpUrl(repo.homepage),
        }));
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return;
    }
    // Fallback to static verified snapshot
  }
});

onUnmounted(() => {
  fetchAbortController?.abort();
  fetchAbortController = null;
  if (copyResetTimer !== null) {
    clearTimeout(copyResetTimer);
    copyResetTimer = null;
  }
  window.removeEventListener("keydown", handleKeyDown);
  if (typeof document !== "undefined") {
    document.documentElement.style.overflow = "";
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

      <!-- Repositories Minimalist Monochrome Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        <article
          v-for="(repo, idx) in filteredRepos"
          :key="repo.id"
          role="button"
          tabindex="0"
          :aria-label="`Inspect ${repo.displayName} repository details`"
          @click="openRepoModal(repo.id)"
          @keydown.enter.prevent="openRepoModal(repo.id)"
          @keydown.space.prevent="openRepoModal(repo.id)"
          class="group p-6 bg-[#050505] hover:bg-[#0d0d0d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#facc15] flex flex-col justify-between cursor-pointer transition-colors"
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

    <!-- Concise Product Detail Modal -->
    <Teleport to="body">
      <div
        v-if="modalRepo"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm overscroll-contain"
        role="dialog"
        aria-modal="true"
        :aria-label="`${modalRepo.displayName} Details`"
        @click.self="closeRepoModal"
        @wheel.stop
      >
        <div
          ref="modalPanelRef"
          class="relative w-full max-w-2xl max-h-[85dvh] flex flex-col bg-[#080808] border border-white/20 text-white shadow-2xl overflow-hidden"
        >
          <!-- Modal Header -->
          <div class="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-[#0b0b0b]">
            <div class="space-y-1.5 pr-8">
              <div class="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                <span class="text-[#facc15]">{{ modalRepo.category }}</span>
                <span>·</span>
                <span>{{ modalRepo.primaryLanguage }}</span>
                <span>·</span>
                <span>{{ modalRepo.license }}</span>
                <span
                  v-if="modalRepo.latestRelease"
                  class="px-2 py-0.5 bg-white/10 text-white"
                >
                  {{ modalRepo.latestRelease.tag }}
                </span>
              </div>

              <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {{ modalRepo.displayName }}
              </h2>
            </div>

            <button
              ref="closeBtnRef"
              type="button"
              @click="closeRepoModal"
              aria-label="Close modal"
              class="w-8 h-8 flex items-center justify-center border border-white/15 bg-[#121212] hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#facc15] text-neutral-300 font-mono text-xs transition-colors cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>

          <!-- Modal Body (Concise — just a few sentences + key points) -->
          <div class="p-6 overflow-y-auto overscroll-contain space-y-6">
            <!-- Details (A few concise sentences) -->
            <div class="space-y-2.5">
              <h3 class="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                Details
              </h3>
              <p class="text-sm text-neutral-200 leading-relaxed">
                {{ modalRepo.description }}
              </p>
              <p class="text-xs text-neutral-400 leading-relaxed">
                {{ modalRepo.architectureSummary }}
              </p>
            </div>

            <!-- Short Key Highlights (Top 4) -->
            <div class="space-y-2.5">
              <h3 class="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                Key Features
              </h3>
              <ul class="space-y-2">
                <li
                  v-for="(item, hIdx) in modalRepo.highlights.slice(0, 4)"
                  :key="hIdx"
                  class="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed"
                >
                  <span
                    class="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
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

            <!-- Compact Platform / Requirement Line -->
            <div class="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-400">
              <span>PLATFORMS: {{ modalRepo.platforms.join(" · ") }}</span>
              <span v-if="modalRepo.requirements[0]" class="text-neutral-500">
                {{ modalRepo.requirements[0] }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center gap-2.5 font-mono text-xs pt-1">
              <a
                v-if="safeRepoUrl"
                :href="safeRepoUrl"
                target="_blank"
                rel="noreferrer"
                class="px-4 py-2 bg-white hover:bg-[#facc15] text-black font-semibold transition-colors"
              >
                GITHUB ↗
              </a>
              <a
                v-if="modalRepo.latestRelease && safeReleaseUrl"
                :href="safeReleaseUrl"
                target="_blank"
                rel="noreferrer"
                class="px-4 py-2 bg-[#121212] hover:bg-[#1d1d1d] border border-[#facc15]/50 text-[#facc15] transition-colors"
              >
                RELEASE {{ modalRepo.latestRelease.tag }} ↗
              </a>
              <a
                v-if="safeHomepageUrl"
                :href="safeHomepageUrl"
                target="_blank"
                rel="noreferrer"
                class="px-4 py-2 bg-[#121212] hover:bg-[#1d1d1d] border border-white/20 text-white transition-colors"
              >
                WEBSITE ↗
              </a>
              <button
                type="button"
                @click="copyCloneCommand(modalRepo)"
                class="px-3.5 py-2 bg-[#111111] hover:bg-[#1a1a1a] border border-white/15 text-neutral-300 cursor-pointer transition-colors"
              >
                {{
                  copiedCmdState?.id === modalRepo.id
                    ? copiedCmdState.status === "copied"
                      ? "✓ COPIED"
                      : "COPY FAILED — PRESS CTRL/CMD+C"
                    : "$ git clone LiLabsAI/" + modalRepo.name
                }}
              </button>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-3.5 border-t border-white/10 bg-[#0b0b0b] flex items-center justify-between text-[11px] font-mono">
            <button
              type="button"
              @click="stepModalRepo(-1)"
              class="px-3 py-1 border border-white/15 text-neutral-300 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
            >
              ← PREV
            </button>
            <span class="text-neutral-500">ESC TO CLOSE</span>
            <button
              type="button"
              @click="stepModalRepo(1)"
              class="px-3 py-1 border border-white/15 text-neutral-300 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
