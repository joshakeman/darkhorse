// src/components/ReviewCard.tsx
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { ReviewEntry } from "../../../../lib/contentful-types";


export default function ReviewCard({ r }: { r: ReviewEntry }) {
  const f = r.fields;
  const img = f.projectImage as any;
  const url = img?.fields?.file?.url && `https:${img.fields.file.url}?fm=webp&w=1200&q=70`;

  return (
    <article className="group rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white p-5 ring-1 ring-black/5">
      {url && (
        <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image
            src={url}
            alt={img?.fields?.title || f.projectName ? "Project image" : "Image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Quote (plain text with simple paragraph splits) */}
      <div className="relative">
        <span className="absolute -left-2 -top-2 text-4xl leading-none text-neutral-300">“</span>
        <div className="prose prose-neutral max-w-none text-[0.95rem] leading-relaxed font-serif">
          {typeof f.textContent === "string"
            ? f.textContent
                .split(/\n{2,}/) // blank-line paragraphs
                .map((para, i) => <p key={i}>{para}</p>)
            : null}
        </div>
      </div>

      {/* Meta: client + optional rich-text projectName (e.g., link) */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="font-serif font-bold">{f.clientName}</div>
        {f.projectName &&
          <span className="text-xs text-neutral-700">
            {documentToReactComponents(f.projectName as any)}
          </span>
        }
      </div>
    </article>
  );
}
