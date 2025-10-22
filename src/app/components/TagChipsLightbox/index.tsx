"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  type AssetLike,
  ctfImageUrl,
  ctfBlurDataURL,
} from "../../../../lib/image";

// ——— Utils ———
function tagId(a: AssetLike) {
  return a?.metadata?.tags?.[0]?.sys?.id ?? null; // first tag if present
}
function tagLabel(id: string) {
  // simple labelizer; adjust if you have nicer names in Contentful concepts
  return id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type Props = {
  images: AssetLike[];
  title?: string; // project title (fallback for alt/caption)
  className?: string;
};

export default function TagChipsLightbox({
  images,
  title = "",
  className,
}: Props) {
  // Build tag map: { tagId -> AssetLike[] }
  const { tags, map } = useMemo(() => {
    const m = new Map<string, AssetLike[]>();
    for (const a of images) {
      const id = tagId(a);
      if (!id) continue;
      if (!m.has(id)) m.set(id, []);
      m.get(id)!.push(a);
    }
    const arr = Array.from(m.keys()).sort();
    return { tags: arr, map: m };
  }, [images]);

  // Lightbox state
  const [open, setOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  const openTag = useCallback((id: string) => {
    setActiveTag(id);
    setIdx(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const list = useMemo<AssetLike[]>(() => {
    if (!activeTag) return [];
    return map.get(activeTag) ?? [];
  }, [activeTag, map]);

  const count = list.length;

  const prev = useCallback(
    () => setIdx((i) => (i - 1 + count) % count),
    [count]
  );
  const next = useCallback(() => setIdx((i) => (i + 1) % count), [count]);

  // Body scroll lock when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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

  // Simple swipe
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

  // Current large image data
  const cur = list[idx];
  const largeUrl = cur
    ? ctfImageUrl(cur, { w: 2000, q: 75, fm: "webp" })
    : null;
  const largeBlur = cur ? ctfBlurDataURL(cur) : undefined;
  const largeAlt = cur?.fields?.title || title || "Image";
  const caption = cur?.fields?.description || null;

  return (
    <>
      {/* Chip row (inline) */}
      <div
        className={["flex flex-wrap gap-2", className ?? ""]
          .filter(Boolean)
          .join(" ")}
      >
        {tags.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => openTag(id)}
            className="cursor-pointer rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 supports-[backdrop-filter]:backdrop-blur-sm hover:bg-white/20"
          >
            {tagLabel(id)}
          </button>
        ))}
      </div>

      {/* Lightbox in a PORTAL so it escapes PageHeader clipping */}
      {open &&
        createPortal(
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
              {/* Title / context */}
              {activeTag && (
                <div className="mb-3 text-center text-sm text-white/80">
                  <span className="font-semibold">{tagLabel(activeTag)}</span>
                  {title ? <> • {title}</> : null}
                </div>
              )}

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
              {(caption || largeAlt) && (
                <div className="mt-3 text-center text-sm text-white/85">
                  {caption || largeAlt}
                </div>
              )}

              {/* Close */}
              <button
                type="button"
                onClick={close}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/70 text-white shadow-lg ring-1 ring-white/20 backdrop-blur hover:bg-neutral-900/80"
                aria-label="Close"
              >
                <svg
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

              {/* Prev/Next */}
              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/70 text-white shadow ring-1 ring-white/20 backdrop-blur hover:bg-neutral-900/80"
                    aria-label="Previous image"
                  >
                    <svg
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/70 text-white shadow ring-1 ring-white/20 backdrop-blur hover:bg-neutral-900/80"
                    aria-label="Next image"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-5 w-5"
                      fill="currentColor"
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
          </div>,
          document.body
        )}
    </>
  );
}
