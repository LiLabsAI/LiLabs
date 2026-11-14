import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { labActions, useLabStore, vueLabState } from "../src/store/labStore";

describe("labStore", () => {
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
});
