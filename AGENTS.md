# LI Labs (`LiLabsAI`) — Design & Engineering Rules

## 1. Visual & Showcase Guardrails

- **Full-Viewport, Zero-Scroll Home Page (`/`)**:
  - The home page must remain a `100vw × 100dvh` (`overflow: hidden`) interactive 3D + 3D SVG neural network and model fine-tuning showcase that scales fluidly to any monitor size or aspect ratio.
  - **No Text on the Canvas**: Never place hero paragraphs, tutorial cards, code blocks, or floating text callouts over the 3D showcase. Text belongs only in the minimal floating header navbar and minimal bottom footer bar.
- **Minimalist Black & White Palette with Signal Accents**:
  - Primary palette is pure monochrome: deep black canvas (`#040404`) with crisp white (`#FFFFFF`) and neutral gray (`#A3A3A3` / `#525252`) 3D nodes, wireframes, and SVG filaments.
  - Use selective accent colors only for active neural/fine-tuning signals and indicators: **Yellow (`#FACC15`)**, **Red (`#EF4444`)**, and **Pink (`#EC4899`)**.
- **Mouse-Driven 3D & 3D SVG Interaction**:
  - Pointer movement must smoothly orbit the 3D scene using frame-rate-independent damping (`alpha = 1 - Math.pow(1 - 0.055, dt * 60)`) and magnetically excite nearby 3D neurons and SVG synaptic filaments.
  - Clicking triggers a fine-tuning wave across the network; dragging rotates 360°; scrolling zooms smoothly.
- **Inspiration Assets vs. Download Lists**:
  - When provided with brand logos or reference images, use them for visual inspiration, navbar branding, favicons, or 3D geometry—never create a logo download list or asset gallery unless explicitly asked.

## 2. Architecture & Build Invariants

- **Hybrid Runtime**: Keep TypeScript, React 19 (`src/components/react/`), Vue.js 3.5 (`src/components/vue/` via `VueBridge.tsx`), and Three.js synchronized through `src/store/labStore.ts`.
- **pnpm v12 Build Scripts**: Maintain `allowBuilds: { esbuild: true, workerd: true }` in `pnpm-workspace.yaml` and `@vitejs/plugin-react: ^5.2.0` (compatible with Vite 7).
- **Cloudflare Workers Deployment (`lilabs-web`)**:
  - Build: `pnpm run build` (`vite build && node scripts/build-cf.mjs`)
  - Deploy: `pnpm run deploy` (`npm run build && cf deploy --prebuilt --mode production`)
  - Target custom domain: `https://lilabs.aliahad.com` (with `observability.enabled = true` and `observability.traces.enabled = true` in `cloudflare.config.ts`).
