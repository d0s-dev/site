function copyButtonsInit() {
  if (typeof document === "undefined" || typeof navigator === "undefined") {
    return;
  }

  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".copy-button"));
  if (!buttons.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy");
      const status = button.closest<HTMLElement>(".copy-wrapper")?.nextElementSibling;
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
        button.classList.add("bg-[#0466C8]", "text-white");
        button.textContent = "Copied!";
        if (status) {
          status.textContent = "Command copied to clipboard.";
        }
        window.setTimeout(() => {
          button.classList.remove("bg-[#0466C8]", "text-white");
          button.textContent = "Copy";
          if (status) {
            status.textContent = "";
          }
        }, 2400);
      } catch (error) {
        if (status) {
          status.textContent = "Copy not permitted. Please copy manually.";
        }
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", copyButtonsInit, { once: true });
} else {
  copyButtonsInit();
}
