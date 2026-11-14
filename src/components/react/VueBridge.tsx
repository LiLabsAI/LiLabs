import React, { useEffect, useRef } from "react";
import { createApp, type App as VueApp, type Component } from "vue";

interface VueBridgeProps {
  component: Component;
  componentProps?: Record<string, unknown>;
  className?: string;
}

/**
 * Mounts a Vue.js 3 Single-File Component inside a React 19 component tree,
 * sharing real-time state through `src/store/labStore.ts`.
 */
export const VueBridge: React.FC<VueBridgeProps> = ({
  component,
  componentProps = {},
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<VueApp | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const app = createApp(component, componentProps);
    app.mount(containerRef.current);
    appRef.current = app;

    return () => {
      if (appRef.current) {
        appRef.current.unmount();
        appRef.current = null;
      }
    };
  }, [component]);

  return <div ref={containerRef} className={className} data-runtime="vue-3.5" />;
};
