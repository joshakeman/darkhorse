"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { AssetLike } from "../../../../lib/image";
import { ctfImageUrl, ctfBlurDataURL } from "../../../../lib/image";

type Props = {
  images: AssetLike[]; // all gallery assets for the project
  title?: string; // fallback alt/caption
  className?: string; // optional wrapper classes for the chip row
  // Optional: pass a custom list/order of tags. If omitted, tags are derived from images.
  tagsOverride?: string[];
};

/** Read Contentful asset tags safely */
function getAssetTags(a: AssetLike): string[] {
  const raw = (a as any)?.metadata?.tags ?? [];
  return Array.isArray(raw)
    ? raw
        .map((t: any) => t?.sys?.id || t?.sys?.urn || t?.sys?.name)
        .filter(Boolean)
    : [];
}

/** Build a unique, sorted tag list from the images */
function uniqueTagsFrom(images: AssetLike[]): string[] {
  const set = new Set<string>();
  for (const a of images) getAssetTags(a).forEach((t) => set.add(t));
  return [...set].sort((a, b) => a.localeCompare(b));
}

export default function TagChipsLightbox({
  images,
  title = "",
  className,
  tagsOverride,
}: Props) {
  const tags =
    tagsOverride && tagsOverride.length > 0
      ? tagsOverride
      : uniqueTagsFrom(images);

  // Modal state
  const [open, setOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  // Filter images by active tag
  const filtered = useMemo(() => {
    if (!activeTag) return [];
    return images.filter((a) => getAssetTags(a).includes(activeTag));
  }, [images, activeTag]);

  const count = filtered.length;

  // Open for a tag
  const openForTag = useCallback((tag: string) => {
    setActiveTag(tag);
    setIdx(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + count) % count),
    [count]
  );
  const next = useCallback(() => setIdx((i) => (i + 1) % count), [count]);

  // Lock scroll when open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  // Touch swipe
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(delta) > 40) delta > 0 ? prev() : next();
  };

  // Current large image URLs/labels
  const { largeUrl, largeBlur, largeAlt, caption } = useMemo(() => {
    const a = filtered[idx];
    if (!a) return { largeUrl: "", largeBlur: "", largeAlt: "", caption: "" };
    return {
      largeUrl: ctfImageUrl(a, { w: 2000, q: 75, fm: "webp" }) || "",
      largeBlur: ctfBlurDataURL(a) || "",
      largeAlt: a?.fields?.title || title || "Image",
      caption: a?.fields?.description || "",
    };
  }, [filtered, idx, title]);

  return (
    <>
      {/* Chip row */}
      {tags.length > 0 && (
        <div
          className={["mt-3 flex flex-wrap gap-2", className || ""].join(" ")}
        >
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => openForTag(t)}
              className="cursor-pointer rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-900 ring-1 ring-black/5
                         hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
              aria-label={`View ${t} images`}
              title={`View ${t} images`}
            >
              {t.replace(/[-_]/g, " ")}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox modal (no grid) */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="relative mx-auto w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title above image */}
            {/* <div className="mb-3 text-center text-sm text-white/80">
              {activeTag
                ? `${activeTag.replace(/[-_]/g, " ")} from this project`
                : ""}
            </div> */}

            {/* Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/20">
              {largeUrl && (
                <Image
                  src={largeUrl}
                  alt={largeAlt}
                  fill
                  className="object-contain"
                  placeholder={largeBlur ? "blur" : undefined}
                  blurDataURL={largeBlur || undefined}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
              )}
            </div>

            {/* Caption */}
            {caption && (
              <div className="mt-3 text-center text-sm text-white/80">
                {caption}
              </div>
            )}

            {/* Close */}
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-lg backdrop-blur-sm hover:bg-white transition"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 8.586 4.707 3.293a1 1 0 1 0-1.414 1.414L8.586 10l-5.293 5.293a1 1 0 1 0 1.414 1.414L10 11.414l5.293 5.293a1 1 0 0 0 1.414-1.414L11.414 10l5.293-5.293A1 1 0 0 0 15.293 3.293L10 8.586Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Prev / Next */}
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-sm hover:bg-white transition"
                  aria-label="Previous image"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 15.707a1 1 0 0 1-1.414 0L6.586 11l4.707-4.707a1 1 0 1 1 1.414 1.414L9.414 11l3.293 3.293a1 1 0 0 1 0 1.414Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-sm hover:bg-white transition"
                  aria-label="Next image"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 4.293a1 1 0 0 1 1.414 0L13.414 9l-4.707 4.707a1 1 0 1 1-1.414-1.414L10.586 9 7.293 5.707a1 1 0 0 1 0-1.414Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/80">
                  {idx + 1} / {count}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
