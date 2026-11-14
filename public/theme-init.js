(() => {
  try {
    const param = new URLSearchParams(window.location.search).get("theme");
    const saved = window.localStorage.getItem("lilabs-theme");
    const theme =
      param === "light" || param === "dark"
        ? param
        : saved === "light" || saved === "dark"
          ? saved
          : "dark";
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
  } catch {
    // Ignore storage or URL errors during pre-hydration bootstrap.
  }
})();
