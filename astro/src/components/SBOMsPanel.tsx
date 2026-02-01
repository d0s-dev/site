import React, { useState, useEffect, useCallback } from "react";
import { ImageSelector } from "./ImageSelector";
import { SBOMTable, type SBOMEntry } from "./SBOMTable";
import { getSBOMUrl, getSBOMViewerUrl, getGitHubBrowseUrl } from "../lib/catalog/data-source";
import { getImageShortName } from "../lib/catalog/utils";

interface SyftArtifact {
  name: string;
  version: string;
  type: string;
  licenses?: Array<{ value?: string; spdxExpression?: string }>;
  purl?: string;
}

interface SyftSBOM {
  artifacts: SyftArtifact[];
  distro?: { prettyName?: string };
}

export interface SBOMsPanelProps {
  appId: string;
  version: string;
  images: string[];
}

export function SBOMsPanel({ appId, version, images }: SBOMsPanelProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>(images.length > 0 ? [images[0]] : []);
  const [dedupEnabled, setDedupEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sbomData, setSbomData] = useState<SBOMEntry[]>([]);
  const [notAvailable, setNotAvailable] = useState(false);

  // Fetch SBOM data for selected images
  const fetchSBOMs = useCallback(async () => {
    if (selectedImages.length === 0) {
      setSbomData([]);
      setNotAvailable(false);
      return;
    }

    setLoading(true);
    setNotAvailable(false);

    const allPackages: SBOMEntry[] = [];
    let anySuccess = false;

    await Promise.all(
      selectedImages.map(async (imageName) => {
        try {
          const url = getSBOMUrl(appId, version, imageName);
          const response = await fetch(url);
          
          if (!response.ok) {
            console.warn(`SBOM not found for ${imageName}: ${response.status}`);
            return;
          }

          const data: SyftSBOM = await response.json();
          
          // Check if artifacts array exists and has content
          if (!data.artifacts || data.artifacts.length === 0) {
            console.warn(`SBOM for ${imageName} has no artifacts`);
            return;
          }

          anySuccess = true;

          const imageShortName = getImageShortName(imageName);
          
          for (const artifact of data.artifacts) {
            // Extract first license value
            let license: string | undefined;
            if (artifact.licenses && artifact.licenses.length > 0) {
              const lic = artifact.licenses[0];
              license = lic.spdxExpression || lic.value;
            }

            allPackages.push({
              name: artifact.name,
              version: artifact.version,
              type: artifact.type,
              license,
              imageSource: imageShortName,
            });
          }
        } catch (err) {
          console.warn(`Failed to fetch SBOM for ${imageName}:`, err);
        }
      })
    );

    if (!anySuccess && selectedImages.length > 0) {
      setNotAvailable(true);
      setSbomData([]);
    } else {
      // Apply deduplication if enabled (by name + version)
      let finalPackages = allPackages;
      if (dedupEnabled) {
        const seen = new Map<string, SBOMEntry>();
        for (const pkg of allPackages) {
          const key = `${pkg.name}@${pkg.version}`;
          if (!seen.has(key)) {
            seen.set(key, pkg);
          }
        }
        finalPackages = Array.from(seen.values());
      }
      setSbomData(finalPackages);
    }

    setLoading(false);
  }, [appId, version, selectedImages, dedupEnabled]);

  // Fetch when selection changes
  useEffect(() => {
    fetchSBOMs();
  }, [fetchSBOMs]);

  // Get download/viewer URLs for first selected image
  const downloadUrl = selectedImages.length === 1
    ? getSBOMUrl(appId, version, selectedImages[0])
    : undefined;

  const viewerUrl = selectedImages.length === 1
    ? getSBOMViewerUrl(appId, version, selectedImages[0])
    : undefined;

  const githubUrl = getGitHubBrowseUrl(appId, version, "sboms");

  // Show image source column when multiple images selected and dedup is off
  const showImageSource = selectedImages.length > 1 && !dedupEnabled;

  return (
    <div className="space-y-4">
      {/* Header row with image selector and actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {images.length > 0 && (
            <ImageSelector
              images={images}
              selectedImages={selectedImages}
              onSelectionChange={setSelectedImages}
              dedupEnabled={dedupEnabled}
              onDedupChange={setDedupEnabled}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {viewerUrl && (
            <a
              href={viewerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#023052] bg-[#001233] text-[#9BA3B5] hover:text-white hover:border-[#0466C8] transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Viewer
            </a>
          )}
          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#023052] bg-[#001233] text-[#9BA3B5] hover:text-white hover:border-[#0466C8] transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          )}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#023052] bg-[#001233] text-[#9BA3B5] hover:text-white hover:border-[#0466C8] transition"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid gap-3 grid-cols-3">
        <div className="rounded-lg border border-[#023052] bg-[#001233] p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#5C677D]">
            Packages
          </p>
          <p className="mt-1 text-xl font-semibold text-white">
            {loading ? "—" : sbomData.length}
          </p>
        </div>
        <div className="rounded-lg border border-[#023052] bg-[#001233] p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#5C677D]">
            Types
          </p>
          <p className="mt-1 text-xl font-semibold text-white">
            {loading ? "—" : new Set(sbomData.map((p) => p.type)).size}
          </p>
        </div>
        <div className="rounded-lg border border-[#023052] bg-[#001233] p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#5C677D]">
            Images
          </p>
          <p className="mt-1 text-xl font-semibold text-white">
            {selectedImages.length}
          </p>
        </div>
      </div>

      {/* SBOM Table */}
      <SBOMTable
        data={sbomData}
        loading={loading}
        notAvailable={notAvailable}
        showImageSource={showImageSource}
      />
    </div>
  );
}

export default SBOMsPanel;
