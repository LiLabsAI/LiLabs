import { LILABS_ORG, LILABS_REPOS, ML_MODEL_PRESETS } from "./data/repos";

interface Env {
  ASSETS: Fetcher;
  GITHUB_ORG?: string;
  SITE_ORIGIN?: string;
}

interface GitHubRepoApiItem {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  topics?: string[];
  language?: string | null;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const startMs = Date.now();

    try {
      if (url.pathname === "/healthz" || url.pathname === "/api/health") {
        const payload = {
          status: "ok",
          organization: LILABS_ORG.name,
          github: LILABS_ORG.githubUrl,
          worker: "lilabs-web",
          timestamp: new Date().toISOString(),
          observability: { logs: true, traces: true },
        };
        console.log(
          JSON.stringify({
            message: "healthcheck",
            method: request.method,
            path: url.pathname,
            durationMs: Date.now() - startMs,
          })
        );
        return Response.json(payload, {
          headers: {
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      if (url.pathname === "/api/repos") {
        let liveRepos: GitHubRepoApiItem[] | null = null;
        let source = "verified-snapshot";

        try {
          const ghResp = await fetch("https://api.github.com/orgs/LiLabsAI/repos?per_page=100", {
            headers: {
              "User-Agent": "LiLabs-Cloudflare-Worker/1.0 (+https://lilabs.aliahad.com)",
              Accept: "application/vnd.github+json",
            },
            cf: {
              cacheTtl: 300,
              cacheEverything: true,
            },
          } as RequestInit);

          if (ghResp.ok) {
            liveRepos = (await ghResp.json()) as GitHubRepoApiItem[];
            source = "github-live+enriched";
          }
        } catch (err) {
          console.error(
            JSON.stringify({
              message: "github_api_fallback",
              error: err instanceof Error ? err.message : String(err),
            })
          );
        }

        const merged = LILABS_REPOS.map((repo) => {
          const live = liveRepos?.find((r) => r.name.toLowerCase() === repo.name.toLowerCase());
          if (!live) return repo;
          return {
            ...repo,
            description: live.description || repo.description,
            stars: typeof live.stargazers_count === "number" ? live.stargazers_count : repo.stars,
            forks: typeof live.forks_count === "number" ? live.forks_count : repo.forks,
            openIssues: typeof live.open_issues_count === "number" ? live.open_issues_count : repo.openIssues,
            updatedAt: live.pushed_at || live.updated_at || repo.updatedAt,
            homepage: live.homepage || repo.homepage,
            topics: live.topics && live.topics.length > 0 ? live.topics : repo.topics,
          };
        });

        console.log(
          JSON.stringify({
            message: "api_repos_served",
            source,
            count: merged.length,
            durationMs: Date.now() - startMs,
          })
        );

        return Response.json(
          {
            org: LILABS_ORG,
            source,
            syncedAt: new Date().toISOString(),
            repos: merged,
          },
          {
            headers: {
              "Cache-Control": "public, max-age=120, s-maxage=300",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      if (url.pathname === "/api/simulate-finetune") {
        const modelId = url.searchParams.get("model") || "gemma-4-e4b";
        const rank = Math.max(4, Math.min(128, Number(url.searchParams.get("rank") || 16)));
        const quant = url.searchParams.get("quant") || "Q4_K_M";
        const preset = ML_MODEL_PRESETS.find((m) => m.id === modelId) || ML_MODEL_PRESETS[0];

        const quantBits = quant === "FP16" ? 16 : quant === "Q8_0" ? 8 : quant === "Q4_K_M" ? 4.5 : 4.0;
        const baseMemoryMB = Math.round((preset.baseParamsB * 1000 * (quantBits / 8)) * 1.08);
        const trainableParamsM = Number(((rank * 2 * 2560 * 32) / 1e6).toFixed(2));
        const throughputTokPerSec = Number(
          ((16 / quantBits) * (4.5 / Math.max(0.5, preset.baseParamsB)) * 22.4 * (1 - rank * 0.0012)).toFixed(1)
        );

        const epochs = Array.from({ length: 12 }, (_, i) => {
          const step = i + 1;
          const loss = Number((2.35 * Math.exp(-0.24 * step) + 0.34 + (16 / rank) * 0.02).toFixed(3));
          const valAccuracy = Number(Math.min(98.4, 68 + 28 * (1 - Math.exp(-0.28 * step))).toFixed(1));
          return { step, loss, valAccuracy };
        });

        console.log(
          JSON.stringify({
            message: "simulate_finetune",
            modelId: preset.id,
            rank,
            quant,
            durationMs: Date.now() - startMs,
          })
        );

        return Response.json(
          {
            preset: preset.name,
            repo: preset.repo,
            rank,
            quant,
            baseMemoryMB,
            trainableParamsM,
            throughputTokPerSec,
            epochs,
          },
          {
            headers: {
              "Cache-Control": "public, max-age=60",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      // Normalize /products -> /product so both URLs serve the Product Hub
      if (url.pathname === "/products" || url.pathname === "/products/") {
        const rewritten = new URL("/product/", url.origin);
        return env.ASSETS.fetch(new Request(rewritten.toString(), request));
      }
      if (url.pathname === "/product") {
        const rewritten = new URL("/product/", url.origin);
        return env.ASSETS.fetch(new Request(rewritten.toString(), request));
      }

      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error(
        JSON.stringify({
          message: "worker_unhandled_error",
          path: url.pathname,
          error: error instanceof Error ? error.message : String(error),
        })
      );
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
