// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import {
  getBlogBySlugFromTitle,
  getBlogTitles,
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

// --- SSG params + metadata ---------------------------------------------------

export async function generateStaticParams() {
  const titles = await getBlogTitles();
  return titles.map(({ title }) => ({ slug: slugifyTitle(title) }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogBySlugFromTitle(params.slug);
  return { title: post ? post.fields.title : "Post not found" };
}

// --- Page --------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogBySlugFromTitle(params.slug);
  if (!post) notFound();

  const f = post.fields;

  // Feature image (displayed at the top of the body)
  const hero = (f.featureImage ?? null) as unknown as AssetLike | null;
  const heroUrl = ctfImageUrl(hero, { w: IMG_PRESETS.CONTENT.maxW }); // body-width image
  const heroBlur = ctfBlurDataURL(hero);
  const heroAlt = hero?.fields?.title || f.title;

  // Gather gallery images and remove the feature image (avoid dupes)
  const galleryAll: AssetLike[] = Array.isArray(f.galleryImages)
    ? (f.galleryImages as unknown[]).filter(isAssetLike) // guard narrows to AssetLike[]
    : [];
  const gallery = hero?.sys?.id
    ? galleryAll.filter((a) => a?.sys?.id !== hero.sys.id)
    : galleryAll;

  // Track which images the interleaver consumes so we can show leftovers later
  const usedIds = new Set<string>();

  const date = f.publishDate
    ? new Date(f.publishDate as unknown as string).toLocaleDateString(
        undefined,
        { year: "numeric", month: "long", day: "numeric" }
      )
    : "";

  return (
    <article className="container mx-auto px-4 pb-20">
      {/* Keep your wood-grain PageHeader above; this section is the page content */}

      {/* Title block */}
      <section className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/blog" className="text-sm opacity-80 hover:opacity-100">
            ← Back to Blog
          </Link>
          <h1 className="mt-2 font-serif text-4xl md:text-6xl tracking-tight">
            {f.title}
          </h1>
          {date && <div className="mt-2 text-neutral-600">{date}</div>}
        </div>

        {/* Feature image at the top of the body */}
        {heroUrl && (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-black/5">
            <Image
              src={heroUrl}
              alt={heroAlt}
              fill
              className="object-cover"
              placeholder={heroBlur ? "blur" : undefined}
              blurDataURL={heroBlur}
              sizes="(max-width: 640px) 100vw, 768px"
              priority={false}
            />
          </div>
        )}

        {/* Rich text with interleaved images (every 3 paragraphs) */}
        {f.textContent && (
          <InterleavedRichText
            doc={f.textContent as unknown}
            images={gallery}
            title={f.title}
            every={3}
            // For blog posts we keep the feature image above,
            // so we DON'T exclude the first gallery image here.
            excludeFirstImage={false}
            trackUsedIds={usedIds}
          />
        )}
      </section>

      {/* Any leftover gallery images not used by the interleaver */}
      {gallery.filter((a) => !usedIds.has(a.sys.id)).length > 0 && (
        <section className="mx-auto mt-10 max-w-6xl">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            More Photos
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={ctfBlurDataURL(asset)}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </article>
  );
}
