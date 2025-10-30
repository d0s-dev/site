import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const projectRoot = fileURLToPath(new URL("../../..", import.meta.url));
const distCatalogPath = join(projectRoot, "dist", "catalog", "index.html");

let catalogHtml = "";

describe("catalog page build output", () => {
  beforeAll(() => {
    execSync("npm run build", { cwd: projectRoot, stdio: "pipe" });
    catalogHtml = readFileSync(distCatalogPath, "utf-8");
  }, 45_000);

  it("includes the manifest overlay container", () => {
    expect(catalogHtml).toContain("data-manifest-overlay");
    expect(catalogHtml).toContain("data-overlay-provider");
  });

  it("serializes catalog view models into the document", () => {
    expect(catalogHtml).toContain('id="catalog-view-models"');
    expect(catalogHtml).toMatch(/"id":"keycloak"/);
  });

  it("renders catalog summary metrics", () => {
    expect(catalogHtml).toContain("Offline readiness matrix");
    expect(catalogHtml).toMatch(/Packages tracked/);
  });
});
