"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  type AssetLike,
  ctfImageUrl,
  ctfBlurDataURL,
  IMG_PRESETS,
} from "../../../../lib/image";

type Props = {
  images: AssetLike[];
  title?: string;
  className?: string;
};

export default function LightboxGrid({ images, title = "", className }: Props) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const count = images.length;

  const openAt = useCallback((i: number) => {
    setIdx(i);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + count) % count),
    [count]
  );
  const next = useCallback(() => setIdx((i) => (i + 1) % count), [count]);

  // Lock scroll when modal open
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

  // Touch swipe (basic)
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

  // Current image info
  const { largeUrl, largeBlur, largeAlt, caption } = useMemo(() => {
    const a = images[idx];
    const url = ctfImageUrl(a, { w: 2000, q: 75, fm: "webp" });
    const blur = ctfBlurDataURL(a);
    const alt = a?.fields?.title || title || "Image";
    const cap = a?.fields?.description || null;
    return { largeUrl: url, largeBlur: blur, largeAlt: alt, caption: cap };
  }, [images, idx, title]);

  return (
    <>
      {/* Grid of thumbnails */}
      <div
        className={["grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className]
          .filter(Boolean)
          .join(" ")}
      >
        {images.map((asset, i) => {
          const thumbUrl = ctfImageUrl(asset, {
            w: IMG_PRESETS.CARD.maxW,
            q: 70,
            fm: "webp",
          });
          if (!thumbUrl) return null;

          const blur = ctfBlurDataURL(asset);
          const alt = asset.fields?.title || title || "Image";
          const cap = asset.fields?.description;

          return (
            <figure key={asset.sys?.id ?? `${i}`} className="group">
              <button
                type="button"
                onClick={() => openAt(i)}
                className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 cursor-pointer"
                aria-label={`Open image ${i + 1} of ${count}`}
                title={alt}
              >
                <Image
                  src={thumbUrl}
                  alt={alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  placeholder={blur ? "blur" : undefined}
                  blurDataURL={blur || undefined}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </button>

              {cap && (
                <figcaption className="mt-1 text-center text-xs text-neutral-600">
                  {cap}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {/* Modal / Lightbox */}
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
            {/* Large image */}
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
            {(caption || largeAlt) && (
              <div className="mt-3 mb-8 text-center text-sm text-white/80">
                {caption || largeAlt}
              </div>
            )}

            {/* Dark translucent controls */}
            <button
              type="button"
              onClick={close}
              className="cursor-pointer absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md hover:bg-black/80 transition"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 8.586 4.707 3.293a1 1 0 0 0-1.414 1.414L8.586 10l-5.293 5.293a1 1 0 0 0 1.414 1.414L10 11.414l5.293 5.293a1 1 0 0 0 1.414-1.414L11.414 10l5.293-5.293a1 1 0 0 0-1.414-1.414L10 8.586Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-md hover:bg-black/80 transition"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
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
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-md hover:bg-black/80 transition"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 4.293a1 1 0 0 1 1.414 0L13.414 9 8.707 13.707a1 1 0 1 1-1.414-1.414L10.586 9 7.293 5.707a1 1 0 0 1 0-1.414Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Counter */}
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
