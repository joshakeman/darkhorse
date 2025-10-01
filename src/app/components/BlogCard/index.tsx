// src/app/components/BlogCard/index.tsx
import Image from "next/image";
import Link from "next/link";
import type { BlogPostEntry } from "../../../../lib/contentful-types";
import { slugifyTitle } from "../../../../lib/slug";
import {
  ctfImageUrl,
  ctfBlurDataURL,
  IMG_PRESETS,
} from "../../../../lib/image";

// // very light reading-time estimate (200 wpm)
// function readingTimeFromRichText(rt: unknown): string | null {
//   try {
//     const json = typeof rt === "string" ? JSON.parse(rt) : (rt as any);
//     const text = JSON.stringify(json); // crude but safe without a full extractor
//     const words = Math.max(1, text.replace(/<[^>]+>/g, "").split(/\s+/).length);
//     const mins = Math.max(1, Math.round(words / 200));
//     return `${mins} min read`;
//   } catch {
//     return null;
//   }
// }

export default function BlogCard({ post }: { post: BlogPostEntry }) {
  const f = post.fields;

  // feature image (URL + blur via helper)
  const img = f.featureImage as any;
  const url = ctfImageUrl(img, { w: IMG_PRESETS.CARD.maxW });
  const blur = ctfBlurDataURL(img);
  const alt = (img?.fields?.title as string) || f.title;

  // date
  const date = f.publishDate
    ? new Date(f.publishDate as any).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // optional reading time
  // const read = readingTimeFromRichText(f.textContent);

  const href = `/blog/${slugifyTitle(f.title)}`;

  return (
    <article
      className="group relative overflow-hidden rounded-2xl ring-1 ring-black/5 bg-white transition
                 hover:shadow-md focus-within:shadow-md"
    >
      <div className="relative h-56 w-full">
        {url ? (
          <Image
            src={url}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            placeholder={blur ? "blur" : undefined}
            blurDataURL={blur}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
        {/* soft gradient for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
          {date && <time>{date}</time>}
          {/* {date && read && <span aria-hidden>•</span>}
          {read && <span>{read}</span>} */}
        </div>

        <h3 className="mt-1 line-clamp-2 text-lg font-semibold tracking-tight">
          <Link
            href={href}
            className="outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 rounded-sm"
          >
            {f.title}
          </Link>
        </h3>
      </div>

      {/* Make the whole card clickable, but keep accessible link above */}
      <Link
        href={href}
        aria-label={`Read: ${f.title}`}
        className="absolute inset-0"
        tabIndex={-1}
      />
    </article>
  );
}
