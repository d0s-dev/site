const LEGACY_BASE =
  "https://github.com/d0s-dev/docs/tree/main/releases/2024.10";
const REDIRECT_DELAY_MS = 5000;

function buildLegacyTarget(pathname: string): string {
  const trimmed = pathname.replace(/^\/docs\/?/, "");
  const base = LEGACY_BASE.replace(/\/$/, "");
  return trimmed.length ? `${base}/${trimmed}` : base;
}

function initLegacyRedirect() {
  if (typeof window === "undefined") return;

  const container = document.querySelector<HTMLElement>(
    "[data-legacy-doc-warning]",
  );
  if (!container) return;

  const pathname = window.location.pathname;
  if (!pathname.startsWith("/docs/")) return;

  const target = buildLegacyTarget(pathname);
  const link = container.querySelector<HTMLAnchorElement>(
    "[data-legacy-doc-link]",
  );
  const countdownEl = container.querySelector<HTMLElement>(
    "[data-legacy-countdown]",
  );
  const cancelButton = container.querySelector<HTMLButtonElement>(
    "[data-legacy-cancel]",
  );

  if (link) {
    link.href = target;
  }

  let remainingMs = REDIRECT_DELAY_MS;
  const tick = () => {
    if (!countdownEl) return;
    countdownEl.textContent = `${Math.ceil(remainingMs / 1000)}`;
  };

  tick();
  container.removeAttribute("hidden");

  const interval = window.setInterval(() => {
    remainingMs -= 1000;
    if (remainingMs <= 0) {
      window.clearInterval(interval);
    }
    tick();
  }, 1000);

  const redirectTimeout = window.setTimeout(() => {
    window.location.replace(target);
  }, REDIRECT_DELAY_MS);

  cancelButton?.addEventListener("click", () => {
    window.clearInterval(interval);
    window.clearTimeout(redirectTimeout);
    if (countdownEl) {
      countdownEl.textContent = "stopped";
    }
    container.setAttribute("data-redirect-cancelled", "true");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLegacyRedirect, {
    once: true,
  });
} else {
  initLegacyRedirect();
}
