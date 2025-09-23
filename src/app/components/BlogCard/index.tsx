// src/components/BlogCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { BlogPostEntry } from "../../../../lib/contentful-types";
import { slugifyTitle } from "../../../../lib/slug";

export default function BlogCard({ post }: { post: BlogPostEntry }) {
  const f = post.fields;
  const img = f.featureImage as any;
  const url = img?.fields?.file?.url && `https:${img.fields.file.url}?fm=webp&w=1600&q=70`;
  const date =
    f.publishDate ? new Date(f.publishDate as any).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <article className="group rounded-xl ring-1 ring-black/5 overflow-hidden">
      <div className="relative h-56 w-full">
        {url ? (
          <Image src={url} alt={img?.fields?.title || f.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-4">
        <time className="text-xs uppercase tracking-wider text-neutral-500">{date}</time>
        <h3 className="mt-1 text-lg font-semibold">
          <Link href={`/blog/${slugifyTitle(f.title)}`} className="hover:underline">
            {f.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
