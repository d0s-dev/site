import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CatalogResponse, CatalogManifest } from "../types";

const originalFetch = global.fetch;
const originalBranchEnv = process.env.CATALOG_SOURCE_BRANCH;

const loadDataSource = async () => import("../data-source");

// Sample test data matching our schema
const sampleCatalogResponse: CatalogResponse = {
  version: "1.0.0",
  lastUpdated: "2025-10-29T00:00:00Z",
  apps: [
    {
      id: "redis",
      name: "Redis",
      summary: "In-memory data store",
      labels: ["database", "cache"],
      providers: ["vendor"],
      versionCount: 3,
      latestVersion: "7.0.0",
      imageCount: 1,
      cves: { critical: 0, high: 0, medium: 0, low: 0 },
    },
  ],
};

const sampleManifest: CatalogManifest = {
  id: "redis",
  name: "Redis",
  description: "Redis is an in-memory data structure store",
  upstream: {
    helm: { repo: "https://charts.bitnami.com/bitnami", chart: "redis" },
  },
  versions: [
    { version: "7.0.0", chartVersion: "17.0.0" },
  ],
  lastUpdated: "2025-10-29T00:00:00Z",
};

const createResponse = <T>(
  data: T,
  init: { etag?: string; status?: number } = {},
) => ({
  ok: (init.status ?? 200) < 400,
  status: init.status ?? 200,
  statusText: "OK",
  headers: new Headers(init.etag ? { etag: init.etag } : undefined),
  json: async () => data,
});

afterEach(() => {
  if (originalFetch) {
    global.fetch = originalFetch;
  } else {
    Reflect.deleteProperty(globalThis, "fetch");
  }
  if (originalBranchEnv === undefined) {
    Reflect.deleteProperty(process.env, "CATALOG_SOURCE_BRANCH");
  } else {
    process.env.CATALOG_SOURCE_BRANCH = originalBranchEnv;
  }
});

beforeEach(() => {
  vi.resetModules();
});

describe("catalog data-source", () => {
  it("returns remote catalog data when fetch succeeds", async () => {
    const { fetchCatalogData, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();

    global.fetch = vi
      .fn()
      .mockResolvedValue(createResponse(sampleCatalogResponse, { etag: '"123"' }));

    const result = await fetchCatalogData({ forceRefresh: true });

    expect(result.source).toBe("remote");
    expect(result.response).toEqual(sampleCatalogResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/d0s-dev/apps/refs/heads/main/catalog/apps.json",
      expect.any(Object),
    );
  });

  it("throws error when fetch fails and no cache available", async () => {
    const { fetchCatalogData, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    global.fetch = vi.fn().mockRejectedValue(new Error("network error"));

    await expect(fetchCatalogData({ forceRefresh: true })).rejects.toThrow(
      "Failed to fetch catalog data"
    );
    warn.mockRestore();
  });

  it("returns remote manifest data when fetch succeeds", async () => {
    const { fetchCatalogManifest, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();

    global.fetch = vi.fn().mockResolvedValue(createResponse(sampleManifest));

    const result = await fetchCatalogManifest("redis", { forceRefresh: true });

    expect(result.source).toBe("remote");
    expect(result.manifest).toEqual(sampleManifest);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/d0s-dev/apps/refs/heads/main/catalog/redis/manifest.json",
      expect.any(Object),
    );
  });

  it("throws error when manifest fetch fails and no cache available", async () => {
    const { fetchCatalogManifest, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();
    global.fetch = vi.fn().mockRejectedValue(new Error("boom"));

    await expect(
      fetchCatalogManifest("redis", { forceRefresh: true })
    ).rejects.toThrow("Failed to fetch manifest for redis");
  });

  it("reuses cached manifest data when fetch returns 304", async () => {
    const { fetchCatalogManifest, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(createResponse(sampleManifest, { etag: '"zzz"' }))
      .mockResolvedValueOnce(createResponse(sampleManifest, { status: 304 }));

    const first = await fetchCatalogManifest("redis", {
      forceRefresh: true,
    });
    expect(first.source).toBe("remote");

    const second = await fetchCatalogManifest("redis", {
      forceRefresh: true,
    });
    expect(second.source).toBe("cache");
    expect(second.manifest).toEqual(first.manifest);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("reuses cached catalog data when fetch returns 304", async () => {
    const { fetchCatalogData, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(createResponse(sampleCatalogResponse, { etag: '"abc"' }))
      .mockResolvedValueOnce(createResponse(sampleCatalogResponse, { status: 304 }));

    const first = await fetchCatalogData({ forceRefresh: true });
    expect(first.source).toBe("remote");

    const second = await fetchCatalogData({ forceRefresh: true });
    expect(second.source).toBe("cache");
    expect(second.response).toEqual(first.response);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("respects full ref overrides for manifest fetches", async () => {
    process.env.CATALOG_SOURCE_BRANCH = "refs/tags/v1.2.3";
    const { fetchCatalogData, fetchCatalogManifest, resetCatalogCache } =
      await loadDataSource();
    resetCatalogCache();

    global.fetch = vi
      .fn()
      .mockResolvedValue(createResponse(sampleCatalogResponse));

    await fetchCatalogData({ forceRefresh: true });
    expect(global.fetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/d0s-dev/apps/refs/tags/v1.2.3/catalog/apps.json",
      expect.any(Object),
    );

    await fetchCatalogManifest("nginx", { forceRefresh: true });
    expect(global.fetch).toHaveBeenLastCalledWith(
      "https://raw.githubusercontent.com/d0s-dev/apps/refs/tags/v1.2.3/catalog/nginx/manifest.json",
      expect.any(Object),
    );
  });
});
