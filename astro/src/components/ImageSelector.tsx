import React, { useState, useCallback, useRef, useEffect } from "react";
import { getImageShortName } from "../lib/catalog/utils";

export interface ImageSelectorProps {
  images: string[];
  selectedImages: string[];
  onSelectionChange: (selected: string[]) => void;
  dedupEnabled: boolean;
  onDedupChange: (enabled: boolean) => void;
}

export function ImageSelector({
  images,
  selectedImages,
  onSelectionChange,
  dedupEnabled,
  onDedupChange,
}: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allSelected = images.length > 0 && selectedImages.length === images.length;
  const someSelected = selectedImages.length > 0 && selectedImages.length < images.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAll = useCallback(() => {
    onSelectionChange(allSelected ? [] : [...images]);
  }, [allSelected, images, onSelectionChange]);

  const toggleImage = useCallback(
    (image: string) => {
      if (selectedImages.includes(image)) {
        onSelectionChange(selectedImages.filter((i) => i !== image));
      } else {
        onSelectionChange([...selectedImages, image]);
      }
    },
    [selectedImages, onSelectionChange],
  );

  if (images.length === 0) {
    return <span className="text-xs text-[#5C677D]">No images</span>;
  }

  const buttonLabel =
    selectedImages.length === 0
      ? "Select Images"
      : selectedImages.length === images.length
        ? `All Images (${images.length})`
        : `${selectedImages.length} of ${images.length} Images`;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded border border-[#023052] bg-[#001233] text-[#9BA3B5] hover:text-white hover:border-[#0466C8] transition"
      >
        <span>{buttonLabel}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 w-72 max-h-64 overflow-y-auto rounded border border-[#023052] bg-[#001233] shadow-lg">
          {/* Header controls */}
          <div className="flex items-center justify-between gap-4 px-3 py-2 border-b border-[#023052] bg-[#00101f] sticky top-0">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#9BA3B5] hover:text-white">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={toggleAll}
                className="w-3 h-3 rounded border-[#023052] bg-[#001233] text-[#0466C8] focus:ring-[#0466C8] focus:ring-offset-0"
              />
              <span>All</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#9BA3B5] hover:text-white">
              <input
                type="checkbox"
                checked={dedupEnabled}
                onChange={(e) => onDedupChange(e.target.checked)}
                className="w-3 h-3 rounded border-[#023052] bg-[#001233] text-[#0466C8] focus:ring-[#0466C8] focus:ring-offset-0"
              />
              <span>Dedup</span>
            </label>
          </div>

          {/* Image list */}
          <div className="py-1">
            {images.map((image) => (
              <label
                key={image}
                className="flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs text-[#9BA3B5] hover:text-white hover:bg-[#001a35]"
              >
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image)}
                  onChange={() => toggleImage(image)}
                  className="w-3 h-3 rounded border-[#023052] bg-[#001233] text-[#0466C8] focus:ring-[#0466C8] focus:ring-offset-0 flex-shrink-0"
                />
                <span className="font-mono truncate" title={image}>
                  {getImageShortName(image)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageSelector;
