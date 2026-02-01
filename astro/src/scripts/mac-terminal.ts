type TerminalCommand = {
  input: string;
  output: string;
};

type TerminalConfig = {
  element: HTMLElement;
  commands: TerminalCommand[];
  loop: boolean;
};

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

async function runTerminal({ element, commands, loop }: TerminalConfig) {
  const log = element.querySelector<HTMLElement>(".terminal-log");
  const inputEl = element.querySelector<HTMLElement>(".current-input");
  const outputEl = element.querySelector<HTMLElement>(".terminal-output");

  if (!log || !inputEl || !outputEl) {
    return;
  }

  let commandIndex = 0;
  let charIndex = 0;
  let typing = true;

  const playback = async (): Promise<void> => {
    while (commandIndex < commands.length) {
      const { input, output } = commands[commandIndex];
      if (typing) {
        inputEl.textContent = input.slice(0, charIndex + 1);
        charIndex += 1;
        if (charIndex >= input.length) {
          typing = false;
          await delay(400);
          outputEl.textContent = output;
          outputEl.classList.remove("opacity-0");
          outputEl.classList.add("fade-in");
          await delay(1200);
          const entry = document.createElement("div");
          entry.className = "space-y-1";
          entry.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="font-semibold text-brand-blue-100">$</span>
              <span class="font-mono text-white">${input}</span>
            </div>
            <div class="ml-6 text-brand-gray-200/90">${output}</div>`;
          log.append(entry);
          inputEl.textContent = "";
          outputEl.textContent = "";
          outputEl.classList.remove("fade-in");
          outputEl.classList.add("opacity-0");
          charIndex = 0;
          typing = true;
          commandIndex += 1;
        } else {
          await delay(60);
        }
      }
    }

    if (loop && commands.length > 0) {
      await delay(2000);
      log.innerHTML = "";
      commandIndex = 0;
      charIndex = 0;
      typing = true;
      await playback();
    }
  };

  await playback();
}

function initTerminals() {
  if (typeof document === "undefined") return;
  const terminals = Array.from(
    document.querySelectorAll<HTMLElement>("[data-terminal-id][data-terminal-commands]"),
  );
  terminals.forEach((element) => {
    try {
      const commandsRaw = element.dataset.terminalCommands ?? "[]";
      const commands = JSON.parse(commandsRaw) as TerminalCommand[];
      const loop = element.dataset.terminalLoop === "true";
      if (!Array.isArray(commands) || !commands.length) {
        return;
      }
      void runTerminal({ element, commands, loop });
    } catch (error) {
      console.warn("Unable to initialise terminal animation", error);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTerminals, { once: true });
} else {
  initTerminals();
}
