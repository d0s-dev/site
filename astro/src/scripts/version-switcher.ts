function initVersionSwitcher() {
  if (typeof document === "undefined") return;

  const switchers = Array.from(
    document.querySelectorAll<HTMLElement>("[data-version-switcher]")
  );

  switchers.forEach((container) => {
    const select = container.querySelector<HTMLSelectElement>("[data-version-select]");
    if (!select) return;

    select.addEventListener("change", () => {
      const value = select.value;
      if (!value) return;
      if (value === "current") {
        window.location.href = "/docs";
      } else {
        window.open(value, "_blank", "noopener,noreferrer");
        select.value = "current";
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVersionSwitcher, { once: true });
} else {
  initVersionSwitcher();
}
