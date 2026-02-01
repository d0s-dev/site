/**
 * Catalog Types - Aligned with d0s CLI schema (pkg/catalog/types.go)
 *
 * These types match the JSON output from:
 * - apps.json: Catalog with AppSummary[]
 * - manifest.json: ManifestV2 per-app details
 * - cves.json: CVE database
 */

// ============================================================================
// apps.json types (from d0s CLI Catalog/AppSummary)
// ============================================================================

/**
 * Main catalog response from apps.json
 * Matches Go type: catalog.Catalog
 */
export interface CatalogResponse {
  version: string;
  lastUpdated: string;
  apps: CatalogApp[];
}

/**
 * App summary for catalog listing
 * Matches Go type: catalog.AppSummary
 */
export interface CatalogApp {
  id: string;
  name: string;
  summary: string;
  labels?: string[];
  providers?: string[]; // e.g., ["vendor", "ironbank", "chainguard"]
  versionCount: number;
  latestVersion: string;
  imageCount: number;
  cves: CVESummary;
  links?: AppLinks;
}

/**
 * CVE severity counts
 * Matches Go type: catalog.CVESummary
 */
export interface CVESummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

/**
 * External links for an app
 * Matches Go type: catalog.AppLinks
 */
export interface AppLinks {
  helm?: string;
  documentation?: string;
  git?: string;
  website?: string;
}

// ============================================================================
// manifest.json types (from d0s CLI ManifestV2)
// ============================================================================

/**
 * Per-app manifest with full details
 * Matches Go type: catalog.ManifestV2
 */
export interface CatalogManifest {
  id: string;
  name: string;
  summary?: string;
  description: string;
  category?: string;
  labels?: string[];
  upstream: ManifestUpstream;
  ociRegistry?: string;
  versions: VersionEntry[];
  lastUpdated: string;
}

/**
 * Upstream source information
 * Matches Go type: catalog.UpstreamV2
 */
export interface ManifestUpstream {
  helm: HelmUpstream;
  git?: string;
  website?: string;
}

/**
 * Helm chart information
 * Matches Go type: catalog.HelmUpstreamV2
 */
export interface HelmUpstream {
  repo: string;
  chart: string;
  documentation?: string;
}

/**
 * Version entry with images and CVE data
 * Matches Go type: catalog.VersionEntry
 */
export interface VersionEntry {
  version: string;
  chartVersion: string;
  appVersion?: string;
  released?: string;
  ociPackage?: Record<string, string>; // arch -> OCI URL
  images?: ImageEntry[];
  aggregates?: CVESummary;
  builtAt?: string; // ISO timestamp of last build
  scannedAt?: string; // ISO timestamp of last CVE scan
}

/**
 * Container image entry
 * Matches Go type: catalog.ImageEntry
 */
export interface ImageEntry {
  name: string;
  digest?: string;
  platforms?: string[];
}

// ============================================================================
// Data fetching types
// ============================================================================

export type CatalogSource = "remote" | "cache" | "mock" | "local";

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

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Check if an app has a specific provider
 * Use instead of hardcoded hasIronBank/hasChainguard booleans
 */
export function hasProvider(app: CatalogApp, provider: string): boolean {
  return app.providers?.includes(provider) ?? false;
}

/**
 * Get total CVE count for an app
 */
export function totalCVEs(cves: CVESummary): number {
  return cves.critical + cves.high + cves.medium + cves.low;
}
