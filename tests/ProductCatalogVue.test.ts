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

  it("renders all verified repositories and filters by search query", async () => {
    const wrapper = mount(ProductCatalogVue, { attachTo: document.body });
    await flushPromises();

    expect(wrapper.findAll("article")).toHaveLength(LILABS_REPOS.length);

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

    wrapper.unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
