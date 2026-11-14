// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { LILABS_REPOS } from "../src/data/repos";
import worker from "../src/worker";

function createEnv(assetImpl?: (input: RequestInfo | URL) => Promise<Response>) {
  return {
    ASSETS: {
      fetch: vi.fn(
        assetImpl ??
          (async (input: RequestInfo | URL) => {
            const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
            return new Response(`<html><body>asset:${url}</body></html>`, {
              status: 200,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            });
          }),
      ),
    } as unknown as Fetcher,
    GITHUB_ORG: "LiLabsAI",
    SITE_ORIGIN: "https://lilabs.aliahad.com",
  };
}

const mockCtx = {
  waitUntil: vi.fn(),
  passThroughOnException: vi.fn(),
  props: {},
} as unknown as ExecutionContext;

describe("worker fetch handler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns health payload on /healthz and /api/health", async () => {
    const env = createEnv();
    for (const path of ["/healthz", "/api/health"]) {
      const res = await worker.fetch(new Request(`https://lilabs.aliahad.com${path}`), env, mockCtx);
      expect(res.status).toBe(200);
      expect(res.headers.get("Cache-Control")).toBe("no-store");
      const data = (await res.json()) as { status: string; timestamp?: string };
      expect(data.status).toBe("ok");
      expect(typeof data.timestamp).toBe("string");
    }
  });

  it("merges live GitHub repository metadata on /api/repos", async () => {
    const env = createEnv();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            name: "OffMind",
            description: "Live updated OffMind description",
            html_url: "https://github.com/LiLabsAI/OffMind",
            homepage: "https://offmind.example.com",
            language: "TypeScript",
            stargazers_count: 42,
            forks_count: 5,
            topics: ["rag", "local-first"],
            updated_at: "2026-11-14T00:00:00Z",
          },
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const res = await worker.fetch(new Request("https://lilabs.aliahad.com/api/repos"), env, mockCtx);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      source: string;
      org: { login: string };
      repos: Array<{ name: string; stars: number; description: string; homepage: string | null }>;
    };
    expect(body.source).toBe("github-live+enriched");
    expect(body.org.login).toBe("LiLabsAI");
    expect(body.repos).toHaveLength(LILABS_REPOS.length);
    const offmind = body.repos.find((r) => r.name.toLowerCase() === "offmind");
    expect(offmind?.stars).toBe(42);
    expect(offmind?.description).toBe("Live updated OffMind description");
    expect(offmind?.homepage).toBe("https://offmind.example.com/");
  });

  it("falls back cleanly to verified-snapshot when GitHub returns an error status", async () => {
    const env = createEnv();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "API rate limit exceeded" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const res = await worker.fetch(new Request("https://lilabs.aliahad.com/api/repos"), env, mockCtx);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { source: string; repos: unknown[] };
    expect(body.source).toBe("verified-snapshot");
    expect(body.repos).toHaveLength(LILABS_REPOS.length);
  });

  it("falls back cleanly to verified-snapshot when GitHub fetch rejects", async () => {
    const env = createEnv();
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network failure"));

    const res = await worker.fetch(new Request("https://lilabs.aliahad.com/api/repos"), env, mockCtx);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { source: string; repos: unknown[] };
    expect(body.source).toBe("verified-snapshot");
    expect(body.repos).toHaveLength(LILABS_REPOS.length);
  });

  it("handles /products without dropping search parameters", async () => {
    const env = createEnv();
    const res = await worker.fetch(new Request("https://lilabs.aliahad.com/products?repo=offmind"), env, mockCtx);
    expect([200, 301, 302, 308]).toContain(res.status);
    if (res.status >= 300) {
      expect(res.headers.get("Location")).toContain("/product/?repo=offmind");
    } else {
      const forwarded = (env.ASSETS.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as Request;
      expect(forwarded.url).toContain("?repo=offmind");
    }
  });

  it("returns 404 JSON for unknown /api/* routes instead of serving HTML", async () => {
    const env = createEnv();
    for (const path of ["/api/does-not-exist", "/api/simulate-finetune"]) {
      const res = await worker.fetch(new Request(`https://lilabs.aliahad.com${path}`), env, mockCtx);
      expect(res.status).toBe(404);
      expect(res.headers.get("Cache-Control")).toBe("no-store");
      expect(env.ASSETS.fetch).not.toHaveBeenCalled();
    }
  });

  it("sanitizes unsafe GitHub homepage URLs and handles non-array API responses safely", async () => {
    const env = createEnv();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            name: "OffMind",
            description: "Valid",
            homepage: "javascript:alert(1)",
            stargazers_count: 10,
            forks_count: 1,
            open_issues_count: 0,
            updated_at: "2026-11-14T00:00:00Z",
            pushed_at: "2026-11-14T00:00:00Z",
          },
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    const sanitizedRes = await worker.fetch(new Request("https://lilabs.aliahad.com/api/repos"), env, mockCtx);
    const sanitizedBody = (await sanitizedRes.json()) as { repos: Array<{ name: string; homepage: string | null }> };
    const offmind = sanitizedBody.repos.find((r) => r.name.toLowerCase() === "offmind");
    expect(offmind?.homepage).toBeNull();

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "unexpected object" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const fallbackRes = await worker.fetch(new Request("https://lilabs.aliahad.com/api/repos"), env, mockCtx);
    expect(fallbackRes.status).toBe(200);
    expect(fallbackRes.headers.get("Cache-Control")).toBe("no-store");
    const fallbackBody = (await fallbackRes.json()) as { source: string };
    expect(fallbackBody.source).toBe("verified-snapshot");
  });

  it("attaches security headers and scoped SITE_ORIGIN CORS on /api/repos", async () => {
    const env = createEnv();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    const res = await worker.fetch(
      new Request("https://lilabs.aliahad.com/api/repos", {
        headers: { Origin: "https://evil.example" },
      }),
      env,
      mockCtx,
    );
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://lilabs.aliahad.com");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Content-Security-Policy")).toContain("frame-ancestors 'none'");

    const optionsRes = await worker.fetch(
      new Request("https://lilabs.aliahad.com/api/repos", { method: "OPTIONS" }),
      env,
      mockCtx,
    );
    expect(optionsRes.status).toBe(204);

    const postRes = await worker.fetch(
      new Request("https://lilabs.aliahad.com/api/repos", { method: "POST" }),
      env,
      mockCtx,
    );
    expect(postRes.status).toBe(405);
  });
});
