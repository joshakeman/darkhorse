"use client";

import { useMemo, useState } from "react";
import type { ProjectEntry } from "../../../../lib/contentful-types";
import ProjectGrid from "../ProjectGrid";

type Cat = "all" | "kitchen" | "bathrooms" | "builtins" | "closets";

const hasKitchen = (p: ProjectEntry) =>
  Boolean((p.fields as any).categoryKitchen ?? (p.fields as any).categoryKitchens);

const hasBathrooms = (p: ProjectEntry) =>
  Boolean((p.fields as any).categoryBathroom ?? (p.fields as any).categoryBathrooms);

const hasBuiltins = (p: ProjectEntry) =>
  Boolean((p.fields as any).categoryBuiltIn ?? (p.fields as any).categoryBuiltIns);

const hasClosets = (p: ProjectEntry) =>
  Boolean((p.fields as any).categoryCloset ?? (p.fields as any).categoryClosets);

export default function GalleryClient({ projects }: { projects: ProjectEntry[] }) {
  const [cat, setCat] = useState<Cat>("all");

//   const list = useMemo(() => {
//     if (cat === "all") {
//       return [...projects].sort(
//         (a, b) => +new Date(b.sys.createdAt) - +new Date(a.sys.createdAt)
//       );
//     }

//     const score = (p: ProjectEntry) =>
//       (cat === "kitchen" && hasKitchen(p)) ||
//       (cat === "bathrooms" && hasBathrooms(p)) ||
//       (cat === "builtins" && hasBuiltins(p)) ||
//       (cat === "closets" && hasClosets(p))
//         ? 1
//         : 0;

//     return [...projects].sort((a, b) => {
//       const sb = score(b) - score(a);
//       return sb !== 0
//         ? sb
//         : +new Date(b.sys.createdAt) - +new Date(a.sys.createdAt);
//     });
//   }, [projects, cat]);

const list = useMemo(() => {
  const byNewest = (a: ProjectEntry, b: ProjectEntry) =>
    +new Date(b.sys.createdAt) - +new Date(a.sys.createdAt);

  if (cat === "all") return [...projects].sort(byNewest);

  const match = (p: ProjectEntry) =>
    (cat === "kitchen" && hasKitchen(p)) ||
    (cat === "bathrooms" && hasBathrooms(p)) ||
    (cat === "builtins" && hasBuiltins(p)) ||
    (cat === "closets" && hasClosets(p));

  return projects.filter(match).sort(byNewest);
}, [projects, cat]);

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="sticky top-[96px] z-40 mb-6 flex justify-center backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <Segmented value={cat} onChange={setCat} />
      </div>
      <div key={cat} className="animate-[fade_200ms_ease]">
        <ProjectGrid projects={list} />
      </div>
      <style jsx global>{`
        @keyframes fade {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function Segmented({
  value,
  onChange,
}: {
  value: Cat;
  onChange: (c: Cat) => void;
}) {
  const items: { key: Cat; label: string }[] = [
    { key: "all", label: "All" },
    { key: "kitchen", label: "Kitchens" },
    { key: "bathrooms", label: "Bathrooms" },
    { key: "builtins", label: "Built-ins" },
    { key: "closets", label: "Closets" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Gallery categories"
      className="relative inline-flex rounded-full border border-neutral-200 bg-white p-1 shadow-sm"
    >
      {items.map((it) => {
        const active = value === it.key;
        return (
          <button
            key={it.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.key)}
            className={[
              "relative z-10 rounded-full px-4 py-2 text-sm cursor-pointer transition",
              active ? "text-white" : "text-neutral-700 hover:text-neutral-900",
            ].join(" ")}
          >
            {active && (
              <span
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-neutral-900 shadow"
              />
            )}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
