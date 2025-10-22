// src/app/components/PageHeader/index.tsx
import Image from "next/image";
import Link from "next/link";
import TagChipsLightbox from "../TagChipsLightbox";
import type { AssetLike } from "../../../../lib/image";

type Props = {
  title: string;
  subtitle?: string;
  /** Optional override; defaults to walnut texture in /public */
  imageSrc?: string;
  /** Show a back link (e.g., on project pages) */
  showBackButton?: boolean;
  /** Where the back link should go (defaults to /gallery when shown) */
  backHref?: string;
  /** Pass through to next/image for LCP sections */
  priority?: boolean;

  /**
   * When provided, renders the tag-based chips row that opens a lightbox
   * filtered to each tag (same pattern as gallery pages).
   */
  tagLightbox?: {
    images: AssetLike[];
    /** Falls back to `title` if omitted */
    projectTitle?: string;
  };
};

export default function PageHeader({
  title,
  subtitle,
  imageSrc,
  showBackButton = false,
  backHref = "/gallery",
  priority = true,
  tagLightbox,
}: Props) {
  const src = imageSrc ?? "/black-walnut-american-wood.webp";

  return (
    <header className="-mt-[96px] mb-10">
      <div
        className="relative w-full overflow-hidden rounded-b-3xl
                   h-[26vh] min-h-[220px] sm:h-[32vh] sm:min-h-[260px] md:h-[36vh]"
      >
        {/* Background image */}
        <Image
          src={src}
          alt="Header background"
          fill
          className="object-cover z-0"
          sizes="100vw"
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
        />

        {/* Readability overlays (above image, below text) */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-black/35 to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(100% 60% at 50% 60%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.18) 100%)",
          }}
        />

        {/* Text + translucent card */}
        <div className="absolute bottom-6 left-6 md:left-10 max-w-2xl w-[90%] sm:w-[70%] z-30">
          <div className="rounded-xl bg-neutral-900/70 backdrop-blur-md ring-1 ring-white/15 p-5 sm:p-6 text-white shadow-lg relative z-30">
            {showBackButton && (
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white mb-3"
              >
                ← Back to Gallery
              </Link>
            )}

            <h1 className="font-serif text-4xl md:text-6xl tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-2 text-white/90 text-base md:text-lg">
                {subtitle}
              </p>
            )}

            {/* Tag-based chips that open the filtered lightbox */}
            {tagLightbox?.images?.length ? (
              <div className="mt-4">
                <TagChipsLightbox
                  images={tagLightbox.images}
                  title={tagLightbox.projectTitle ?? title}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
