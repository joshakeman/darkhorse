// src/app/components/InterleavedRichText.tsx
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import React from "react";

export type AssetLike = {
  sys: { id: string };
  fields: { title?: string; file?: { url?: string } };
};

export function isAssetLike(x: unknown): x is AssetLike {
  return (
    typeof x === "object" &&
    x !== null &&
    "sys" in x &&
    "fields" in x &&
    typeof (x as any).sys?.id === "string"
  );
}

export default function InterleavedRichText({
  doc,
  images,
  title = "",
  every = 3,
  /** If true, skip the first image in `images` */
  excludeFirstImage = false,
  /** Optional: provide a Set to collect IDs of images the component consumes */
  trackUsedIds,
}: {
  doc: unknown;
  images: AssetLike[];
  title?: string;
  every?: number;
  excludeFirstImage?: boolean;
  trackUsedIds?: Set<string>;
}) {
  // Optionally drop the first image (e.g., hero already shown elsewhere)
  const pool = excludeFirstImage ? images.slice(1) : images;

  let paragraphCount = 0;
  let imageIndex = 0;

  const Figure = ({ asset }: { asset: AssetLike }) => {
    const url = asset.fields.file?.url && `https:${asset.fields.file.url}?fm=webp&w=1600&q=70`;
    if (!url) return null;
    const alt = asset.fields.title || title || "Image";
    return (
      <figure className="my-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-black/5">
          <Image src={url} alt={alt} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        </div>
        {/* {asset.fields.title && (
          <figcaption className="mt-2 text-center text-sm text-neutral-600">{asset.fields.title}</figcaption>
        )} */}
      </figure>
    );
  };

  const options = {
    renderText: (text: string) =>
      text.split("\n").flatMap((seg, i) => (i === 0 ? [seg] : [<br key={i} />, seg])),

    renderNode: {
      [BLOCKS.PARAGRAPH]: (_n: unknown, children: React.ReactNode) => {
        paragraphCount += 1;
        const shouldInsert = pool.length > 0 && paragraphCount % every === 0 && imageIndex < pool.length;
        const asset = shouldInsert ? pool[imageIndex++] : undefined;
        if (asset && trackUsedIds) trackUsedIds.add(asset.sys.id);

        return (
          <>
            <p className="my-4">{children}</p>
            {asset ? <Figure asset={asset} /> : null}
          </>
        );
      },
      [BLOCKS.HEADING_2]: (_n: unknown, children: React.ReactNode) => (
        <h2 className="mt-8 mb-3 text-2xl font-semibold">{children}</h2>
      ),
      [BLOCKS.QUOTE]: (_n: unknown, children: React.ReactNode) => (
        <blockquote className="my-6 border-l-4 border-neutral-300 pl-4 italic">{children}</blockquote>
      ),
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
        const href: string = node?.data?.uri ?? "#";
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

  return <div className="prose prose-neutral md:prose-lg leading-relaxed">{documentToReactComponents(doc as any, options)}</div>;
}