export interface CatalogApp {
  id: string;
  name: string;
  summary: string;
  labels: string[];
  providers: string[];
  hasIronBank: boolean;
  hasChainguard: boolean;
  imageCount: number;
  versionCount?: number;
  buildCount?: number;
  cves: SeveritySummary;
  latestVersion: string;
  zarfPackage: string;
  links: CatalogLinks;
}

export interface CatalogLinks {
  helm?: string;
  documentation?: string;
  git?: string;
  website?: string;
  sbom?: string;
}

export interface SeveritySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface CatalogResponse {
  version: string;
  lastUpdated: string;
  apps: CatalogApp[];
}

export interface CatalogManifest {
  id: string;
  name: string;
  description?: string;
  upstream?: {
    homepage?: string;
    documentation?: string;
    repository?: string;
  };
  providers: Record<string, ProviderVariant>;
  zarfPackage?: string;
  metadata?: Record<string, unknown>;
}

export interface ProviderVariant {
  displayName?: string;
  summary?: string;
  versions: ProviderVersion[];
}

export interface ProviderVersion {
  version: string;
  releasedAt?: string;
  urls?: VersionUrls;
  images?: ProviderImage[];
  sbom?: string;
  notes?: string;
}

export interface VersionUrls {
  package?: string;
  documentation?: string;
  changelog?: string;
  registry?: string;
}

export interface ProviderImage {
  name: string;
  tag?: string;
  digest?: string;
  sbom?: string;
  cves?: SeveritySummary;
}

export type CatalogSource = "remote" | "cache" | "mock";

export interface CatalogDataResult {
  source: CatalogSource;
  response: CatalogResponse;
  fetchedAt: number;
}

export interface CatalogManifestResult {
  source: CatalogSource;
  manifest: CatalogManifest;
  fetchedAt: number;
}
