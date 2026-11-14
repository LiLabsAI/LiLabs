import { LILABS_ORG, LILABS_REPOS } from "./data/repos";
import { sanitizeHttpUrl } from "./utils/url";

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

const ORG_NAME_RE = /^[a-zA-Z0-9-]+$/;
const DEFAULT_SITE_ORIGIN = "https://lilabs.aliahad.com";
const HTML_CSP = [
  "default-src 'self'",
  "script-src 'self' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https://avatars.githubusercontent.com",
  "connect-src 'self' https://cloudflareinsights.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ");

const API_CSP = "default-src 'none'; frame-ancestors 'none'";

function resolveGitHubOrg(env: Env): string {
  return env.GITHUB_ORG && ORG_NAME_RE.test(env.GITHUB_ORG) ? env.GITHUB_ORG : "LiLabsAI";
}

function resolveCorsOrigin(request: Request, env: Env): string {
  const configured = env.SITE_ORIGIN || DEFAULT_SITE_ORIGIN;
  const reqOrigin = request.headers.get("Origin");
  if (!reqOrigin) return configured;

  const allowed = new Set([
    configured,
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:5173",
  ]);
  return allowed.has(reqOrigin) ? reqOrigin : configured;
}

function withSecurityHeaders(
  response: Response,
  options: { isApi?: boolean; corsOrigin?: string } = {},
): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("Content-Security-Policy", options.isApi ? API_CSP : HTML_CSP);
  if (options.corsOrigin) {
    headers.set("Access-Control-Allow-Origin", options.corsOrigin);
    headers.append("Vary", "Origin");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const startMs = Date.now();
    const githubOrg = resolveGitHubOrg(env);
    const corsOrigin = resolveCorsOrigin(request, env);

    try {
      if (url.pathname.startsWith("/api/") && request.method === "OPTIONS") {
        return withSecurityHeaders(
          new Response(null, {
            status: 204,
            headers: {
              "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
              "Access-Control-Max-Age": "86400",
            },
          }),
          { isApi: true, corsOrigin },
        );
      }

      if (url.pathname === "/healthz" || url.pathname === "/api/health") {
        const payload = {
          status: "ok",
          organization: LILABS_ORG.name,
          org: githubOrg,
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
          }),
        );
        return withSecurityHeaders(
          Response.json(payload, {
            headers: { "Cache-Control": "no-store" },
          }),
          { isApi: true, corsOrigin },
        );
      }

      if (url.pathname === "/api/repos") {
        if (request.method !== "GET" && request.method !== "HEAD") {
          return withSecurityHeaders(
            Response.json({ error: "Method Not Allowed" }, { status: 405, headers: { Allow: "GET, HEAD, OPTIONS" } }),
            { isApi: true, corsOrigin },
          );
        }

        let liveRepos: GitHubRepoApiItem[] | null = null;
        let source = "verified-snapshot";

        try {
          const init: RequestInit = {
            headers: {
              "User-Agent": "LiLabs-Cloudflare-Worker/1.0 (+https://lilabs.aliahad.com)",
              Accept: "application/vnd.github+json",
            },
            signal: AbortSignal.timeout(3500),
            cf: {
              cacheTtlByStatus: { "200-299": 300, "400-599": 0 },
              cacheEverything: true,
            },
          };

          const ghResp = await fetch(`https://api.github.com/orgs/${githubOrg}/repos?per_page=100`, init);
          if (ghResp.ok) {
            const parsed: unknown = await ghResp.json();
            if (Array.isArray(parsed)) {
              liveRepos = parsed as GitHubRepoApiItem[];
              source = "github-live+enriched";
            }
          }
        } catch (err) {
          console.error(
            JSON.stringify({
              message: "github_api_fallback",
              error: err instanceof Error ? err.message : String(err),
            }),
          );
        }

        const merged = LILABS_REPOS.map((repo) => {
          const live = liveRepos?.find(
            (r) => typeof r?.name === "string" && r.name.toLowerCase() === repo.name.toLowerCase(),
          );
          if (!live) return repo;
          return {
            ...repo,
            description: live.description || repo.description,
            stars: typeof live.stargazers_count === "number" ? live.stargazers_count : repo.stars,
            forks: typeof live.forks_count === "number" ? live.forks_count : repo.forks,
            openIssues: typeof live.open_issues_count === "number" ? live.open_issues_count : repo.openIssues,
            updatedAt: live.pushed_at || live.updated_at || repo.updatedAt,
            homepage: sanitizeHttpUrl(live.homepage) || repo.homepage,
            topics: Array.isArray(live.topics) && live.topics.length > 0 ? live.topics : repo.topics,
          };
        });

        console.log(
          JSON.stringify({
            message: "api_repos_served",
            source,
            count: merged.length,
            durationMs: Date.now() - startMs,
          }),
        );

        const cacheControl =
          source === "github-live+enriched" ? "public, max-age=120, s-maxage=300" : "no-store";

        return withSecurityHeaders(
          Response.json(
            {
              org: LILABS_ORG,
              source,
              syncedAt: new Date().toISOString(),
              repos: merged,
            },
            {
              headers: { "Cache-Control": cacheControl },
            },
          ),
          { isApi: true, corsOrigin },
        );
      }

      if (url.pathname.startsWith("/api/")) {
        return withSecurityHeaders(
          Response.json(
            { error: "Not Found", path: url.pathname },
            { status: 404, headers: { "Cache-Control": "no-store" } },
          ),
          { isApi: true, corsOrigin },
        );
      }

      // Redirect /products aliases permanently while preserving search params (e.g. ?repo=offmind)
      if (url.pathname === "/products" || url.pathname === "/products/") {
        const target = new URL(`/product/${url.search}`, url.origin).toString();
        return withSecurityHeaders(
          new Response(null, {
            status: 308,
            headers: {
              Location: target,
              "Cache-Control": "no-store",
            },
          }),
        );
      }

      if (url.pathname === "/product") {
        const rewritten = new URL(`/product/${url.search}`, url.origin);
        const assetResp = await env.ASSETS.fetch(new Request(rewritten.toString(), request));
        return withSecurityHeaders(assetResp);
      }

      const assetResp = await env.ASSETS.fetch(request);
      return withSecurityHeaders(assetResp);
    } catch (error) {
      console.error(
        JSON.stringify({
          message: "worker_unhandled_error",
          path: url.pathname,
          error: error instanceof Error ? error.message : String(error),
        }),
      );
      return withSecurityHeaders(
        Response.json({ error: "Internal Server Error" }, { status: 500, headers: { "Cache-Control": "no-store" } }),
        { isApi: url.pathname.startsWith("/api/"), corsOrigin },
      );
    }
  },
} satisfies ExportedHandler<Env>;
