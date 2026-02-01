/**
 * Mock data for development and testing
 * Schema matches d0s CLI output (pkg/catalog/types.go)
 */
import type {
  CatalogApp,
  CatalogDataResult,
  CatalogManifest,
  CatalogResponse,
  CVESummary,
} from "./types";

// Helper to create CVE summary
const cves = (overrides: Partial<CVESummary> = {}): CVESummary => ({
  critical: 0,
  high: 0,
  medium: 0,
  low: 0,
  ...overrides,
});

// Mock apps matching the AppSummary schema
export const mockCatalogResponse: CatalogResponse = {
  version: "mock-1.0.0",
  lastUpdated: "2024-11-02T00:00:00Z",
  apps: [
    {
      id: "redis",
      name: "Redis",
      summary: "In-memory data structure store for caching and message brokering",
      labels: ["database", "cache"],
      providers: ["vendor"],
      versionCount: 3,
      latestVersion: "24.1.2",
      imageCount: 2,
      cves: cves({ medium: 2, low: 5 }),
      links: {
        helm: "https://charts.bitnami.com/bitnami",
        documentation: "https://redis.io/docs/",
        git: "https://github.com/redis/redis",
        website: "https://redis.io/",
      },
    },
    {
      id: "postgresql",
      name: "PostgreSQL",
      summary: "Enterprise-grade relational database with extensions support",
      labels: ["database", "sql"],
      providers: ["vendor", "ironbank"],
      versionCount: 3,
      latestVersion: "16.2.0",
      imageCount: 3,
      cves: cves({ high: 1, medium: 3, low: 8 }),
      links: {
        helm: "https://charts.bitnami.com/bitnami",
        documentation: "https://www.postgresql.org/docs/",
        git: "https://github.com/postgres/postgres",
        website: "https://www.postgresql.org/",
      },
    },
    {
      id: "grafana",
      name: "Grafana",
      summary: "Observability platform for metrics, logs, and traces visualization",
      labels: ["observability", "monitoring"],
      providers: ["vendor", "chainguard"],
      versionCount: 3,
      latestVersion: "11.0.0",
      imageCount: 1,
      cves: cves({ critical: 1, high: 2, medium: 5, low: 3 }),
      links: {
        helm: "https://grafana.github.io/helm-charts",
        documentation: "https://grafana.com/docs/",
        git: "https://github.com/grafana/grafana",
        website: "https://grafana.com/",
      },
    },
    {
      id: "vault",
      name: "HashiCorp Vault",
      summary: "Secrets management and data protection platform",
      labels: ["security", "secrets"],
      providers: ["vendor", "ironbank"],
      versionCount: 3,
      latestVersion: "1.16.0",
      imageCount: 2,
      cves: cves({ high: 1, medium: 2, low: 4 }),
      links: {
        helm: "https://helm.releases.hashicorp.com",
        documentation: "https://developer.hashicorp.com/vault/docs",
        git: "https://github.com/hashicorp/vault",
        website: "https://www.vaultproject.io/",
      },
    },
  ],
};

export const mockCatalogDataResult: CatalogDataResult = {
  source: "mock",
  response: mockCatalogResponse,
  fetchedAt: Date.now(),
};

// Mock manifests matching ManifestV2 schema
export const mockManifests: Record<string, CatalogManifest> = {
  redis: {
    id: "redis",
    name: "Redis",
    summary: "In-memory data structure store for caching and message brokering",
    description: "Redis is an open source, in-memory data structure store used as a database, cache, message broker, and streaming engine.",
    category: "database",
    labels: ["database", "cache"],
    upstream: {
      helm: {
        repo: "https://charts.bitnami.com/bitnami",
        chart: "redis",
        documentation: "https://github.com/bitnami/charts/tree/main/bitnami/redis",
      },
      git: "https://github.com/redis/redis",
      website: "https://redis.io/",
    },
    ociRegistry: "ghcr.io/d0s-dev/apps/redis",
    versions: [
      {
        version: "24.1.2",
        chartVersion: "24.1.2",
        appVersion: "7.4.2",
        released: "2024-10-15T00:00:00Z",
        ociPackage: {
          amd64: "ghcr.io/d0s-dev/apps/redis:24.1.2-amd64",
          arm64: "ghcr.io/d0s-dev/apps/redis:24.1.2-arm64",
        },
        images: [
          { name: "docker.io/bitnami/redis:7.4.2-debian-12-r0", platforms: ["linux/amd64", "linux/arm64"] },
          { name: "docker.io/bitnami/redis-sentinel:7.4.2-debian-12-r0", platforms: ["linux/amd64", "linux/arm64"] },
        ],
        aggregates: cves({ medium: 1, low: 2 }),
      },
      {
        version: "24.1.0",
        chartVersion: "24.1.0",
        appVersion: "7.4.1",
        released: "2024-10-01T00:00:00Z",
        images: [
          { name: "docker.io/bitnami/redis:7.4.1-debian-12-r0" },
        ],
        aggregates: cves({ medium: 1, low: 3 }),
      },
    ],
    lastUpdated: "2024-10-15T00:00:00Z",
  },
};

/**
 * Aggregate severity counts across apps
 */
export function sumSeverity(apps: CatalogApp[]): CVESummary {
  return apps.reduce(
    (acc, app) => ({
      critical: acc.critical + (app.cves?.critical ?? 0),
      high: acc.high + (app.cves?.high ?? 0),
      medium: acc.medium + (app.cves?.medium ?? 0),
      low: acc.low + (app.cves?.low ?? 0),
    }),
    { critical: 0, high: 0, medium: 0, low: 0 },
  );
}
