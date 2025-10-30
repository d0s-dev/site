import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchCatalogData = vi.fn();
const fetchCatalogManifest = vi.fn();

vi.mock("../../../../lib/catalog/data-source", () => ({
  fetchCatalogData,
  fetchCatalogManifest,
}));

describe("catalog manifest API route", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchCatalogData.mockReset();
    fetchCatalogManifest.mockReset();
  });

  it("builds static paths for each catalog app", async () => {
    fetchCatalogData.mockResolvedValue({
      source: "mock",
      fetchedAt: 123,
      response: {
        version: "1.0.0",
        lastUpdated: "2025-10-30T00:00:00Z",
        apps: [
          { id: "alpha" },
          { id: "bravo" },
        ],
      },
    });

    fetchCatalogManifest
      .mockResolvedValueOnce({ source: "mock", fetchedAt: 456, manifest: { id: "alpha", providers: {} } })
      .mockResolvedValueOnce({ source: "mock", fetchedAt: 789, manifest: { id: "bravo", providers: {} } });

    const mod = await import("../[appId].ts");
    const paths = await mod.getStaticPaths();

    expect(paths).toHaveLength(2);
    expect(paths[0]?.params).toEqual({ appId: "alpha" });
    expect(paths[0]?.props?.manifestResult.manifest).toEqual({ id: "alpha", providers: {} });
    expect(paths[1]?.params).toEqual({ appId: "bravo" });
    expect(fetchCatalogManifest).toHaveBeenCalledTimes(2);
  });

  it("reads pre-rendered manifest data when available", async () => {
    const manifestResult = { source: "mock", fetchedAt: 100, manifest: { id: "alpha", providers: {} } };
    const { GET } = await import("../[appId].ts");

    const response = await GET({
      params: { appId: "alpha" },
      props: { manifestResult },
    } as never);

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.manifest).toEqual({ id: "alpha", providers: {} });
    expect(fetchCatalogManifest).not.toHaveBeenCalled();
  });

  it("returns a 400 when the appId is missing", async () => {
    const { GET } = await import("../[appId].ts");
    const response = await GET({ params: {} } as never);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: "App ID is required" });
  });
});
