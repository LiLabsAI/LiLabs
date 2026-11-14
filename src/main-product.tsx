import React from "react";
import { createRoot } from "react-dom/client";

import "./styles/main.css";
import { SiteFooter, SiteHeader } from "./components/react/SiteChrome";
import { VueBridge } from "./components/react/VueBridge";
import ProductCatalogVue from "./components/vue/ProductCatalogVue.vue";

const ProductApp: React.FC = () => {
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
