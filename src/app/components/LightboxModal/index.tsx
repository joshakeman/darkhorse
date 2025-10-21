"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  type AssetLike,
  ctfImageUrl,
  ctfBlurDataURL,
} from "../../../../lib/image";

type LightboxModalProps = {
  images: AssetLike[];
  title?: string; // fallback alt text
  open: boolean;
  startIndex?: number;
  onClose: () => void;
  categoryLabel?: string; // e.g. "Built-Ins"
  projectTitle?: string; // e.g. "Fairway Remodel"
};

export default function LightboxModal({
  images,
  title = "",
  open,
  startIndex = 0,
  onClose,
  categoryLabel,
  projectTitle,
}: LightboxModalProps) {
  const [idx, setIdx] = useState(startIndex);
  const count = images.length;

  // keep idx in range if prop changes
  useEffect(() => {
    setIdx(Math.min(Math.max(0, startIndex), Math.max(0, count - 1)));
  }, [startIndex, count]);

  const prev = useCallback(
    () => setIdx((i) => (i - 1 + count) % count),
    [count]
  );
  const next = useCallback(() => setIdx((i) => (i + 1) % count), [count]);

  // body scroll lock
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // esc / arrows
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, prev, next]);

  // swipe
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) =>
    (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(delta) > 40) (delta > 0 ? prev : next)();
  };

  const { url, blur, alt, caption } = useMemo(() => {
    const a = images[idx];
    const u = ctfImageUrl(a, { w: 2000, q: 75, fm: "webp" });
    const b = ctfBlurDataURL(a);
    return {
      url: u,
      blur: b,
      alt: a?.fields?.title || title || "Image",
      caption: a?.fields?.description || null,
    };
  }, [images, idx, title]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="relative mx-auto w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        {(categoryLabel || projectTitle) && (
          <div className="mb-4 text-center text-white">
            <h2 className="text-lg md:text-xl font-semibold">
              {categoryLabel
                ? `${categoryLabel} from ${projectTitle ?? "this project"}`
                : projectTitle}
            </h2>
          </div>
        )}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/20">
          {url && (
            <Image
              src={url}
              alt={alt}
              fill
              className="object-contain"
              placeholder={blur ? "blur" : undefined}
              blurDataURL={blur || undefined}
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          )}
        </div>

        {(caption || alt) && (
          <div className="mt-3 text-center text-sm text-white/80 mb-8">
            {caption || alt}
          </div>
        )}

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer absolute right-4 top-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/95 text-neutral-800 shadow-lg backdrop-blur-sm hover:bg-white transition"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M10 8.586 4.707 3.293a1 1 0 0 0-1.414 1.414L8.586 10l-5.293 5.293a1 1 0 0 0 1.414 1.414L10 11.414l5.293 5.293a1 1 0 0 0 1.414-1.414L11.414 10l5.293-5.293a1 1 0 0 0-1.414-1.414L10 8.586Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Arrows */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-sm hover:bg-white transition"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
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
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-sm hover:bg-white transition"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 4.293a1 1 0 0 1 1.414 0L13.414 9 8.707 13.707a1 1 0 1 1-1.414-1.414L10.586 9 7.293 5.707a1 1 0 0 1 0-1.414Z"
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
  );
}
