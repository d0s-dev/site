import type { ChartData } from "chart.js";
import Chart from "chart.js/auto";
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { OverviewPanel } from "../components/OverviewPanel";
import { ScansPanel } from "../components/ScansPanel";
import { SBOMsPanel } from "../components/SBOMsPanel";

// Track React roots for cleanup
let overviewRoot: Root | null = null;
let scansRoot: Root | null = null;
let sbomsRoot: Root | null = null;

type CatalogViewModel = {
  id: string;
  name: string;
  summary?: string;
  labels?: string[];
  providers?: string[];
  imageCount?: number;
  cves?: { critical: number; high: number; medium: number; low: number };
  latestVersion?: string;
  links?: { helm?: string; documentation?: string; git?: string; website?: string };
  searchText?: string;
};

type ManifestResult = {
  source: "remote" | "cache" | "mock" | "local";
  fetchedAt: number;
  manifest: {
    id: string;
    name: string;
    summary?: string;
    description: string;
    category?: string;
    labels?: string[];
    upstream: {
      helm: { repo: string; chart: string; documentation?: string };
      git?: string;
      website?: string;
    };
    ociRegistry?: string;
    versions: Array<{
      version: string;
      chartVersion: string;
      appVersion?: string;
      released?: string;
      ociPackage?: Record<string, string>;
      images?: Array<{
        name: string;
        digest?: string;
        platforms?: string[];
      }>;
      aggregates?: { critical: number; high: number; medium: number; low: number };
    }>;
    lastUpdated: string;
  };
};

type CatalogSourceMap = Record<ManifestResult["source"], string>;

type OverlayState = {
  appId: string | null;
  manifestResult: ManifestResult | null;
  providerKey: string | null;
  versionIndex: number;
  imageIndex: number;
  tab: "overview" | "scans" | "sboms";
  viewModel: CatalogViewModel | null;
};

const sourceLabelMap: CatalogSourceMap = {
  remote: "Live GitHub data",
  cache: "Cached GitHub data",
  mock: "Mock dataset",
  local: "Local dev server",
};

const severityKeys = ["critical", "high", "medium", "low"] as const;

type SeverityKey = (typeof severityKeys)[number];

type SeveritySummary = Partial<Record<SeverityKey, number>>;

type OverlayElements = {
  overlay: HTMLElement | null;
  overlayBackdrop: HTMLElement | null;
  overlayClose: HTMLElement | null;
  overlayTitle: HTMLElement | null;
  overlaySummary: HTMLElement | null;
  overlayLabels: HTMLElement | null;
  overlaySource: HTMLElement | null;
  overlayUpdated: HTMLElement | null;
  overlayLatest: HTMLElement | null;
  overlayImages: HTMLElement | null;
  overlayProviders: HTMLElement | null;
  overlayLoading: HTMLElement | null;
  overlayStatus: HTMLElement | null;
  overlayError: HTMLElement | null;
  overlayErrorMessage: HTMLElement | null;
  overlayContent: HTMLElement | null;
  providerSelect: HTMLSelectElement | null;
  versionSelect: HTMLSelectElement | null;
  tabButtons: HTMLButtonElement[];
  tabContent: HTMLElement | null;
};

function buildOverlayElements(): OverlayElements {
  const overlay = document.querySelector<HTMLElement>("[data-manifest-overlay]");

  return {
    overlay,
    overlayBackdrop: overlay?.querySelector<HTMLElement>("[data-overlay-backdrop]") ?? null,
    overlayClose: overlay?.querySelector<HTMLElement>("[data-overlay-close]") ?? null,
    overlayTitle: overlay?.querySelector<HTMLElement>("[data-overlay-title]") ?? null,
    overlaySummary: overlay?.querySelector<HTMLElement>("[data-overlay-summary]") ?? null,
    overlayLabels: overlay?.querySelector<HTMLElement>("[data-overlay-labels]") ?? null,
    overlaySource: overlay?.querySelector<HTMLElement>("[data-overlay-source]") ?? null,
    overlayUpdated: overlay?.querySelector<HTMLElement>("[data-overlay-updated]") ?? null,
    overlayLatest: overlay?.querySelector<HTMLElement>("[data-overlay-latest]") ?? null,
    overlayImages: overlay?.querySelector<HTMLElement>("[data-overlay-images]") ?? null,
    overlayProviders: overlay?.querySelector<HTMLElement>("[data-overlay-providers]") ?? null,
    overlayLoading: overlay?.querySelector<HTMLElement>("[data-overlay-loading]") ?? null,
    overlayStatus: overlay?.querySelector<HTMLElement>("[data-overlay-status]") ?? null,
    overlayError: overlay?.querySelector<HTMLElement>("[data-overlay-error]") ?? null,
    overlayErrorMessage:
      overlay?.querySelector<HTMLElement>("[data-overlay-error-message]") ?? null,
    overlayContent: overlay?.querySelector<HTMLElement>("[data-overlay-content]") ?? null,
    providerSelect: overlay?.querySelector<HTMLSelectElement>("[data-overlay-provider]") ?? null,
    versionSelect: overlay?.querySelector<HTMLSelectElement>("[data-overlay-version]") ?? null,
    tabButtons: overlay
      ? Array.from(overlay.querySelectorAll<HTMLButtonElement>("[data-overlay-tab]"))
      : [],
    tabContent: overlay?.querySelector<HTMLElement>("[data-overlay-tab-content]") ?? null,
  };
}

function parseJsonPayload<T = unknown>(selector: string): T | null {
  const element = document.querySelector<HTMLScriptElement>(selector);
  if (!element?.textContent) {
    return null;
  }

  try {
    return JSON.parse(element.textContent) as T;
  } catch (error) {
    console.warn("Unable to parse JSON payload", selector, error);
    return null;
  }
}

function buildCatalogViewModelMap(): Map<string, CatalogViewModel> {
  const payload = parseJsonPayload<CatalogViewModel[]>("#catalog-view-models");
  const map = new Map<string, CatalogViewModel>();

  if (Array.isArray(payload)) {
    for (const entry of payload) {
      if (entry?.id) {
        map.set(entry.id, entry);
      }
    }
  }

  return map;
}

function initFilters() {
  const labelButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-filter-label]"),
  );
  const providerButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-filter-provider]"),
  );
  const labelSelect = document.querySelector<HTMLSelectElement>("[data-filter-label-select]");
  const providerSelect = document.querySelector<HTMLSelectElement>("[data-filter-provider-select]");
  const searchInput = document.querySelector<HTMLInputElement>("[data-filter-search]");
  const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-catalog-card]"));
  const emptyState = document.querySelector<HTMLElement>("[data-empty-state]");
  const activeCountTarget = document.querySelector<HTMLElement>("[data-active-count]");

  const state = {
    label: labelSelect?.value ?? "all",
    provider: providerSelect?.value ?? "all",
    search: (searchInput?.value ?? "").trim().toLowerCase(),
  };

  const setActiveButton = (buttons: HTMLButtonElement[], value: string) => {
    buttons.forEach((button) => {
      const isActive =
        button.dataset.filterLabel === value || button.dataset.filterProvider === value;
      button.dataset.active = isActive ? "true" : "false";
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const applyFilters = () => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const labels = (card.dataset.labels || "").split(",").filter(Boolean);
      const providers = (card.dataset.providerList || "").split(",").filter(Boolean);
      const searchText = (card.dataset.searchText || "").toLowerCase();

      const matchesLabel = state.label === "all" || labels.includes(state.label);

      // Dynamic provider matching - checks if provider is in the providers array
      let matchesProvider = true;
      if (state.provider !== "all") {
        matchesProvider = providers.includes(state.provider);
      }

      const matchesSearch = !state.search || searchText.includes(state.search);
      const shouldShow = matchesLabel && matchesProvider && matchesSearch;

      card.classList.toggle("hidden", !shouldShow);
      card.setAttribute("aria-hidden", shouldShow ? "false" : "true");

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("hidden", visibleCount !== 0);
    }
    if (activeCountTarget) {
      activeCountTarget.textContent = visibleCount.toLocaleString();
    }
  };

  const setLabel = (value: string) => {
    state.label = value;
    if (labelButtons.length) {
      setActiveButton(labelButtons, value);
    }
    if (labelSelect && labelSelect.value !== value) {
      labelSelect.value = value;
    }
    applyFilters();
  };

  const setProvider = (value: string) => {
    state.provider = value;
    if (providerButtons.length) {
      setActiveButton(providerButtons, value);
    }
    if (providerSelect && providerSelect.value !== value) {
      providerSelect.value = value;
    }
    applyFilters();
  };

  if (labelButtons.length) {
    labelButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.filterLabel;
        if (!value) return;
        setLabel(value);
      });
    });
    setActiveButton(labelButtons, state.label);
  }

  if (labelSelect) {
    labelSelect.addEventListener("change", (event) => {
      const value = String((event.target as HTMLSelectElement).value || "all");
      setLabel(value);
    });
  }

  if (providerButtons.length) {
    providerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.filterProvider;
        if (!value) return;
        setProvider(value);
      });
    });
    setActiveButton(providerButtons, state.provider);
  }

  if (providerSelect) {
    providerSelect.addEventListener("change", (event) => {
      const value = String((event.target as HTMLSelectElement).value || "all");
      setProvider(value);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const value = String((event.target as HTMLInputElement).value ?? "").toLowerCase();
      state.search = value.trim();
      applyFilters();
    });
  }

  applyFilters();
}

function initChart() {
  const chartCanvas = document.querySelector<HTMLCanvasElement>("[data-cve-chart]");
  if (!chartCanvas) return;

  const payload = parseJsonPayload<ChartData<"doughnut", number[], string>>("#catalog-cve-data");
  if (!payload) return;

  const context = chartCanvas.getContext("2d");
  if (!context) return;

  try {
    new Chart(context, {
      type: "doughnut",
      data: payload,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}`,
            },
          },
        },
      },
    });
  } catch (error) {
    console.warn("Unable to render Chart.js payload", error);
  }
}

function formatSeverity(summary: SeveritySummary): string {
  return severityKeys.map((key) => summary?.[key] ?? 0).join(" / ");
}

function renderTabContent(overlayState: OverlayState, elements: OverlayElements): void {
  const { tabContent } = elements;

  if (!tabContent) return;

  tabContent.innerHTML = "";

  const manifest = overlayState.manifestResult?.manifest;
  // V2 manifests have flat versions[], no provider nesting
  const versions = manifest?.versions ?? [];
  const selectedVersion = versions[overlayState.versionIndex] ?? null;
  const images = selectedVersion?.images ?? [];
  const image = images[overlayState.imageIndex] ?? null;

  if (!manifest || !versions.length) {
    const message = document.createElement("p");
    message.className = "text-sm text-[#5C677D]";
    message.textContent = "No version data available for this package.";
    tabContent.append(message);
    return;
  }

  if (!selectedVersion) {
    const message = document.createElement("p");
    message.className = "text-sm text-[#5C677D]";
    message.textContent = "No published versions available for this provider.";
    tabContent.append(message);
    return;
  }

  if (!image) {
    const message = document.createElement("p");
    message.className = "text-sm text-[#5C677D]";
    message.textContent = "No images found for the selected version.";
    tabContent.append(message);
    return;
  }

  if (overlayState.tab === "overview") {
    // Mount React OverviewPanel component
    const wrapper = document.createElement("div");
    wrapper.id = "overview-panel-root";
    tabContent.append(wrapper);

    // Clean up previous root if exists
    if (overviewRoot) {
      overviewRoot.unmount();
      overviewRoot = null;
    }

    const appId = overlayState.appId;

    if (appId && manifest) {
      overviewRoot = createRoot(wrapper);
      overviewRoot.render(
        <OverviewPanel
          appId={appId}
          version={selectedVersion.version}
          manifest={manifest}
          selectedVersion={selectedVersion}
        />,
      );
    }
  } else if (overlayState.tab === "scans") {
    // Mount React ScansPanel component
    const wrapper = document.createElement("div");
    wrapper.id = "scans-panel-root";
    tabContent.append(wrapper);

    // Clean up previous root if exists
    if (scansRoot) {
      scansRoot.unmount();
      scansRoot = null;
    }

    const appId = overlayState.appId;
    const version = selectedVersion.version;
    const images = (selectedVersion.images || []).map((img) => img.name);

    if (appId && version) {
      scansRoot = createRoot(wrapper);
      scansRoot.render(<ScansPanel appId={appId} version={version} images={images} />);
    }
  } else if (overlayState.tab === "sboms") {
    // Mount React SBOMsPanel component
    const wrapper = document.createElement("div");
    wrapper.id = "sboms-panel-root";
    tabContent.append(wrapper);

    // Clean up previous root if exists
    if (sbomsRoot) {
      sbomsRoot.unmount();
      sbomsRoot = null;
    }

    const appId = overlayState.appId;
    const version = selectedVersion.version;
    const images = (selectedVersion.images || []).map((img) => img.name);

    if (appId && version) {
      sbomsRoot = createRoot(wrapper);
      sbomsRoot.render(<SBOMsPanel appId={appId} version={version} images={images} />);
    }
  }
}

function setTabActive(state: OverlayState, { tabButtons }: OverlayElements) {
  tabButtons.forEach((button) => {
    button.dataset.active = button.dataset.overlayTab === state.tab ? "true" : "false";
  });
}

function renderOverlay(overlayState: OverlayState, elements: OverlayElements) {
  const {
    overlayContent,
    overlayError,
    overlayErrorMessage,
    overlayImages,
    overlayLabels,
    overlayLatest,
    overlayLoading,
    overlayProviders,
    overlaySource,
    overlaySummary,
    overlayTitle,
    overlayUpdated,
    providerSelect,
    versionSelect,
  } = elements;

  const manifestResult = overlayState.manifestResult;
  const viewModel = overlayState.viewModel;

  if (overlayLoading) overlayLoading.classList.add("hidden");
  if (overlayError) overlayError.classList.add("hidden");

  if (!manifestResult?.manifest) {
    if (overlayError) overlayError.classList.remove("hidden");
    if (overlayErrorMessage) {
      overlayErrorMessage.textContent = "This manifest did not contain provider data.";
    }
    if (overlayContent) overlayContent.classList.add("hidden");
    return;
  }

  if (overlayContent) overlayContent.classList.remove("hidden");

  if (overlaySource) {
    overlaySource.textContent = sourceLabelMap[manifestResult.source] ?? "Unknown source";
  }
  if (overlayUpdated) {
    overlayUpdated.textContent = manifestResult.fetchedAt
      ? `Fetched ${new Date(manifestResult.fetchedAt).toLocaleString()}`
      : "";
  }
  if (overlayLatest) {
    overlayLatest.textContent = viewModel?.latestVersion ?? "—";
  }
  if (overlayImages) {
    overlayImages.textContent = String(viewModel?.imageCount ?? 0);
  }
  if (overlayProviders) {
    overlayProviders.textContent = viewModel?.providers?.join(", ") || "—";
  }

  if (providerSelect) providerSelect.innerHTML = "";
  if (versionSelect) versionSelect.innerHTML = "";

  // V2 manifests have flat versions[] array, no provider nesting
  const versions = manifestResult.manifest.versions ?? [];

  // Pin provider select to "Vendor" only (locked for now)
  if (providerSelect) {
    providerSelect.innerHTML = "";
    const option = document.createElement("option");
    option.value = "vendor";
    option.textContent = "Vendor";
    providerSelect.append(option);
    providerSelect.disabled = true;
    providerSelect.classList.add("opacity-60", "cursor-not-allowed");
  }

  if (!versions.length) {
    if (versionSelect) {
      versionSelect.disabled = true;
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No versions";
      versionSelect.append(option);
    }
    if (elements.tabContent) {
      elements.tabContent.innerHTML =
        '<p class="text-sm text-[#5C677D]">No versions were published for this package.</p>';
    }
    return;
  }

  if (overlayState.versionIndex >= versions.length) {
    overlayState.versionIndex = 0;
  }

  if (versionSelect) {
    versionSelect.disabled = false;
    versions.forEach((version: { version: string; released?: string }, index: number) => {
      const option = document.createElement("option");
      option.value = String(index);
      const release = version.released
        ? ` • ${new Date(version.released).toLocaleDateString()}`
        : "";
      option.textContent = `${version.version}${release}`;
      versionSelect.append(option);
    });
    versionSelect.value = String(overlayState.versionIndex);
  }

  const selectedVersion = versions[overlayState.versionIndex];
  const images = selectedVersion?.images ?? [];

  if (!images.length) {
    if (elements.tabContent) {
      elements.tabContent.innerHTML =
        '<p class="text-sm text-[#5C677D]">Choose another version to inspect image assets.</p>';
    }
    return;
  }

  if (overlayState.imageIndex >= images.length) {
    overlayState.imageIndex = 0;
  }

  setTabActive(overlayState, elements);
  renderTabContent(overlayState, elements);

  if (overlaySummary && viewModel?.summary) {
    overlaySummary.textContent = viewModel.summary;
  }
  if (overlayTitle) {
    overlayTitle.textContent = viewModel?.name ?? overlayState.appId ?? "";
  }
  if (overlayLabels) {
    overlayLabels.innerHTML = "";
    (viewModel?.labels ?? []).forEach((label) => {
      const chip = document.createElement("span");
      chip.className =
        "inline-flex items-center rounded-full border border-[#023052] bg-[#001845] px-3 py-1 text-xs font-medium text-[#7EA8FF]";
      chip.textContent = label;
      overlayLabels.append(chip);
    });
  }
}

function lockScroll(locked: boolean) {
  document.body.classList.toggle("overflow-hidden", locked);
}

function attachOverlayHandlers(
  overlayState: OverlayState,
  elements: OverlayElements,
  catalogViewModelMap: Map<string, CatalogViewModel>,
): void {
  const { overlay, overlayBackdrop, overlayClose, providerSelect, versionSelect, tabButtons } =
    elements;
  if (!overlay) return;

  const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-catalog-card]"));

  const resetOverlay = () => {
    overlayState.appId = null;
    overlayState.manifestResult = null;
    overlayState.providerKey = null;
    overlayState.versionIndex = 0;
    overlayState.imageIndex = 0;
    overlayState.tab = "overview";
    overlayState.viewModel = null;

    if (elements.overlayContent) elements.overlayContent.classList.add("hidden");
    if (elements.overlayError) elements.overlayError.classList.add("hidden");
    if (elements.overlayLoading) elements.overlayLoading.classList.remove("hidden");
    if (elements.overlayStatus) elements.overlayStatus.textContent = "Loading manifest…";
    if (elements.tabContent) elements.tabContent.innerHTML = "";

    tabButtons.forEach((button) => {
      button.dataset.active = button.dataset.overlayTab === "overview" ? "true" : "false";
    });
  };

  const closeOverlay = () => {
    if (overlay.classList.contains("hidden")) return;
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
    lockScroll(false);
    resetOverlay();

    // Clean up React roots
    if (overviewRoot) {
      overviewRoot.unmount();
      overviewRoot = null;
    }
    if (scansRoot) {
      scansRoot.unmount();
      scansRoot = null;
    }
    if (sbomsRoot) {
      sbomsRoot.unmount();
      sbomsRoot = null;
    }
  };

  if (providerSelect) {
    providerSelect.addEventListener("change", () => {
      overlayState.providerKey = providerSelect.value || null;
      overlayState.versionIndex = 0;
      overlayState.imageIndex = 0;
      renderOverlay(overlayState, elements);
    });
  }

  if (versionSelect) {
    versionSelect.addEventListener("change", () => {
      overlayState.versionIndex = Number(versionSelect.value) || 0;
      overlayState.imageIndex = 0;
      renderOverlay(overlayState, elements);
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = (button.dataset.overlayTab as OverlayState["tab"]) ?? "overview";
      overlayState.tab = targetTab;
      setTabActive(overlayState, elements);
      renderTabContent(overlayState, elements);
    });
  });

  const openOverlay = async (card: HTMLElement) => {
    const appId = card.dataset.appId;
    if (!appId) return;

    overlayState.appId = appId;
    overlayState.viewModel = catalogViewModelMap.get(appId) ?? null;
    overlayState.tab = "overview";
    overlayState.versionIndex = 0;
    overlayState.imageIndex = 0;
    overlayState.providerKey = null;
    overlayState.manifestResult = null;

    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
    lockScroll(true);

    if (elements.overlayLoading) elements.overlayLoading.classList.remove("hidden");
    if (elements.overlayContent) elements.overlayContent.classList.add("hidden");
    if (elements.overlayError) elements.overlayError.classList.add("hidden");
    if (elements.overlayStatus) elements.overlayStatus.textContent = "Loading manifest…";

    try {
      const response = await fetch(`/api/catalog/${encodeURIComponent(appId)}`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const payload = (await response.json()) as ManifestResult;
      overlayState.manifestResult = payload;
      renderOverlay(overlayState, elements);
    } catch (error) {
      if (elements.overlayLoading) elements.overlayLoading.classList.add("hidden");
      if (elements.overlayError) elements.overlayError.classList.remove("hidden");
      if (elements.overlayErrorMessage) {
        const message = error instanceof Error ? error.message : "Unknown manifest error";
        elements.overlayErrorMessage.textContent = message;
      }
      console.warn("Unable to load catalog manifest", error);
    }
  };

  const interactiveSelector = 'a, button, [role="button"], input, select, textarea';

  const handleCardActivation = (event: Event, card: HTMLElement) => {
    const target = event.target as HTMLElement | null;
    const interactiveTarget = target?.closest<HTMLElement>(interactiveSelector);
    if (interactiveTarget && interactiveTarget !== card) {
      return;
    }
    event.preventDefault();
    void openOverlay(card);
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => handleCardActivation(event, card));
    card.addEventListener("keydown", (event) => {
      if ((event as KeyboardEvent).key === "Enter" || (event as KeyboardEvent).key === " ") {
        handleCardActivation(event, card);
      }
    });
  });

  if (overlayBackdrop) {
    overlayBackdrop.addEventListener("click", () => closeOverlay());
  }

  if (overlayClose) {
    overlayClose.addEventListener("click", () => closeOverlay());
  }

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeOverlay();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.classList.contains("hidden")) {
      closeOverlay();
    }
  });
}

function initCatalogPage() {
  if (typeof document === "undefined") return;

  console.log("[catalog-page] initCatalogPage starting...");

  initFilters();
  initChart();

  const catalogViewModelMap = buildCatalogViewModelMap();
  console.log("[catalog-page] catalogViewModelMap size:", catalogViewModelMap.size);

  const overlayElements = buildOverlayElements();
  console.log("[catalog-page] overlay element found:", !!overlayElements.overlay);

  const overlayState: OverlayState = {
    appId: null,
    manifestResult: null,
    providerKey: null,
    versionIndex: 0,
    imageIndex: 0,
    tab: "overview",
    viewModel: null,
  };

  if (overlayElements.overlay) {
    const cards = document.querySelectorAll("[data-catalog-card]");
    console.log("[catalog-page] Found", cards.length, "catalog cards");
    attachOverlayHandlers(overlayState, overlayElements, catalogViewModelMap);
    console.log("[catalog-page] Overlay handlers attached");
  } else {
    console.warn("[catalog-page] Overlay element not found!");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCatalogPage, {
    once: true,
  });
} else {
  initCatalogPage();
}
