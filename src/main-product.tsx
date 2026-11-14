import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import "./styles/main.css";
import { SiteFooter, SiteHeader } from "./components/react/SiteChrome";
import { VueBridge } from "./components/react/VueBridge";
import ProductCatalogVue from "./components/vue/ProductCatalogVue.vue";

gsap.registerPlugin(ScrollTrigger);

const ProductApp: React.FC = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#040404] text-white">
      <SiteHeader activePage="product" />
      <main className="flex-1">
        <VueBridge component={ProductCatalogVue} />
      </main>
      <SiteFooter activePage="product" />
    </div>
  );
};

const rootEl = document.getElementById("app");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <ProductApp />
    </React.StrictMode>
  );
}
