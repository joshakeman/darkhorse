// src/app/gallery/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import {
  getProjectTitles,
  getProjectBySlugFromTitle,
} from "../../../../lib/contentful";
import { slugifyTitle } from "../../../../lib/slug";

import InterleavedRichText from "../../components/InterleavedRichText";
import { isAssetLike, type AssetLike } from "../../../../lib/image";
import {
  ctfImageUrl,
  ctfBlurDataURL,
  IMG_PRESETS,
} from "../../../../lib/image";

export const revalidate = 60;

// ----- SSG params + metadata -------------------------------------------------

export async function generateStaticParams() {
  const titles = await getProjectTitles();
  return titles.map(({ title }) => ({ slug: slugifyTitle(title) }));
}

// ✅ Use `any` to avoid ambient PageProps with params: Promise<any>
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const project = await getProjectBySlugFromTitle(params.slug as string);
  if (!project) return { title: "Project not found" };
  return { title: project.fields.title };
}

// ----- Page ------------------------------------------------------------------

// ✅ Use `any` here too
export default async function ProjectPage({ params }: any) {
  const project = await getProjectBySlugFromTitle(params.slug as string);
  if (!project) notFound();

  const f = project.fields;

  // Hero (feature) image
  const hero = f.featureImage as unknown as AssetLike | undefined;
  const heroUrl = ctfImageUrl(hero, { w: IMG_PRESETS.HERO.maxW });
  const heroBlur = ctfBlurDataURL(hero);

  // Collect gallery images (Assets) and filter out the hero (avoid dup)
  const galleryAll: AssetLike[] = Array.isArray(f.galleryImages)
    ? (f.galleryImages as unknown[]).filter(isAssetLike)
    : [];
  const gallery = hero?.sys?.id
    ? galleryAll.filter((a) => a.sys.id !== hero.sys.id)
    : galleryAll;

  // Category chips
  const chips = [
    (f as any).categoryKitchens ? "Kitchen" : null,
    (f as any).categoryBathrooms ? "Bathroom" : null,
    (f as any).categoryBuiltIns ? "Built-ins" : null,
    (f as any).categoryClosets ? "Closets" : null,
  ].filter(Boolean) as string[];

  // Track which images are used by the interleaver so we can show leftovers later
  const usedIds = new Set<string>();

  return (
    <article className="container mx-auto px-4 pb-20">
      {/* Pull hero up under fixed header (adjust the negative margin to match your header height) */}
      <div className="-mt-[96px] mb-8">
        {heroUrl ? (
          <div className="relative h-[48vh] min-h-[320px] w-full overflow-hidden rounded-b-2xl">
            <Image
              src={heroUrl}
              alt={f.title}
              fill
              className="object-cover"
              placeholder={heroBlur ? "blur" : undefined}
              blurDataURL={heroBlur}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1200px"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-900 ring-1 ring-black/5 hover:bg-white"
              >
                ← Back to Gallery
              </Link>
              <h1 className="font-serif text-4xl md:text-6xl tracking-tight">
                {f.title}
              </h1>
              {chips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-900"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="pt-[96px]" />
        )}
      </div>

      {/* Body with interleaved images (skip the first gallery image since we have a hero) */}
      {f.textContent && (
        <section className="mx-auto max-w-3xl px-4 md:px-0">
          <InterleavedRichText
            doc={f.textContent as unknown}
            images={gallery}
            title={f.title}
            every={3}
            excludeFirstImage
            trackUsedIds={usedIds}
          />
        </section>
      )}

      <hr className="mx-auto my-10 max-w-5xl border-neutral-200" />

      {/* Any leftover gallery images not used by the interleaver */}
      {gallery.filter((a) => !usedIds.has(a.sys.id)).length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            Project Gallery
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery
              .filter((a) => !usedIds.has(a.sys.id))
              .map((asset) => {
                const url = ctfImageUrl(asset, { w: IMG_PRESETS.CARD.maxW });
                if (!url) return null;
                const alt = asset.fields.title || f.title;
                return (
                  <div
                    key={asset.sys.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-black/5"
                  >
                    <Image
                      src={url}
                      alt={alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      placeholder="blur"
                      blurDataURL={ctfBlurDataURL(asset)}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </article>
  );
}
