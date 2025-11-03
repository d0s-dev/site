import type {
  CatalogDataResult,
  CatalogManifest,
  CatalogResponse,
  ProviderVariant,
  SeveritySummary,
} from "./types";

const severity = (
  overrides: Partial<SeveritySummary> = {},
): SeveritySummary => ({
  critical: 0,
  high: 0,
  medium: 0,
  low: 0,
  ...overrides,
});

const providerVariant = (
  overrides: Partial<ProviderVariant> = {},
): ProviderVariant => ({
  displayName: "Vendor",
  summary: undefined,
  versions: [],
  ...overrides,
});

export const mockCatalogResponse: CatalogResponse = {
  version: "mock-1.0.0",
  lastUpdated: "2024-11-02T00:00:00Z",
  apps: [
    {
      id: "keycloak",
      name: "Keycloak Identity Provider",
      summary:
        "Identity and access management platform configured for disconnected deployments.",
      labels: ["identity", "core"],
      providers: ["vendor", "ironbank"],
      hasIronBank: true,
      hasChainguard: false,
      imageCount: 12,
      versionCount: 2,
      buildCount: 12,
      cves: severity({ high: 1, medium: 4, low: 5 }),
      latestVersion: "23.0.0",
      zarfPackage: "packages/keycloak",
      links: {
        documentation: "/docs/cli",
        git: "https://github.com/keycloak/keycloak",
        website: "https://www.keycloak.org/",
      },
    },
    {
      id: "podinfo",
      name: "Podinfo Demo App",
      summary: "Reference microservice used to verify supply chain automation.",
      labels: ["demo", "observability"],
      providers: ["vendor"],
      hasIronBank: false,
      hasChainguard: true,
      imageCount: 4,
      versionCount: 2,
      buildCount: 4,
      cves: severity({ medium: 1, low: 3 }),
      latestVersion: "6.4.0",
      zarfPackage: "packages/podinfo",
      links: {
        documentation: "/docs/catalog",
        git: "https://github.com/stefanprodan/podinfo",
        website: "https://podinfo.dev/",
      },
    },
    {
      id: "headlamp",
      name: "Headlamp UI",
      summary:
        "Kubernetes management UI bundled with offline telemetry plugins.",
      labels: ["kubernetes", "ui"],
      providers: ["vendor", "chainguard"],
      hasIronBank: false,
      hasChainguard: true,
      imageCount: 9,
      versionCount: 2,
      buildCount: 9,
      cves: severity({ critical: 1, high: 2, medium: 3, low: 2 }),
      latestVersion: "0.21.0",
      zarfPackage: "packages/headlamp",
      links: {
        documentation: "/docs/catalog",
        git: "https://github.com/headlamp-k8s/headlamp",
        website: "https://headlamp.dev/",
      },
    },
    {
      id: "flux",
      name: "Flux GitOps Toolkit",
      summary:
        "GitOps controller bundle with hardened policies and dashboards.",
      labels: ["gitops", "community"],
      providers: ["vendor", "ironbank"],
      hasIronBank: true,
      hasChainguard: false,
      imageCount: 7,
      versionCount: 2,
      buildCount: 7,
      cves: severity({ high: 1, medium: 2, low: 4 }),
      latestVersion: "2.3.0",
      zarfPackage: "packages/flux",
      links: {
        documentation: "/docs/catalog",
        git: "https://github.com/fluxcd/flux2",
        website: "https://fluxcd.io/",
      },
    },
  ],
};

export const mockCatalogDataResult: CatalogDataResult = {
  source: "mock",
  response: mockCatalogResponse,
  fetchedAt: Date.now(),
};

export const mockManifests: Record<string, CatalogManifest> = {
  keycloak: {
    id: "keycloak",
    name: "Keycloak Identity Provider",
    description:
      "Identity and access management platform with SSO, LDAP bridge, and OIDC support.",
    providers: {
      vendor: providerVariant({
        displayName: "Upstream",
        versions: [
          {
            version: "23.0.0",
            releasedAt: "2024-09-15",
            urls: {
              documentation: "https://www.keycloak.org/docs",
              package:
                "https://github.com/d0s-dev/apps/releases/download/keycloak-23.0.0/keycloak.tar.zst",
            },
            images: [
              {
                name: "keycloak",
                tag: "23.0.0",
                digest: "sha256:1234",
                sbom: "https://github.com/d0s-dev/apps/releases/download/keycloak-23.0.0/keycloak.sbom.json",
                cves: severity({ high: 1, medium: 2 }),
              },
            ],
          },
        ],
      }),
      ironbank: providerVariant({
        displayName: "Iron Bank",
        versions: [
          {
            version: "23.0.0-ib",
            releasedAt: "2024-09-20",
            urls: {
              registry: "registry1.dso.mil/ironbank/d0s/keycloak:23.0.0",
            },
            images: [
              {
                name: "keycloak",
                tag: "23.0.0-ib",
                digest: "sha256:abcd",
                cves: severity({ medium: 1, low: 2 }),
              },
            ],
          },
        ],
      }),
    },
  },
  podinfo: {
    id: "podinfo",
    name: "Podinfo Demo App",
    description:
      "Demo workload used for platform smoke tests and observability drills.",
    providers: {
      vendor: providerVariant({
        displayName: "Upstream",
        versions: [
          {
            version: "6.4.0",
            releasedAt: "2024-08-10",
            images: [
              {
                name: "podinfo",
                tag: "6.4.0",
                digest: "sha256:9876",
                cves: severity({ low: 3 }),
              },
            ],
          },
        ],
      }),
      chainguard: providerVariant({
        displayName: "Chainguard",
        versions: [
          {
            version: "6.4.0-cg",
            releasedAt: "2024-09-01",
            images: [
              {
                name: "podinfo",
                tag: "6.4.0-cg",
                digest: "sha256:6543",
                cves: severity({ medium: 1 }),
              },
            ],
          },
        ],
      }),
    },
  },
  headlamp: {
    id: "headlamp",
    name: "Headlamp UI",
    description:
      "Kubernetes UI for cluster operators with progressive web bundles.",
    providers: {
      vendor: providerVariant({
        versions: [
          {
            version: "0.21.0",
            releasedAt: "2024-07-02",
            images: [
              {
                name: "headlamp",
                tag: "0.21.0",
                digest: "sha256:2222",
                cves: severity({ critical: 1, high: 2 }),
              },
            ],
          },
        ],
      }),
      chainguard: providerVariant({
        versions: [
          {
            version: "0.21.0-cg",
            images: [
              {
                name: "headlamp",
                tag: "0.21.0-cg",
                digest: "sha256:3333",
                cves: severity({ high: 1, medium: 2 }),
              },
            ],
          },
        ],
      }),
    },
  },
  flux: {
    id: "flux",
    name: "Flux GitOps Toolkit",
    description:
      "GitOps controller suite with hardened policies and telemetry dashboards.",
    providers: {
      vendor: providerVariant({
        versions: [
          {
            version: "2.3.0",
            releasedAt: "2024-11-02",
            images: [
              {
                name: "flux",
                tag: "2.3.0",
                digest: "sha256:4444",
                cves: severity({ high: 1, medium: 2, low: 4 }),
              },
            ],
          },
        ],
      }),
      ironbank: providerVariant({
        versions: [
          {
            version: "2.3.0-ib",
            images: [
              {
                name: "flux",
                tag: "2.3.0-ib",
                digest: "sha256:5555",
                cves: severity({ medium: 1, low: 2 }),
              },
            ],
          },
        ],
      }),
    },
  },
};

export const sumSeverity = (apps: CatalogResponse["apps"]): SeveritySummary =>
  apps.reduce(
    (acc, app) => ({
      critical: acc.critical + (app.cves.critical ?? 0),
      high: acc.high + (app.cves.high ?? 0),
      medium: acc.medium + (app.cves.medium ?? 0),
      low: acc.low + (app.cves.low ?? 0),
    }),
    severity(),
  );
