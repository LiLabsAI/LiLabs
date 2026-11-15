import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProductCatalogVue from "../src/components/vue/ProductCatalogVue.vue";
import { LILABS_REPOS } from "../src/data/repos";

describe("ProductCatalogVue", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/product/");
    document.body.style.overflow = "";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ repos: LILABS_REPOS }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  afterEach(() => {
    document.body.style.overflow = "";
    vi.restoreAllMocks();
  });

  it("renders all 8 product repositories without decorative card dots or infra entries and filters by search", async () => {
    const wrapper = mount(ProductCatalogVue, { attachTo: document.body });
    await flushPromises();

    expect(LILABS_REPOS).toHaveLength(8);
    expect(wrapper.findAll("article")).toHaveLength(8);
    expect(wrapper.findAll(".ui-card-dot")).toHaveLength(0);
    expect(wrapper.text()).not.toContain("LiLabs Website");
    expect(wrapper.text()).not.toContain("LiLabsAI/.github");
    expect(wrapper.text()).not.toContain("Org & Infrastructure");

    const search = wrapper.find('input[type="search"], input[placeholder*="Search"]');
    expect(search.exists()).toBe(true);
    await search.setValue("Offmind");
    expect(wrapper.findAll("article")).toHaveLength(1);
    expect(wrapper.text()).toContain("Offmind");

    wrapper.unmount();
  });

  it("opens centered modal from card click, locks body scroll, and closes on Escape", async () => {
    const wrapper = mount(ProductCatalogVue, { attachTo: document.body });
    await flushPromises();

    await wrapper.find("article").trigger("click");
    await flushPromises();

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(document.body.style.overflow).toBe("hidden");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();

    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.style.overflow).toBe("");

    wrapper.unmount();
  });

  it("opens matching modal from ?repo= query parameter on mount", async () => {
    window.history.replaceState({}, "", "/product/?repo=offmind");
    const wrapper = mount(ProductCatalogVue, { attachTo: document.body });
    await flushPromises();

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.textContent).toContain("Offmind");

    wrapper.unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("supports keyboard Enter activation on cards and sanitizes unsafe fetched URLs", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          repos: LILABS_REPOS.map((repo, index) =>
            index === 0 ? { ...repo, homepage: "javascript:alert(1)" } : repo,
          ),
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const wrapper = mount(ProductCatalogVue, { attachTo: document.body });
    await flushPromises();

    const firstCard = wrapper.find("article");
    expect(firstCard.attributes("role")).toBe("button");
    expect(firstCard.attributes("tabindex")).toBe("0");

    await firstCard.trigger("keydown.enter");
    await flushPromises();

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.innerHTML).not.toContain("javascript:");

    // Modified ArrowRight (e.g. Shift+ArrowRight) must not cycle modal repository
    const initialTitle = dialog?.querySelector("h2")?.textContent;
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", shiftKey: true }));
    await flushPromises();
    expect(dialog?.querySelector("h2")?.textContent).toBe(initialTitle);

    // Unmodified ArrowRight advances position indicator cleanly
    const totalLabel = String(LILABS_REPOS.length).padStart(2, "0");
    expect(dialog?.textContent).toContain(`01 / ${totalLabel}`);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    await flushPromises();
    expect(dialog?.textContent).toContain(`02 / ${totalLabel}`);

    wrapper.unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("renders empty filter state and restores catalog on RESET FILTERS click", async () => {
    const wrapper = mount(ProductCatalogVue, { attachTo: document.body });
    await flushPromises();

    const search = wrapper.find('input[type="search"]');
    await search.setValue("definitely-nonexistent-query-xyz");
    expect(wrapper.findAll("article")).toHaveLength(0);
    expect(wrapper.text()).toContain("NO REPOSITORIES MATCH CURRENT FILTER");

    const resetBtn = wrapper.findAll("button").find((b) => b.text().includes("RESET FILTERS"));
    expect(resetBtn).toBeDefined();
    await resetBtn?.trigger("click");
    expect(wrapper.findAll("article")).toHaveLength(LILABS_REPOS.length);

    wrapper.unmount();
  });
});
