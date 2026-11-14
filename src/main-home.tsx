import React from "react";
import { createRoot } from "react-dom/client";

import "./styles/main.css";
import { enableNonBlockingFonts } from "./utils/fonts";

enableNonBlockingFonts();
import { SiteFooter, SiteHeader } from "./components/react/SiteChrome";
import { NeuralForge3D } from "./components/react/NeuralForge3D";
import { VueBridge } from "./components/react/VueBridge";
import NeuralSvgOverlayVue from "./components/vue/NeuralSvgOverlayVue.vue";

const HomeApp: React.FC = () => {
  return (
    <div className="relative w-screen h-dvh overflow-hidden bg-[#040404] text-white select-none">
      <SiteHeader activePage="home" />
      <main className="w-screen h-dvh overflow-hidden">
        {/* React 19 + Three.js WebGL 3D Neural Network & Model Fine-Tuning Showcase */}
        <NeuralForge3D />

        {/* Vue.js 3.5 + TypeScript Synchronized 3D SVG Synapse & Cursor Field Overlay */}
        <VueBridge component={NeuralSvgOverlayVue} />
      </main>
      <SiteFooter activePage="home" />
    </div>
  );
};

const rootEl = document.getElementById("app");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <HomeApp />
    </React.StrictMode>
  );
}
