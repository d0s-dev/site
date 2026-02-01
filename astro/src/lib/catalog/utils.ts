/**
 * Catalog utility functions
 */

/**
 * Sanitize an image reference for use in filenames.
 * Replaces only `/` and `:` with underscore, preserving dots.
 * Matches the actual file naming used by Syft/Zarf for SBOM files.
 * 
 * Example: "xpkg.crossplane.io/crossplane/crossplane:v2.1.3"
 *       -> "xpkg.crossplane.io_crossplane_crossplane_v2.1.3"
 */
export function sanitizeFilename(s: string): string {
  return s.replace(/[/:]/g, "_");
}

/**
 * Get the short display name for an image (last segment after /)
 */
export function getImageShortName(imageName: string): string {
  const parts = imageName.split("/");
  return parts[parts.length - 1] || imageName;
}

/**
 * Severity color mapping for CVE badges
 */
export const severityColors: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/40",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  unknown: "bg-gray-500/20 text-gray-400 border-gray-500/40",
};

/**
 * Get NVD link for a CVE ID
 */
export function getNVDLink(cveId: string): string {
  return `https://nvd.nist.gov/vuln/detail/${cveId}`;
}
