import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { mockCatalogResponse, mockManifests } from "../mock-data";

const originalFetch = global.fetch;
const originalBranchEnv = process.env.CATALOG_SOURCE_BRANCH;

const loadDataSource = async () => import("../data-source");

const createResponse = <T>(data: T, init: { etag?: string; status?: number } = {}) => ({
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
    const payload = {
      version: "1.0.0",
      lastUpdated: "2025-10-29T00:00:00Z",
      apps: [],
    } satisfies typeof mockCatalogResponse;

    global.fetch = vi
      .fn()
      .mockResolvedValue(createResponse(payload, { etag: '"123"' }));

    const result = await fetchCatalogData({ forceRefresh: true });

    expect(result.source).toBe("remote");
    expect(result.response).toEqual(payload);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/d0s-dev/apps/refs/heads/main/catalog/apps.json",
      expect.any(Object),
    );
  });

  it("falls back to mock catalog data when fetch fails", async () => {
    const { fetchCatalogData, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    global.fetch = vi.fn().mockRejectedValue(new Error("network error"));

    const result = await fetchCatalogData({ forceRefresh: true });

    expect(result.source).toBe("mock");
    expect(result.response).toEqual(mockCatalogResponse);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("returns remote manifest data when fetch succeeds", async () => {
    const { fetchCatalogManifest, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();
    const manifest = {
      id: "demo",
      name: "Demo App",
      providers: {},
    } satisfies typeof mockManifests.keycloak;

    global.fetch = vi.fn().mockResolvedValue(createResponse(manifest));

    const result = await fetchCatalogManifest("demo", { forceRefresh: true });

    expect(result.source).toBe("remote");
    expect(result.manifest).toEqual(manifest);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/d0s-dev/apps/refs/heads/main/catalog/demo/manifest.json",
      expect.any(Object),
    );
  });

  it("falls back to mock manifest data when fetch fails", async () => {
    const { fetchCatalogManifest, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();
    global.fetch = vi.fn().mockRejectedValue(new Error("boom"));

    const result = await fetchCatalogManifest("keycloak", { forceRefresh: true });

    expect(result.source).toBe("mock");
    expect(result.manifest).toEqual(mockManifests.keycloak);
  });

  it("reuses cached manifest data when fetch returns 304", async () => {
    const { fetchCatalogManifest, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();
    const manifest = mockManifests.keycloak;

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(createResponse(manifest, { etag: '"zzz"' }))
      .mockResolvedValueOnce(createResponse(manifest, { status: 304 }));

    const first = await fetchCatalogManifest("keycloak", { forceRefresh: true });
    expect(first.source).toBe("remote");

    const second = await fetchCatalogManifest("keycloak", { forceRefresh: true });
    expect(second.source).toBe("cache");
    expect(second.manifest).toEqual(first.manifest);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("reuses cached catalog data when fetch returns 304", async () => {
    const { fetchCatalogData, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();
    const payload = { ...mockCatalogResponse };

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(createResponse(payload, { etag: '"abc"' }))
      .mockResolvedValueOnce(createResponse(payload, { status: 304 }));

    const first = await fetchCatalogData({ forceRefresh: true });
    expect(first.source).toBe("remote");

    const second = await fetchCatalogData({ forceRefresh: true });
    expect(second.source).toBe("cache");
    expect(second.response).toEqual(first.response);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("respects full ref overrides for manifest fetches", async () => {
    process.env.CATALOG_SOURCE_BRANCH = "refs/tags/v1.2.3";
    const { fetchCatalogData, fetchCatalogManifest, resetCatalogCache } = await loadDataSource();
    resetCatalogCache();

    global.fetch = vi.fn().mockResolvedValue(createResponse(mockCatalogResponse));

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
