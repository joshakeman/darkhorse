// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import { getBlogBySlugFromTitle, getBlogTitles } from "../../../../lib/contentful";
import { slugifyTitle } from "../../../../lib/slug";

export const revalidate = 60;

export async function generateStaticParams() {
  const titles = await getBlogTitles();
  return titles.map(({ title }) => ({ slug: slugifyTitle(title) }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogBySlugFromTitle(params.slug);
  return { title: post ? post.fields.title : "Post not found" };
}

const richTextOptions = {
  // turn soft line breaks into <br/>
  renderText: (text: string) =>
    text.split("\n").flatMap((segment, i) =>
      i === 0 ? [segment] : [<br key={i} />, segment]
    ),

  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
      <p className="my-4">{children}</p> // ensure spacing regardless of prose
    ),
    [BLOCKS.HEADING_2]: (_n: any, children: any) => (
      <h2 className="mt-8 mb-3 text-2xl font-semibold">{children}</h2>
    ),
    [BLOCKS.QUOTE]: (_n: any, children: any) => (
      <blockquote className="my-6 border-l-4 border-neutral-300 pl-4 italic">
        {children}
      </blockquote>
    ),
    [INLINES.HYPERLINK]: (node: any, children: any) => {
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogBySlugFromTitle(params.slug);
  if (!post) notFound();
  const f = post.fields;

  const hero = f.featureImage as any;
  const heroUrl = hero?.fields?.file?.url && `https:${hero.fields.file.url}?fm=webp&w=2000&q=75`;
  const date =
    f.publishDate ? new Date(f.publishDate as any).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

  const gallery = (f.galleryImages ?? []).filter((a: any) => a && typeof a === "object" && "fields" in a);

  return (
    <article className="container mx-auto px-4 pb-20">
      {/* hero */}
      <div className="-mt-[96px] mb-10">
        <div className="relative h-[44vh] min-h-[300px] w-full overflow-hidden rounded-b-3xl">
          {heroUrl ? (
            <Image src={"/black-walnut-american-wood.webp"} alt={f.title} fill className="object-cover" priority />
          ) : (
            <div className="h-full w-full bg-neutral-200" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 text-white max-w-3xl">
            <Link href="/blog" className="text-sm/none opacity-90 hover:opacity-100">← Back to Blog</Link>
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight">{f.title}</h1>
            {date && <div className="mt-2 text-white/80">{date}</div>}
          </div>
        </div>
      </div>

      {/* body */}
      {f.textContent && (
        <section className="mx-auto max-w-3xl">
                    {/* feature image inside body */}
        {heroUrl && (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-black/5">
            <Image
              src={heroUrl}
              alt={hero?.fields?.title || f.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}
          <div className="prose prose-neutral md:prose-lg leading-relaxed">
    {documentToReactComponents(f.textContent as any, richTextOptions)}
          </div>
        </section>
      )}

      {/* optional gallery */}
      {gallery.length > 0 && (
        <section className="mx-auto mt-10 max-w-6xl">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Gallery</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((asset: any) => {
              const url = asset.fields.file?.url && `https:${asset.fields.file.url}?fm=webp&w=1600&q=70`;
              const alt = asset.fields.title || f.title;
              return url ? (
                <div key={asset.sys.id} className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-black/5">
                  <Image src={url} alt={alt} fill className="object-cover" />
                </div>
              ) : null;
            })}
          </div>
        </section>
      )}
    </article>
  );
}
