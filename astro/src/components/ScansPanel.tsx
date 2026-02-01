import React, { useState, useEffect, useCallback } from "react";
import { ImageSelector } from "./ImageSelector";
import { CVETable, type CVEEntry } from "./CVETable";
import { getScanUrl, getGitHubBrowseUrl } from "../lib/catalog/data-source";
import { sanitizeFilename, getImageShortName } from "../lib/catalog/utils";

interface ScanResult {
  image: string;
  scanTime?: string;
  matches: Array<{
    id: string;
    severity: string;
    package: string;
    version: string;
    fixedIn?: string;
    description?: string;
    urls?: string[];
  }>;
}

export interface ScansPanelProps {
  appId: string;
  version: string;
  images: string[];
}

export function ScansPanel({ appId, version, images }: ScansPanelProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>(images.length > 0 ? [images[0]] : []);
  const [dedupEnabled, setDedupEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cveData, setCveData] = useState<CVEEntry[]>([]);
  const [notAvailable, setNotAvailable] = useState(false);
  const [fetchedImages, setFetchedImages] = useState<Set<string>>(new Set());

  // Fetch scan data for selected images
  const fetchScans = useCallback(async () => {
    if (selectedImages.length === 0) {
      setCveData([]);
      setNotAvailable(false);
      return;
    }

    setLoading(true);
    setNotAvailable(false);

    const allCves: CVEEntry[] = [];
    let anySuccess = false;

    await Promise.all(
      selectedImages.map(async (imageName) => {
        try {
          const url = getScanUrl(appId, version, imageName);
          const response = await fetch(url);
          
          if (!response.ok) {
            console.warn(`Scan not found for ${imageName}: ${response.status}`);
            return;
          }

          const data: ScanResult = await response.json();
          anySuccess = true;

          const imageShortName = getImageShortName(imageName);
          
          for (const match of data.matches || []) {
            allCves.push({
              id: match.id,
              severity: match.severity,
              package: match.package,
              version: match.version,
              fixedIn: match.fixedIn,
              description: match.description,
              urls: match.urls,
              imageSource: imageShortName,
            });
          }
        } catch (err) {
          console.warn(`Failed to fetch scan for ${imageName}:`, err);
        }
      })
    );

    if (!anySuccess && selectedImages.length > 0) {
      setNotAvailable(true);
      setCveData([]);
    } else {
      // Apply deduplication if enabled
      let finalCves = allCves;
      if (dedupEnabled) {
        const seen = new Map<string, CVEEntry>();
        for (const cve of allCves) {
          if (!seen.has(cve.id)) {
            seen.set(cve.id, cve);
          }
        }
        finalCves = Array.from(seen.values());
      }
      setCveData(finalCves);
    }

    setFetchedImages(new Set(selectedImages));
    setLoading(false);
  }, [appId, version, selectedImages, dedupEnabled]);

  // Fetch when selection changes
  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  // Get download URL for first selected image (or null if none)
  const downloadUrl = selectedImages.length === 1
    ? getScanUrl(appId, version, selectedImages[0])
    : undefined;

  const githubUrl = getGitHubBrowseUrl(appId, version, "scans");

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

      {/* Severity summary cards */}
      <div className="grid gap-3 grid-cols-4">
        {(["critical", "high", "medium", "low"] as const).map((severity) => {
          const count = cveData.filter(
            (cve) => cve.severity.toLowerCase() === severity
          ).length;
          const colorMap = {
            critical: "text-red-400",
            high: "text-orange-400",
            medium: "text-yellow-400",
            low: "text-blue-400",
          };
          return (
            <div
              key={severity}
              className="rounded-lg border border-[#023052] bg-[#001233] p-3 text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#5C677D]">
                {severity}
              </p>
              <p className={`mt-1 text-xl font-semibold ${colorMap[severity]}`}>
                {loading ? "—" : count}
              </p>
            </div>
          );
        })}
      </div>

      {/* CVE Table */}
      <CVETable
        data={cveData}
        loading={loading}
        notAvailable={notAvailable}
        showImageSource={showImageSource}
      />
    </div>
  );
}

export default ScansPanel;
