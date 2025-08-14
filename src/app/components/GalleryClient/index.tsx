// components/GalleryClient.tsx
"use client";

import { useMemo, useState } from "react";
import type { ProjectEntry } from "../../../../lib/contentful-types";
import ProjectGrid from "../../components/ProjectGrid";

type Cat = "all" | "kitchen" | "bathrooms" | "builtins";

function hasKitchen(p: ProjectEntry) {
  return Boolean(
    (p.fields as any).categoryKitchen ?? (p.fields as any).categoryKitchens
  );
}
function hasBathrooms(p: ProjectEntry) {
  return Boolean(
    (p.fields as any).categoryBathroom ?? (p.fields as any).categoryBathrooms
  );
}
function hasBuiltins(p: ProjectEntry) {
  return Boolean(
    (p.fields as any).categoryBuiltIn ?? (p.fields as any).categoryBuiltIns
  );
}

export default function GalleryClient({
  projects,
}: {
  projects: ProjectEntry[];
}) {
  const [cat, setCat] = useState<Cat>("all");

  const sorted = useMemo(() => {
    if (cat === "all") return projects;
    // score so matches float to top (not a hard filter)
    const score = (p: ProjectEntry) => {
      if (cat === "kitchen") return hasKitchen(p) ? 1 : 0;
      if (cat === "bathrooms") return hasBathrooms(p) ? 1 : 0;
      if (cat === "builtins") return hasBuiltins(p) ? 1 : 0;
      return 0;
    };
    return [...projects].sort((a, b) => score(b) - score(a));
  }, [projects, cat]);

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Sticky segmented control */}
      <div
        className="
          sticky top-16 z-40 mb-6 flex justify-center
          backdrop-blur supports-[backdrop-filter]:bg-white/70
        "
      >
        <Segmented value={cat} onChange={setCat} />
      </div>

      <ProjectGrid projects={sorted} />
    </section>
  );
}

/* Segmented control */
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
  ];

  return (
    <div
      role="tablist"
      aria-label="Gallery categories"
      className="
        relative inline-flex rounded-full border border-neutral-200 bg-white p-1 shadow-sm
      "
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
              "relative z-10 rounded-full px-4 py-2 text-sm transition cursor-pointer",
              active ? "text-white" : "text-neutral-700 hover:text-neutral-900",
            ].join(" ")}
          >
            {/* active background pill */}
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
