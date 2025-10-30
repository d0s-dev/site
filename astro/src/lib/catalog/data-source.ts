import { mockCatalogResponse, mockManifests } from "./mock-data";
import type {
  CatalogDataResult,
  CatalogManifest,
  CatalogManifestResult,
  CatalogResponse,
  CatalogSource,
} from "./types";

const APPS_BASE_URL = "https://raw.githubusercontent.com/d0s-dev/apps";
const DEFAULT_BRANCH = process.env.CATALOG_SOURCE_BRANCH ?? "main";
const DEFAULT_REF = DEFAULT_BRANCH.startsWith("refs/")
  ? DEFAULT_BRANCH
  : `refs/heads/${DEFAULT_BRANCH}`;
const APPS_INDEX_PATH = "catalog/apps.json";

const manifestPath = (appId: string, ref = DEFAULT_REF) =>
  `${APPS_BASE_URL}/${ref}/catalog/${encodeURIComponent(appId)}/manifest.json`;

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
    throw new Error(
      `Failed to fetch ${input}: ${response.status} ${response.statusText}`,
    );
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

  if (cached && !forceRefresh && now - cached.fetchedAt < ttlMs) {
    return {
      source: cached.source === "remote" ? "cache" : cached.source,
      response: cached.response,
      fetchedAt: cached.fetchedAt,
    };
  }

  try {
    const url = `${APPS_BASE_URL}/${DEFAULT_REF}/${APPS_INDEX_PATH}`;
    const result = await fetchJson<CatalogResponse>(url, {
      headers: cached?.etag ? { "If-None-Match": cached.etag } : undefined,
      cache: "no-store",
    });
    const data: CatalogDataResult = {
      source: "remote",
      response: result.data,
      fetchedAt: now,
    };
    cache.catalog = { ...data, etag: result.etag };
    return data;
  } catch (error: unknown) {
    if (cached && (error as { status?: number }).status === 304) {
      return {
        source: "cache",
        response: cached.response,
        fetchedAt: cached.fetchedAt,
      };
    }
    console.warn("Falling back to mock catalog data:", error);
    const fallback: CatalogDataResult = {
      source: "mock",
      response: mockCatalogResponse,
      fetchedAt: now,
    };
    cache.catalog = fallback;
    return fallback;
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
    const url = manifestPath(appId);
    const result = await fetchJson<CatalogManifest>(url, {
      headers: cacheEntry?.etag
        ? { "If-None-Match": cacheEntry.etag }
        : undefined,
      cache: "no-store",
    });

    const entry = {
      manifest: result.data,
      fetchedAt: now,
      source: "remote" as CatalogSource,
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
    const fallback = mockManifests[appId];
    if (fallback) {
      const entry = {
        manifest: fallback,
        fetchedAt: now,
        source: "mock" as CatalogSource,
      };
      cache.manifests.set(appId, entry);
      return entry;
    }
    throw new Error(
      `Manifest for ${appId} not found. Original error: ${(error as Error).message}`,
    );
  }
}

export function resetCatalogCache() {
  cache.catalog = undefined;
  cache.manifests.clear();
}
