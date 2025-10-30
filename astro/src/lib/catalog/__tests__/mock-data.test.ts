import { describe, expect, it } from "vitest";
import { mockCatalogResponse, sumSeverity } from "../mock-data";

describe("catalog mock data helpers", () => {
  it("sums severity totals across apps", () => {
    const totals = sumSeverity(mockCatalogResponse.apps);
    expect(totals).toEqual({ critical: 1, high: 4, medium: 10, low: 14 });
  });

  it("returns zero totals for empty inputs", () => {
    const totals = sumSeverity([]);
    expect(totals).toEqual({ critical: 0, high: 0, medium: 0, low: 0 });
  });
});
