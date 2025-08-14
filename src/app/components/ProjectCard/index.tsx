import Image from "next/image";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { ProjectEntry } from "../../../../lib/contentful-types";

export default function ProjectCard({ p }: { p: ProjectEntry }) {
  const cover = p.fields.featureImage;
  const coverUrl =
    cover?.fields.file?.url ? `https:${cover.fields.file.url}` : undefined;

  // Prefer a short excerpt: if your rich text is long, you might strip to first paragraph.
  return (
    <article className="group overflow-hidden rounded-2xl ring-1 ring-black/5">
      <div className="relative h-60 w-full">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={cover?.fields.title || p.fields.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-500">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {/* <Link
            href={p.fields.slug ? `/gallery/${p.fields.slug}` : "#"}
            className="hover:underline"
          > */}
            {p.fields.title}
          {/* </Link> */}
        </h3>

        {/* Optional teaser from rich text */}
        {p.fields.textContent && (
          <div className="prose prose-sm mt-2 line-clamp-3 text-neutral-700">
            {documentToReactComponents(p.fields.textContent)}
          </div>
        )}

        <div className="mt-3 flex gap-2">
          {p.fields.categoryKitchens && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs">
              Kitchen
            </span>
          )}
          {p.fields.categoryBathrooms && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs">
              Bathroom
            </span>
          )}
          {p.fields.categoryBuiltIns && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs">
              Built-ins
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
