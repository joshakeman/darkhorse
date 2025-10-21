"use client";

import { useMemo, useState } from "react";
import LightboxModal from "../LightboxModal";
import { type AssetLike } from "../../../../lib/image";

type ChipKey = "Kitchen" | "Bathroom" | "Built-ins" | "Closets";

const MATCHERS: Record<ChipKey, RegExp> = {
  Kitchen: /\b(#kitchen|kitchen)\b/i,
  Bathroom: /\b(#bath(room)?|bath(room)?)\b/i,
  "Built-ins": /\b(#built[- ]?ins?|built[- ]?ins?)\b/i,
  Closets: /\b(#closets?|closets?)\b/i,
};

function assetText(a: AssetLike): string {
  const t = a?.fields?.title ?? "";
  const d = a?.fields?.description ?? "";
  return `${t} ${d}`.trim();
}

function filterByChip(images: AssetLike[], chip: ChipKey): AssetLike[] {
  const rx = MATCHERS[chip];
  return images.filter((a) => rx.test(assetText(a)));
}

export default function CategoryChipsLightbox({
  chips,
  images,
  title,
}: {
  chips: ChipKey[]; // which chips to show (from your project booleans)
  images: AssetLike[]; // full gallery array
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<AssetLike[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [category, setCategory] = useState<string | undefined>();

  const hasAnyTagged = useMemo(
    () => images.some((a) => /#/.test(assetText(a))),
    [images]
  );

  const handleClick = (chip: ChipKey) => {
    const list = filterByChip(images, chip);
    if (list.length === 0) {
      // fallback: if nothing is tagged, open full gallery
      setFiltered(images);
      setStartIndex(0);
      setOpen(true);
      return;
    }
    setFiltered(list);
    setStartIndex(0);
    setOpen(true);
    setCategory(chip); // new state
  };

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => handleClick(c)}
            title={
              hasAnyTagged
                ? `View ${c.toLowerCase()} photos`
                : `View photos (no ${c.toLowerCase()} tags found; showing all)`
            }
            className="cursor-pointer rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-900 ring-1 ring-black/5 hover:bg-white transition"
          >
            {c}
          </button>
        ))}
      </div>

      <LightboxModal
        open={open}
        images={filtered}
        startIndex={startIndex}
        title={title}
        categoryLabel={category}
        projectTitle={title}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
