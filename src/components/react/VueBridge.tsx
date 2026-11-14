import type React from "react";
import { useEffect, useRef } from "react";
import { type App as VueApp, type Component, createApp, h, reactive } from "vue";

interface VueBridgeProps {
  component: Component;
  componentProps?: Record<string, unknown>;
  className?: string;
}

function syncPropsState(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const key of Object.keys(target)) {
    if (!(key in source)) {
      delete target[key];
    }
  }
  for (const [key, value] of Object.entries(source)) {
    if (target[key] !== value) {
      target[key] = value;
    }
  }
}

/**
 * Mounts a Vue.js 3 Single-File Component inside a React 19 component tree,
 * forwarding prop updates reactively and sharing state through `src/store/labStore.ts`.
 */
export const VueBridge: React.FC<VueBridgeProps> = ({
  component,
  componentProps = {},
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<VueApp | null>(null);
  const latestPropsRef = useRef<Record<string, unknown>>(componentProps);
  const reactivePropsRef = useRef<Record<string, unknown> | null>(null);

  latestPropsRef.current = componentProps;

  useEffect(() => {
    if (!containerRef.current) return;
    const propsState = reactive<Record<string, unknown>>({});
    syncPropsState(propsState, latestPropsRef.current);
    reactivePropsRef.current = propsState;

    const app = createApp({
      name: "VueBridgeHost",
      setup() {
        return () => h(component, { ...propsState });
      },
    });
    app.mount(containerRef.current);
    appRef.current = app;

    return () => {
      reactivePropsRef.current = null;
      if (appRef.current) {
        appRef.current.unmount();
        appRef.current = null;
      }
    };
  }, [component]);

  useEffect(() => {
    if (reactivePropsRef.current) {
      syncPropsState(reactivePropsRef.current, componentProps);
    }
  }, [componentProps]);

  return <div ref={containerRef} className={className} data-runtime="vue-3.5" />;
};
