import React, { useState, useCallback } from "react";
import { getGitHubBrowseUrl } from "../lib/catalog/data-source";
import type { CatalogManifest, VersionEntry, ImageEntry } from "../lib/catalog/types";

// Icons
const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-3.5 h-3.5"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export interface OverviewPanelProps {
  appId: string;
  version: string;
  manifest: CatalogManifest;
  selectedVersion: VersionEntry;
}

const DEFAULT_ARCHES = ["amd64", "arm64"];

export function OverviewPanel({ appId, version, manifest, selectedVersion }: OverviewPanelProps) {
  const [selectedArch, setSelectedArch] = useState("amd64");
  const [copied, setCopied] = useState(false);

  // Get available architectures from ociPackage or fallback
  const availableArches = selectedVersion.ociPackage
    ? Object.keys(selectedVersion.ociPackage)
    : DEFAULT_ARCHES;

  // Build OCI path: oci://ghcr.io/d0s-dev/apps/{app}:{version}
  const ociPath = manifest.ociRegistry
    ? `oci://${manifest.ociRegistry}:${version}`
    : `oci://ghcr.io/d0s-dev/apps/${appId}:${version}`;

  const zarfCommand = `zarf package deploy -a ${selectedArch} ${ociPath}`;

  const githubUrl = getGitHubBrowseUrl(appId, version);

  const images = selectedVersion.images ?? [];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(zarfCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [zarfCommand]);

  return (
    <div className="space-y-6">
      {/* Header with GitHub link */}
      <div className="flex items-center justify-end gap-2">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#023052] bg-[#001233] text-xs text-[#7EA8FF] hover:border-[#0466C8] hover:text-white transition"
        >
          <GitHubIcon />
          <span>GitHub</span>
        </a>
      </div>

      {/* Zarf Deploy Command */}
      <div className="rounded-xl border border-[#023052] bg-[#001233] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Deploy Command</h3>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#5C677D]">Architecture:</label>
            <select
              value={selectedArch}
              onChange={(e) => setSelectedArch(e.target.value)}
              className="px-2 py-1 text-xs rounded border border-[#023052] bg-[#00101F] text-white focus:border-[#0466C8] focus:outline-none"
            >
              {availableArches.map((arch) => (
                <option key={arch} value={arch}>
                  {arch}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 rounded-lg bg-[#00101F] text-sm font-mono text-[#7EA8FF] overflow-x-auto">
            {zarfCommand}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#023052] bg-[#001233] text-xs text-[#9BA3B5] hover:text-white hover:border-[#0466C8] transition"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <CheckIcon />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* App Description */}
      {manifest.summary && (
        <div className="rounded-xl border border-[#023052] bg-[#001233] p-4">
          <h3 className="text-sm font-medium text-white mb-2">Description</h3>
          <p className="text-sm text-[#9BA3B5]">{manifest.summary}</p>
        </div>
      )}

      {/* Version Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#023052] bg-[#001233] p-3 text-center">
          <div className="text-xs uppercase tracking-wider text-[#5C677D] mb-1">App Version</div>
          <div className="text-sm font-medium text-white">
            {selectedVersion.appVersion || version}
          </div>
        </div>
        <div className="rounded-xl border border-[#023052] bg-[#001233] p-3 text-center">
          <div className="text-xs uppercase tracking-wider text-[#5C677D] mb-1">Chart Version</div>
          <div className="text-sm font-medium text-white">{selectedVersion.chartVersion}</div>
        </div>
        {selectedVersion.released && (
          <div className="rounded-xl border border-[#023052] bg-[#001233] p-3 text-center">
            <div className="text-xs uppercase tracking-wider text-[#5C677D] mb-1">Released</div>
            <div className="text-sm font-medium text-white">
              {new Date(selectedVersion.released).toLocaleDateString()}
            </div>
          </div>
        )}
        <div className="rounded-xl border border-[#023052] bg-[#001233] p-3 text-center">
          <div className="text-xs uppercase tracking-wider text-[#5C677D] mb-1">Images</div>
          <div className="text-sm font-medium text-white">{images.length}</div>
        </div>
      </div>

      {/* CVE Summary (if available) */}
      {selectedVersion.aggregates && (
        <div className="rounded-xl border border-[#023052] bg-[#001233] p-4">
          <h3 className="text-sm font-medium text-white mb-3">Vulnerability Summary</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-lg bg-[#00101F] p-2 text-center">
              <div className="text-lg font-bold text-red-500">
                {selectedVersion.aggregates.critical}
              </div>
              <div className="text-xs text-[#5C677D]">Critical</div>
            </div>
            <div className="rounded-lg bg-[#00101F] p-2 text-center">
              <div className="text-lg font-bold text-orange-500">
                {selectedVersion.aggregates.high}
              </div>
              <div className="text-xs text-[#5C677D]">High</div>
            </div>
            <div className="rounded-lg bg-[#00101F] p-2 text-center">
              <div className="text-lg font-bold text-yellow-500">
                {selectedVersion.aggregates.medium}
              </div>
              <div className="text-xs text-[#5C677D]">Medium</div>
            </div>
            <div className="rounded-lg bg-[#00101F] p-2 text-center">
              <div className="text-lg font-bold text-blue-400">
                {selectedVersion.aggregates.low}
              </div>
              <div className="text-xs text-[#5C677D]">Low</div>
            </div>
          </div>
        </div>
      )}

      {/* Helm Chart Info */}
      {manifest.upstream?.helm && (
        <div className="rounded-xl border border-[#023052] bg-[#001233] p-4">
          <h3 className="text-sm font-medium text-white mb-3">Helm Chart</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#5C677D]">Chart:</span>
              <span className="font-mono text-white">{manifest.upstream.helm.chart}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5C677D]">Repository:</span>
              <a
                href={manifest.upstream.helm.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[#7EA8FF] hover:text-white flex items-center gap-1"
              >
                {manifest.upstream.helm.repo}
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Images List */}
      {images.length > 0 && (
        <div className="rounded-xl border border-[#023052] bg-[#001233] p-4">
          <h3 className="text-sm font-medium text-white mb-3">Container Images</h3>
          <div className="space-y-2">
            {images.map((image: ImageEntry, idx: number) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 p-2 rounded-lg bg-[#00101F] text-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-white truncate" title={image.name}>
                    {image.name}
                  </div>
                  {image.platforms && image.platforms.length > 0 && (
                    <div className="text-xs text-[#5C677D] mt-0.5">
                      {image.platforms.join(", ")}
                    </div>
                  )}
                </div>
                {image.digest && (
                  <div className="text-xs font-mono text-[#5C677D] shrink-0">
                    {image.digest.substring(0, 12)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(manifest.upstream?.git ||
        manifest.upstream?.website ||
        manifest.upstream?.helm?.documentation) && (
        <div className="rounded-xl border border-[#023052] bg-[#001233] p-4">
          <h3 className="text-sm font-medium text-white mb-3">Links</h3>
          <div className="flex flex-wrap gap-2">
            {manifest.upstream?.helm?.documentation && (
              <a
                href={manifest.upstream.helm.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#023052] bg-[#00101F] text-xs text-[#7EA8FF] hover:border-[#0466C8] hover:text-white transition"
              >
                Documentation
                <ExternalLinkIcon />
              </a>
            )}
            {manifest.upstream?.website && (
              <a
                href={manifest.upstream.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#023052] bg-[#00101F] text-xs text-[#7EA8FF] hover:border-[#0466C8] hover:text-white transition"
              >
                Website
                <ExternalLinkIcon />
              </a>
            )}
            {manifest.upstream?.git && (
              <a
                href={manifest.upstream.git}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#023052] bg-[#00101F] text-xs text-[#7EA8FF] hover:border-[#0466C8] hover:text-white transition"
              >
                Source Code
                <ExternalLinkIcon />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OverviewPanel;
