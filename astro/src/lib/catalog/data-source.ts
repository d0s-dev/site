import type {
  CatalogDataResult,
  CatalogManifest,
  CatalogManifestResult,
  CatalogResponse,
  CatalogSource,
} from "./types";
import { sanitizeFilename } from "./utils";

// Local dev server URL (from `d0s catalog serve`)
// Use import.meta.env for browser compatibility (process.env doesn't exist in browsers)
// For client-side fetches (Scans/SBOMs), default to localhost:8080 when running in browser
const CATALOG_SERVE_URL =
  import.meta.env?.CATALOG_SERVE_URL ??
  (typeof window !== "undefined" ? "http://localhost:8080" : undefined);

// GitHub raw content fallback
const APPS_BASE_URL = "https://raw.githubusercontent.com/d0s-dev/apps";
const GITHUB_BROWSE_URL = "https://github.com/d0s-dev/apps/tree";
const DEFAULT_BRANCH = import.meta.env?.CATALOG_SOURCE_BRANCH ?? "main";
const DEFAULT_REF = DEFAULT_BRANCH.startsWith("refs/")
  ? DEFAULT_BRANCH
  : `refs/heads/${DEFAULT_BRANCH}`;
const APPS_INDEX_PATH = "catalog/apps.json";

// Build URLs based on whether we're using local dev server
const getCatalogUrl = () =>
  CATALOG_SERVE_URL
    ? `${CATALOG_SERVE_URL}/apps.json`
    : `${APPS_BASE_URL}/${DEFAULT_REF}/${APPS_INDEX_PATH}`;

const getManifestUrl = (appId: string) =>
  CATALOG_SERVE_URL
    ? `${CATALOG_SERVE_URL}/${encodeURIComponent(appId)}/manifest.json`
    : `${APPS_BASE_URL}/${DEFAULT_REF}/catalog/${encodeURIComponent(appId)}/manifest.json`;

/**
 * Get URL for a CVE scan JSON file
 */
export const getScanUrl = (appId: string, version: string, imageName: string) => {
  const sanitized = sanitizeFilename(imageName);
  return CATALOG_SERVE_URL
    ? `${CATALOG_SERVE_URL}/${appId}/versions/${version}/scans/${sanitized}-cves.json`
    : `${APPS_BASE_URL}/${DEFAULT_REF}/catalog/${appId}/versions/${version}/scans/${sanitized}-cves.json`;
};

/**
 * Get URL for an SBOM JSON file
 */
export const getSBOMUrl = (appId: string, version: string, imageName: string) => {
  const sanitized = sanitizeFilename(imageName);
  return CATALOG_SERVE_URL
    ? `${CATALOG_SERVE_URL}/${appId}/versions/${version}/sboms/${appId}/${sanitized}.json`
    : `${APPS_BASE_URL}/${DEFAULT_REF}/catalog/${appId}/versions/${version}/sboms/${appId}/${sanitized}.json`;
};

/**
 * Get URL for the SBOM HTML viewer
 */
export const getSBOMViewerUrl = (appId: string, version: string, imageName: string) => {
  const sanitized = sanitizeFilename(imageName);
  return CATALOG_SERVE_URL
    ? `${CATALOG_SERVE_URL}/${appId}/versions/${version}/sboms/${appId}/sbom-viewer-${sanitized}.html`
    : `${APPS_BASE_URL}/${DEFAULT_REF}/catalog/${appId}/versions/${version}/sboms/${appId}/sbom-viewer-${sanitized}.html`;
};

/**
 * Get GitHub browse URL for version artifacts folder
 */
export const getGitHubBrowseUrl = (appId: string, version: string, subpath?: string) => {
  const base = `${GITHUB_BROWSE_URL}/${DEFAULT_BRANCH}/catalog/${appId}/versions/${version}`;
  return subpath ? `${base}/${subpath}` : base;
};

const cache: {
  catalog?: CatalogDataResult & { etag?: string };
  manifests: Map<
    string,
    {
      manifest: CatalogManifest;
      etag?: string;
      fetchedAt: number;
      source: CatalogSource;
    }
  >;
} = {
  manifests: new Map(),
};

const ttlMs = 5 * 60 * 1000; // 5 minutes

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.status === 304) {
    throw Object.assign(new Error("Not Modified"), { status: 304 });
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch ${input}: ${response.status} ${response.statusText}`);
  }
  return {
    etag: response.headers.get("etag") ?? undefined,
    data: (await response.json()) as T,
  };
}

export async function fetchCatalogData(
  options: { forceRefresh?: boolean } = {},
): Promise<CatalogDataResult> {
  const { forceRefresh = false } = options;
  const now = Date.now();
  const cached = cache.catalog;

  // During SSG build (Astro SSR), always show as "remote" not "cache"
  // In tests/browser, show actual cache status
  // Skip SSG behavior in test environments (vitest sets import.meta.env.VITEST)
  const isSSG =
    typeof window === "undefined" &&
    typeof import.meta.env !== "undefined" &&
    import.meta.env.SSR === true &&
    !import.meta.env.VITEST;

  if (cached && !forceRefresh && now - cached.fetchedAt < ttlMs) {
    return {
      source: isSSG ? "remote" : cached.source === "remote" ? "cache" : cached.source,
      response: cached.response,
      fetchedAt: cached.fetchedAt,
    };
  }

  try {
    const url = getCatalogUrl();
    const isLocal = !!CATALOG_SERVE_URL;
    const result = await fetchJson<CatalogResponse>(url, {
      headers: cached?.etag && !isLocal ? { "If-None-Match": cached.etag } : undefined,
      cache: "no-store",
    });
    const data: CatalogDataResult = {
      source: isLocal ? "local" : "remote",
      response: result.data,
      fetchedAt: now,
    };
    cache.catalog = { ...data, etag: result.etag };
    return data;
  } catch (error: unknown) {
    if (cached && (error as { status?: number }).status === 304) {
      return {
        source: isSSG ? "remote" : "cache",
        response: cached.response,
        fetchedAt: cached.fetchedAt,
      };
    }
    // Return cached data if available, otherwise throw
    if (cached) {
      console.warn("Failed to fetch catalog, using cached data:", error);
      return {
        source: "cache",
        response: cached.response,
        fetchedAt: cached.fetchedAt,
      };
    }
    throw new Error(`Failed to fetch catalog data: ${(error as Error).message}`);
  }
}

export async function fetchCatalogManifest(
  appId: string,
  options: { forceRefresh?: boolean } = {},
): Promise<CatalogManifestResult> {
  const { forceRefresh = false } = options;
  const cacheEntry = cache.manifests.get(appId);
  const now = Date.now();

  if (cacheEntry && !forceRefresh && now - cacheEntry.fetchedAt < ttlMs) {
    return {
      manifest: cacheEntry.manifest,
      fetchedAt: cacheEntry.fetchedAt,
      source: cacheEntry.source === "remote" ? "cache" : cacheEntry.source,
    };
  }

  try {
    const url = getManifestUrl(appId);
    const isLocal = !!CATALOG_SERVE_URL;
    const result = await fetchJson<CatalogManifest>(url, {
      headers: cacheEntry?.etag && !isLocal ? { "If-None-Match": cacheEntry.etag } : undefined,
      cache: "no-store",
    });

    const entry = {
      manifest: result.data,
      fetchedAt: now,
      source: (isLocal ? "local" : "remote") as CatalogSource,
      etag: result.etag,
    };
    cache.manifests.set(appId, entry);
    return {
      manifest: entry.manifest,
      fetchedAt: entry.fetchedAt,
      source: entry.source,
    };
  } catch (error) {
    if (cacheEntry && (error as { status?: number }).status === 304) {
      return {
        manifest: cacheEntry.manifest,
        fetchedAt: cacheEntry.fetchedAt,
        source: "cache",
      };
    }
    // Return cached data if available, otherwise throw
    if (cacheEntry) {
      console.warn(`Failed to fetch manifest for ${appId}, using cached data:`, error);
      return {
        manifest: cacheEntry.manifest,
        fetchedAt: cacheEntry.fetchedAt,
        source: "cache",
      };
    }
    throw new Error(`Failed to fetch manifest for ${appId}: ${(error as Error).message}`);
  }
}

export function resetCatalogCache() {
  cache.catalog = undefined;
  cache.manifests.clear();
}
