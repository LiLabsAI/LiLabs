import { createElement } from "react";
import { act, fireEvent, render, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "../src/components/react/SiteChrome";
import { labActions, useLabStore, vueLabState } from "../src/store/labStore";

describe("labStore", () => {
  afterEach(() => {
    labActions.setTheme("dark");
    window.localStorage.clear();
  });

  it("synchronizes projection updates across React useLabStore and vueLabState", () => {
    const { result } = renderHook(() => useLabStore());
    expect(Array.isArray(vueLabState.projectedClusters)).toBe(true);

    act(() => {
      labActions.updateProjectionFrame(
        { x: 100, y: 200, active: true },
        [
          {
            index: 0,
            x: 100,
            y: 200,
            topX: 100,
            topY: 160,
            bottomX: 100,
            bottomY: 240,
            scale: 1,
            energy: 0.75,
            accentHex: "#FACC15",
          },
        ],
        [{ id: 1, x: 120, y: 210, dist: 14, color: "#FACC15" }],
      );
    });

    expect(vueLabState.projectedClusters[0]?.index).toBe(0);
    expect(vueLabState.hoveredNeurons[0]?.dist).toBe(14);
    expect(result.current).toBeDefined();
  });

  it("switches between dark and #f0f0f0 light theme across DOM, localStorage, and SiteHeader", () => {
    const { getByRole } = render(createElement(SiteHeader, { activePage: "product" }));
    const toggle = getByRole("button", { name: /switch to light theme/i });

    expect(vueLabState.theme).toBe("dark");
    fireEvent.click(toggle);

    expect(vueLabState.theme).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("lilabs-theme")).toBe("light");

    const switchDark = getByRole("button", { name: /switch to dark theme/i });
    fireEvent.click(switchDark);

    expect(vueLabState.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });
});
