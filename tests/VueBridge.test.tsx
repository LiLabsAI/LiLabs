import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { VueBridge } from "../src/components/react/VueBridge";

describe("VueBridge", () => {
  afterEach(() => {
    cleanup();
  });

  it("mounts, updates props reactively without remounting, and unmounts cleanly", async () => {
    let mountCount = 0;
    const TrackedPanel = defineComponent({
      name: "TrackedPanel",
      props: {
        label: { type: String, required: true },
      },
      setup(props) {
        mountCount += 1;
        return () => h("div", { "data-testid": "vue-panel" }, props.label);
      },
    });

    const { rerender, unmount } = render(
      <VueBridge component={TrackedPanel} componentProps={{ label: "Neural Core" }} />,
    );
    expect(screen.getByTestId("vue-panel").textContent).toBe("Neural Core");
    expect(mountCount).toBe(1);

    rerender(<VueBridge component={TrackedPanel} componentProps={{ label: "Fine-Tune Signal" }} />);
    await nextTick();
    expect(screen.getByTestId("vue-panel").textContent).toBe("Fine-Tune Signal");
    expect(mountCount).toBe(1);

    unmount();
    expect(screen.queryByTestId("vue-panel")).toBeNull();
  });
});
