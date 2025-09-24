// app/gallery/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { getProjectTitles, getProjectBySlugFromTitle } from "../../../../lib/contentful";
import { slugifyTitle } from "../../../../lib/slug";

export const revalidate = 60;

export async function generateStaticParams() {
  const titles = await getProjectTitles();
  return titles.map(({ title }) => ({ slug: slugifyTitle(title) }));
}

// 👇 params is a Promise<{ slug: string }>
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugFromTitle(slug);
  if (!project) return { title: "Project not found" };
  return { title: project.fields.title };
}

const richTextOptions = {
  renderText: (text: string) =>
    text.split("\n").flatMap((segment, i) =>
      i === 0 ? [segment] : [<br key={i} />, segment]
    ),
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: unknown, children: React.ReactNode) => (
      <p className="my-4">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (_n: unknown, children: React.ReactNode) => (
      <h2 className="mt-8 mb-3 text-2xl font-semibold">{children}</h2>
    ),
    [BLOCKS.QUOTE]: (_n: unknown, children: React.ReactNode) => (
      <blockquote className="my-6 border-l-4 border-neutral-300 pl-4 italic">
        {children}
      </blockquote>
    ),
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
      const href = node.data.uri as string;
      const ext = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          target={ext ? "_blank" : undefined}
          rel={ext ? "noopener noreferrer" : undefined}
          className="underline"
        >
          {children}
        </a>
      );
    },
  },
};

// 👇 params is a Promise here too
export default async function ProjectPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const project = await getProjectBySlugFromTitle(slug);
  if (!project) notFound();

  const f = project.fields;

  const hero = f.featureImage;
  const heroUrl =
    hero?.fields?.file?.url &&
    `https:${hero.fields.file.url}?fm=webp&w=2000&q=75`;

  const gallery = (f.galleryImages ?? []).filter(
    (a: any): a is typeof a & { fields: any } =>
      a && typeof a === "object" && "fields" in a
  );

  const chips = [
    (f as any).categoryKitchens ? "Kitchen" : null,
    (f as any).categoryBathrooms ? "Bathroom" : null,
    (f as any).categoryBuiltIns ? "Built-ins" : null,
    (f as any).categoryClosets ? "Closets" : null, // if you added closets
  ].filter(Boolean) as string[];

  return (
    <article className="container mx-auto px-4 pb-20">
      <div className="-mt-[96px] mb-8">
        {heroUrl ? (
          <div className="relative h-[48vh] min-h-[320px] w-full overflow-hidden rounded-b-2xl">
            <Image
              src={heroUrl}
              alt={f.title}
              fill
              className="object-cover"
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

      {f.textContent && (
        <section className="mx-auto max-w-3xl px-4 md:px-0">
          <div className="prose prose-neutral md:prose-lg leading-relaxed">
            {documentToReactComponents(f.textContent as any, richTextOptions)}
          </div>
        </section>
      )}

      <hr className="mx-auto my-10 max-w-5xl border-neutral-200" />

      {gallery.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            Project Gallery
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((asset) => {
              const url =
                asset.fields.file?.url &&
                `https:${asset.fields.file.url}?fm=webp&w=1600&q=70`;
              const alt = asset.fields.title || f.title;
              return url ? (
                <div
                  key={asset.sys.id}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-black/5"
                >
                  <Image
                    src={url}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                <div
                  key={asset.sys.id}
                  className="flex aspect-[4/3] items-center justify-center rounded-xl bg-neutral-100 text-neutral-500"
                >
                  No image
                </div>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
