/** Activates non-blocking print-media Google Fonts stylesheets once fetched without inline script handlers. */
export function enableNonBlockingFonts(): void {
  if (typeof document === "undefined") return;
  const link = document.getElementById("lilabs-fonts") as HTMLLinkElement | null;
  if (link?.media !== "print") return;

  const activate = () => {
    link.media = "all";
  };

  if (link.sheet) {
    activate();
  } else {
    link.addEventListener("load", activate, { once: true });
  }
}
