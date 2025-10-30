import type { ChartData } from "chart.js";
import Chart from "chart.js/auto";

type CatalogViewModel = {
  id: string;
  name: string;
  summary?: string;
  labels?: string[];
  providers?: string[];
  hasIronBank?: boolean;
  hasChainguard?: boolean;
  vendorOnly?: boolean;
  imageCount?: number;
  cves?: Record<string, number>;
  latestVersion?: string;
};

type ManifestResult = {
  source: "remote" | "cache" | "mock";
  fetchedAt: number;
  manifest: {
    providers?: Record<
      string,
      {
        displayName?: string;
        versions?: Array<{
          version: string;
          releasedAt?: string;
          urls?: Record<string, string | undefined>;
          images?: Array<{
            name: string;
            tag?: string;
            digest?: string;
            sbom?: string;
            cves?: Record<string, number>;
          }>;
          sbom?: string;
        }>;
      }
    >;
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
  imageList: HTMLElement | null;
  tabButtons: HTMLButtonElement[];
  tabContent: HTMLElement | null;
};

function buildOverlayElements(): OverlayElements {
  const overlay = document.querySelector<HTMLElement>(
    "[data-manifest-overlay]",
  );

  return {
    overlay,
    overlayBackdrop:
      overlay?.querySelector<HTMLElement>("[data-overlay-backdrop]") ?? null,
    overlayClose:
      overlay?.querySelector<HTMLElement>("[data-overlay-close]") ?? null,
    overlayTitle:
      overlay?.querySelector<HTMLElement>("[data-overlay-title]") ?? null,
    overlaySummary:
      overlay?.querySelector<HTMLElement>("[data-overlay-summary]") ?? null,
    overlayLabels:
      overlay?.querySelector<HTMLElement>("[data-overlay-labels]") ?? null,
    overlaySource:
      overlay?.querySelector<HTMLElement>("[data-overlay-source]") ?? null,
    overlayUpdated:
      overlay?.querySelector<HTMLElement>("[data-overlay-updated]") ?? null,
    overlayLatest:
      overlay?.querySelector<HTMLElement>("[data-overlay-latest]") ?? null,
    overlayImages:
      overlay?.querySelector<HTMLElement>("[data-overlay-images]") ?? null,
    overlayProviders:
      overlay?.querySelector<HTMLElement>("[data-overlay-providers]") ?? null,
    overlayLoading:
      overlay?.querySelector<HTMLElement>("[data-overlay-loading]") ?? null,
    overlayStatus:
      overlay?.querySelector<HTMLElement>("[data-overlay-status]") ?? null,
    overlayError:
      overlay?.querySelector<HTMLElement>("[data-overlay-error]") ?? null,
    overlayErrorMessage:
      overlay?.querySelector<HTMLElement>("[data-overlay-error-message]") ??
      null,
    overlayContent:
      overlay?.querySelector<HTMLElement>("[data-overlay-content]") ?? null,
    providerSelect:
      overlay?.querySelector<HTMLSelectElement>("[data-overlay-provider]") ??
      null,
    versionSelect:
      overlay?.querySelector<HTMLSelectElement>("[data-overlay-version]") ??
      null,
    imageList:
      overlay?.querySelector<HTMLElement>("[data-overlay-image-list]") ?? null,
    tabButtons: overlay
      ? Array.from(
          overlay.querySelectorAll<HTMLButtonElement>("[data-overlay-tab]"),
        )
      : [],
    tabContent:
      overlay?.querySelector<HTMLElement>("[data-overlay-tab-content]") ?? null,
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
  const searchInput = document.querySelector<HTMLInputElement>(
    "[data-filter-search]",
  );
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-catalog-card]"),
  );
  const emptyState = document.querySelector<HTMLElement>("[data-empty-state]");
  const activeCountTarget = document.querySelector<HTMLElement>(
    "[data-active-count]",
  );

  const state = { label: "all", provider: "all", search: "" };

  const setActiveButton = (buttons: HTMLButtonElement[], value: string) => {
    buttons.forEach((button) => {
      const isActive =
        button.dataset.filterLabel === value ||
        button.dataset.filterProvider === value;
      button.dataset.active = isActive ? "true" : "false";
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const applyFilters = () => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const labels = (card.dataset.labels || "").split(",").filter(Boolean);
      const providers = (card.dataset.providerList || "")
        .split(",")
        .filter(Boolean);
      const searchText = (card.dataset.searchText || "").toLowerCase();
      const hasIronBank = card.dataset.hasIronbank === "true";
      const hasChainguard = card.dataset.hasChainguard === "true";
      const vendorOnly = card.dataset.vendorOnly === "true";

      const matchesLabel =
        state.label === "all" || labels.includes(state.label);

      let matchesProvider = true;
      if (state.provider === "ironbank") {
        matchesProvider = hasIronBank;
      } else if (state.provider === "chainguard") {
        matchesProvider = hasChainguard;
      } else if (state.provider === "vendor") {
        matchesProvider = vendorOnly || providers.includes("vendor");
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
      activeCountTarget.textContent = String(visibleCount);
    }
  };

  if (labelButtons.length) {
    labelButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.filterLabel;
        if (!value) return;
        state.label = value;
        setActiveButton(labelButtons, value);
        applyFilters();
      });
    });
  }

  if (providerButtons.length) {
    providerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.filterProvider;
        if (!value) return;
        state.provider = value;
        setActiveButton(providerButtons, value);
        applyFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const value = String(
        (event.target as HTMLInputElement).value ?? "",
      ).toLowerCase();
      state.search = value.trim();
      applyFilters();
    });
  }

  applyFilters();
}

function initChart() {
  const chartCanvas =
    document.querySelector<HTMLCanvasElement>("[data-cve-chart]");
  if (!chartCanvas) return;

  const payload =
    parseJsonPayload<ChartData<"doughnut", number[], string>>(
      "#catalog-cve-data",
    );
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

function renderTabContent(
  overlayState: OverlayState,
  elements: OverlayElements,
): void {
  const { tabContent } = elements;

  if (!tabContent) return;

  tabContent.innerHTML = "";

  const manifest = overlayState.manifestResult?.manifest;
  const provider = overlayState.providerKey
    ? manifest?.providers?.[overlayState.providerKey]
    : undefined;
  const versions = provider?.versions ?? [];
  const selectedVersion = versions[overlayState.versionIndex] ?? null;
  const images = selectedVersion?.images ?? [];
  const image = images[overlayState.imageIndex] ?? null;

  if (!manifest || !provider) {
    const message = document.createElement("p");
    message.className = "text-sm text-[#5C677D]";
    message.textContent = "Select a provider to inspect manifest data.";
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
    const container = document.createElement("div");
    container.className = "space-y-4";

    const header = document.createElement("div");
    header.className = "rounded-2xl border border-[#023052] bg-[#001233] p-4";
    const title = document.createElement("h4");
    title.className = "text-lg font-semibold text-white";
    title.textContent = `${image.name}${image.tag ? `:${image.tag}` : ""}`;
    header.append(title);

    if (image.digest) {
      const digest = document.createElement("p");
      digest.className = "mt-2 break-all text-xs text-[#5C677D]";
      digest.textContent = image.digest;
      header.append(digest);
    }

    container.append(header);

    if (selectedVersion.urls) {
      const linksWrapper = document.createElement("div");
      linksWrapper.className =
        "space-y-2 rounded-2xl border border-[#023052] bg-[#001233] p-4";
      const linksTitle = document.createElement("p");
      linksTitle.className =
        "text-xs uppercase tracking-[0.2em] text-[#5C677D]";
      linksTitle.textContent = "Related links";
      linksWrapper.append(linksTitle);

      const linkRow = document.createElement("div");
      linkRow.className = "flex flex-wrap gap-3";
      Object.entries(selectedVersion.urls).forEach(([label, href]) => {
        if (!href) return;
        const link = document.createElement("a");
        link.className =
          "inline-flex items-center gap-2 rounded-full border border-[#023052] px-3 py-1 text-xs text-[#7EA8FF] transition hover:border-[#0466C8] hover:text-white";
        link.href = href;
        link.target = "_blank";
        link.rel = "noreferrer noopener";
        link.textContent = label;
        linkRow.append(link);
      });
      if (linkRow.children.length) {
        linksWrapper.append(linkRow);
        container.append(linksWrapper);
      }
    }

    if (image.sbom || selectedVersion.sbom) {
      const sbomNotice = document.createElement("div");
      sbomNotice.className =
        "rounded-2xl border border-[#023052] bg-[#001233] p-4 text-xs text-[#9BA3B5]";
      sbomNotice.textContent = "SBOM coverage available under the SBOMs tab.";
      container.append(sbomNotice);
    }

    tabContent.append(container);
  } else if (overlayState.tab === "scans") {
    const wrapper = document.createElement("div");
    wrapper.className = "space-y-4";

    const severitySummary = document.createElement("div");
    severitySummary.className = "grid gap-3 sm:grid-cols-2 lg:grid-cols-4";

    severityKeys.forEach((key) => {
      const card = document.createElement("div");
      card.className =
        "rounded-2xl border border-[#023052] bg-[#001233] p-4 text-center";
      const label = document.createElement("p");
      label.className = "text-xs uppercase tracking-[0.2em] text-[#5C677D]";
      label.textContent = key;
      const value = document.createElement("p");
      value.className = "mt-2 text-2xl font-semibold text-white";
      value.textContent = String(image.cves?.[key] ?? 0);
      card.append(label, value);
      severitySummary.append(card);
    });

    wrapper.append(severitySummary);

    if (!image.cves) {
      const hint = document.createElement("p");
      hint.className = "text-xs text-[#5C677D]";
      hint.textContent =
        "Detailed CVE listings are not available for this image yet.";
      wrapper.append(hint);
    }

    tabContent.append(wrapper);
  } else if (overlayState.tab === "sboms") {
    const wrapper = document.createElement("div");
    wrapper.className = "space-y-4";

    if (image.sbom) {
      const card = document.createElement("div");
      card.className = "rounded-2xl border border-[#023052] bg-[#001233] p-4";
      const info = document.createElement("p");
      info.className = "text-sm text-[#9BA3B5]";
      info.textContent =
        "Download the SBOM for this image to inspect component inventories.";
      const link = document.createElement("a");
      link.className =
        "mt-3 inline-flex items-center gap-2 rounded-full border border-[#023052] px-3 py-1 text-xs text-[#7EA8FF] transition hover:border-[#0466C8] hover:text-white";
      link.href = image.sbom;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.textContent = "Open image SBOM";
      card.append(info, link);
      wrapper.append(card);
    }

    if (selectedVersion.sbom) {
      const versionCard = document.createElement("div");
      versionCard.className =
        "rounded-2xl border border-[#023052] bg-[#001233] p-4";
      const info = document.createElement("p");
      info.className = "text-sm text-[#9BA3B5]";
      info.textContent = "Provider level SBOM snapshot:";
      const link = document.createElement("a");
      link.className =
        "mt-2 inline-flex items-center gap-2 rounded-full border border-[#023052] px-3 py-1 text-xs text-[#7EA8FF] transition hover:border-[#0466C8] hover:text-white";
      link.href = selectedVersion.sbom;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.textContent = "Open provider SBOM";
      versionCard.append(info, link);
      wrapper.append(versionCard);
    }

    if (!wrapper.children.length) {
      const noData = document.createElement("p");
      noData.className = "text-sm text-[#5C677D]";
      noData.textContent =
        "No SBOM artifacts are published for this selection yet.";
      wrapper.append(noData);
    }

    tabContent.append(wrapper);
  }
}

function setTabActive(state: OverlayState, { tabButtons }: OverlayElements) {
  tabButtons.forEach((button) => {
    button.dataset.active =
      button.dataset.overlayTab === state.tab ? "true" : "false";
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
    imageList,
  } = elements;

  const manifestResult = overlayState.manifestResult;
  const viewModel = overlayState.viewModel;

  if (overlayLoading) overlayLoading.classList.add("hidden");
  if (overlayError) overlayError.classList.add("hidden");

  if (!manifestResult?.manifest) {
    if (overlayError) overlayError.classList.remove("hidden");
    if (overlayErrorMessage) {
      overlayErrorMessage.textContent =
        "This manifest did not contain provider data.";
    }
    if (overlayContent) overlayContent.classList.add("hidden");
    return;
  }

  if (overlayContent) overlayContent.classList.remove("hidden");

  if (overlaySource) {
    overlaySource.textContent =
      sourceLabelMap[manifestResult.source] ?? "Unknown source";
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
  if (imageList) imageList.innerHTML = "";

  const providerEntries = Object.entries(
    manifestResult.manifest.providers ?? {},
  );
  if (!providerEntries.length) {
    if (providerSelect) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No providers";
      providerSelect.append(option);
      providerSelect.disabled = true;
    }
    if (elements.tabContent) {
      elements.tabContent.innerHTML =
        '<p class="text-sm text-[#5C677D]">No providers were published for this package.</p>';
    }
    return;
  }

  if (
    !overlayState.providerKey ||
    !manifestResult.manifest.providers?.[overlayState.providerKey]
  ) {
    const preferred =
      providerEntries.find(([key]) => key === "ironbank")?.[0] ??
      providerEntries.find(([key]) => key === "chainguard")?.[0] ??
      providerEntries[0]?.[0] ??
      null;
    overlayState.providerKey = preferred;
  }

  providerEntries.forEach(([key, value]) => {
    if (!providerSelect) return;
    const option = document.createElement("option");
    option.value = key;
    option.textContent = value?.displayName || key;
    providerSelect.append(option);
  });

  if (providerSelect) {
    providerSelect.disabled = false;
    providerSelect.value =
      overlayState.providerKey ?? providerEntries[0]?.[0] ?? "";
  }

  const provider = overlayState.providerKey
    ? manifestResult.manifest.providers?.[overlayState.providerKey]
    : undefined;
  const versions = provider?.versions ?? [];

  if (!versions.length) {
    if (versionSelect) {
      versionSelect.disabled = true;
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No versions";
      versionSelect.append(option);
    }
    if (imageList) {
      imageList.innerHTML =
        '<p class="rounded-2xl border border-[#023052] bg-[#001233] p-4 text-sm text-[#5C677D]">No versions published for this provider.</p>';
    }
    if (elements.tabContent) {
      elements.tabContent.innerHTML =
        '<p class="text-sm text-[#5C677D]">Select a different provider to continue.</p>';
    }
    return;
  }

  if (overlayState.versionIndex >= versions.length) {
    overlayState.versionIndex = 0;
  }

  if (versionSelect) {
    versionSelect.disabled = false;
    versions.forEach((version, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      const release = version.releasedAt
        ? ` • ${new Date(version.releasedAt).toLocaleDateString()}`
        : "";
      option.textContent = `${version.version}${release}`;
      versionSelect.append(option);
    });
    versionSelect.value = String(overlayState.versionIndex);
  }

  const selectedVersion = versions[overlayState.versionIndex];
  const images = selectedVersion?.images ?? [];

  if (!images.length) {
    if (imageList) {
      imageList.innerHTML =
        '<p class="rounded-2xl border border-[#023052] bg-[#001233] p-4 text-sm text-[#5C677D]">No images shipped with this version.</p>';
    }
    if (elements.tabContent) {
      elements.tabContent.innerHTML =
        '<p class="text-sm text-[#5C677D]">Choose another version to inspect image assets.</p>';
    }
    return;
  }

  if (overlayState.imageIndex >= images.length) {
    overlayState.imageIndex = 0;
  }

  if (imageList) {
    images.forEach((image, index) => {
      const button = document.createElement("button");
      const fullReference = `${image.name}${image.tag ? `:${image.tag}` : ""}`;
      button.type = "button";
      button.dataset.active =
        index === overlayState.imageIndex ? "true" : "false";
      button.className =
        "group block w-full rounded-2xl border border-[#023052] bg-[#001233] px-4 py-3 text-left text-sm text-[#9BA3B5] transition hover:border-[#0466C8] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0466C8]/60 data-[active=true]:border-[#0466C8] data-[active=true]:text-white overflow-hidden select-text";
      button.title = fullReference;

      const title = document.createElement("div");
      title.className =
        "truncate text-base font-semibold text-white select-text";
      title.textContent = fullReference;
      title.title = fullReference;
      button.append(title);

      const cveLine = document.createElement("p");
      cveLine.className = "mt-1 text-xs text-[#5C677D]";
      cveLine.textContent = `Findings: ${formatSeverity(image.cves ?? {})}`;
      button.append(cveLine);

      button.addEventListener("click", () => {
        overlayState.imageIndex = index;
        renderOverlay(overlayState, elements);
      });

      imageList.append(button);
    });
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
  const {
    overlay,
    overlayBackdrop,
    overlayClose,
    providerSelect,
    versionSelect,
    tabButtons,
  } = elements;
  if (!overlay) return;

  const cards = Array.from(
    document.querySelectorAll<HTMLElement>("[data-catalog-card]"),
  );

  const resetOverlay = () => {
    overlayState.appId = null;
    overlayState.manifestResult = null;
    overlayState.providerKey = null;
    overlayState.versionIndex = 0;
    overlayState.imageIndex = 0;
    overlayState.tab = "overview";
    overlayState.viewModel = null;

    if (elements.overlayContent)
      elements.overlayContent.classList.add("hidden");
    if (elements.overlayError) elements.overlayError.classList.add("hidden");
    if (elements.overlayLoading)
      elements.overlayLoading.classList.remove("hidden");
    if (elements.overlayStatus)
      elements.overlayStatus.textContent = "Loading manifest…";
    if (elements.imageList) elements.imageList.innerHTML = "";
    if (elements.tabContent) elements.tabContent.innerHTML = "";

    tabButtons.forEach((button) => {
      button.dataset.active =
        button.dataset.overlayTab === "overview" ? "true" : "false";
    });
  };

  const closeOverlay = () => {
    if (overlay.classList.contains("hidden")) return;
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
    lockScroll(false);
    resetOverlay();
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
      const targetTab =
        (button.dataset.overlayTab as OverlayState["tab"]) ?? "overview";
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

    if (elements.overlayLoading)
      elements.overlayLoading.classList.remove("hidden");
    if (elements.overlayContent)
      elements.overlayContent.classList.add("hidden");
    if (elements.overlayError) elements.overlayError.classList.add("hidden");
    if (elements.overlayStatus)
      elements.overlayStatus.textContent = "Loading manifest…";

    try {
      const response = await fetch(`/api/catalog/${encodeURIComponent(appId)}`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const payload = (await response.json()) as ManifestResult;
      overlayState.manifestResult = payload;
      renderOverlay(overlayState, elements);
    } catch (error) {
      if (elements.overlayLoading)
        elements.overlayLoading.classList.add("hidden");
      if (elements.overlayError)
        elements.overlayError.classList.remove("hidden");
      if (elements.overlayErrorMessage) {
        const message =
          error instanceof Error ? error.message : "Unknown manifest error";
        elements.overlayErrorMessage.textContent = message;
      }
      console.warn("Unable to load catalog manifest", error);
    }
  };

  const interactiveSelector =
    'a, button, [role="button"], input, select, textarea';

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
    card.addEventListener("click", (event) =>
      handleCardActivation(event, card),
    );
    card.addEventListener("keydown", (event) => {
      if (
        (event as KeyboardEvent).key === "Enter" ||
        (event as KeyboardEvent).key === " "
      ) {
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

  initFilters();
  initChart();

  const catalogViewModelMap = buildCatalogViewModelMap();
  const overlayElements = buildOverlayElements();
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
    attachOverlayHandlers(overlayState, overlayElements, catalogViewModelMap);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCatalogPage, {
    once: true,
  });
} else {
  initCatalogPage();
}
