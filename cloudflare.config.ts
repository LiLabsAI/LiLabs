import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  accountId: "4287bb6da0c60bbcc12c01a34718fb86",
  worker: {
    name: "lilabs-web",
    entrypoint: "./src/worker.ts",
    compatibilityDate: "2026-11-12",
    compatibilityFlags: ["nodejs_compat"],
    domains: ["lilabs.aliahad.com"],
    workersDev: true,
    previewUrls: true,
    observability: {
      enabled: true,
      headSamplingRate: 1,
      logs: {
        enabled: true,
        headSamplingRate: 1,
        invocationLogs: true,
        persist: true,
      },
      traces: {
        enabled: true,
        headSamplingRate: 1,
        persist: true,
      },
    },
    assets: {
      notFoundHandling: "404-page",
      runWorkerFirst: ["/api/*", "/healthz", "/products", "/products/"],
    },
    env: {
      ASSETS: bindings.assets(),
      GITHUB_ORG: bindings.text("LiLabsAI"),
      SITE_ORIGIN: bindings.text("https://lilabs.aliahad.com"),
    },
  },
});
