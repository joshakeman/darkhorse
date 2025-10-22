import Image from "next/image";
import Link from "next/link";
import type { ProjectEntry } from "../../../../lib/contentful-types";
import { slugifyTitle } from "../../../../lib/slug";

export default function ProjectCard({ p }: { p: ProjectEntry }) {
  const cover = p.fields.featureImage as any;
  const url = cover?.fields?.file?.url
    ? `https:${cover.fields.file.url}?fm=webp&w=1600&q=70`
    : undefined;

  return (
    <article className="group overflow-hidden rounded-xl ring-1 ring-black/5">
      <Link
        href={`/gallery/${slugifyTitle(p.fields.title)}`}
        // className="hover:underline"
      >
        <div className="relative h-60 w-full">
          {url ? (
            <Image
              src={url}
              alt={cover?.fields?.title || p.fields.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-500">
              No image
            </div>
          )}
          <div className="absolute inset-0" />
        </div>

        <div className="p-4">
          <h3 className="text-2xl font-semibold font-serif tracking-tight hover:underline">
            {p.fields.title}
          </h3>

          {/* inside your card body, replace your current pills block */}
          <div className="mt-3 flex flex-wrap gap-2">
            {isTrue((p.fields as any).categoryKitchens) && <Pill>Kitchen</Pill>}
            {isTrue((p.fields as any).categoryBathrooms) && (
              <Pill>Bathroom</Pill>
            )}
            {isTrue((p.fields as any).categoryBuiltIns) && (
              <Pill>Built-ins</Pill>
            )}
            {isTrue((p.fields as any).categoryCloset) ||
            isTrue((p.fields as any).categoryClosets) ? (
              <Pill>Closets</Pill>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}

// helpers (top of file or a utils module)
const isTrue = (v: unknown) => v === true; // avoid truthy weirdness

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white/80 px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-neutral-700 shadow-sm backdrop-blur-sm">
      {/* tiny dot accent */}
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" aria-hidden />
      {children}
    </span>
  );
}
