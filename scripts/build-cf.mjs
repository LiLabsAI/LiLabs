import fs from "node:fs/promises";
import path from "node:path";
import * as outputApi from "@cloudflare/build-output-utils";
import * as configApi from "@cloudflare/config";
import * as esbuild from "esbuild";

const root = path.resolve(import.meta.dirname, "..");
const mode = process.env.CF_MODE ?? "production";
const isPreview = process.env.CF_PREVIEW === "1";
const context = { isPreview, mode };

const distDir = path.join(root, "dist");
const requiredArtifacts = ["index.html", path.join("product", "index.html"), "404.html"];
for (const relPath of requiredArtifacts) {
  const fullPath = path.join(distDir, relPath);
  try {
    await fs.access(fullPath);
  } catch {
    throw new Error(`Missing built artifact '${relPath}' in dist/. Run 'vite build' first.`);
  }
}

const loaded = await configApi.loadAndParseConfig(path.join(root, "cloudflare.config.ts"), context);
if (!loaded.result.success) {
  throw new Error(`Invalid cloudflare.config.ts: ${JSON.stringify(loaded.result.error)}`);
}

const configuration = loaded.result.data;
await outputApi.cleanBuildOutputDir(root);

const bundleDir = outputApi.getWorkerBundleDir(root);
await fs.mkdir(bundleDir, { recursive: true });

const mainModule = "worker.mjs";
await esbuild.build({
  entryPoints: [path.join(root, "src/worker.ts")],
  bundle: true,
  format: "esm",
  target: "es2022",
  platform: "neutral",
  outfile: path.join(bundleDir, mainModule),
  external: ["cloudflare:workers"],
  sourcemap: false,
  minify: true,
});

await outputApi.writeRootConfig(root, { accountId: configuration.accountId }, context);
await outputApi.writeWorkerConfig({
  root,
  config: configuration.worker,
  manifest: {
    type: "complete",
    mainModule,
    modules: {
      [mainModule]: { type: "esm" },
    },
  },
});

if (configuration.worker.assets) {
  await outputApi.writeAssets({ root, sourceDirectory: distDir });
}

await outputApi.readBuildOutput(root);
console.log(
  `Built Cloudflare Worker '${configuration.worker.name}' (${mode}${isPreview ? ", preview" : ""}) + static assets into .cloudflare/output/v0/`,
);
