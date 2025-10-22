// lib/image.ts

// ---- Canonical Contentful asset shape you rely on in the app ----
// lib/image.ts
export type AssetLike = {
  fields: {
    title: string;
    description?: string; // ✅ add this
    file: {
      url: string;
      details: {
        image: { width: number; height: number };
      };
    };
  };
  metadata?: {
    tags?: Array<{ sys?: { id?: string; linkType?: string; type?: string } }>;
    concepts?: Array<{
      sys?: { id?: string; linkType?: string; type?: string };
    }>;
  };
  sys: { id: string };
};

// Narrow unknown → AssetLike at runtime
export function isAssetLike(x: unknown): x is AssetLike {
  return (
    !!x &&
    typeof x === "object" &&
    "sys" in x &&
    "fields" in x &&
    typeof (x as any).sys?.id === "string"
  );
}

// ---------- Image helpers ----------

export const IMG_PRESETS = {
  HERO: { maxW: 2000, q: 75 },
  CONTENT: { maxW: 1200, q: 75 },
  CARD: { maxW: 1600, q: 70 },
} as const;

type UrlOpts = {
  w?: number;
  q?: number;
  fm?: "webp" | "jpg" | "jpeg" | "avif";
};

// Accepts unknown; returns null if not an asset or no URL.
// Use this everywhere you previously hand-built ?w=...&fm=...
export function ctfImageUrl(x: unknown, opts: UrlOpts = {}): string | null {
  if (!isAssetLike(x)) return null;
  const base = x.fields?.file?.url;
  if (!base) return null;
  const w = opts.w ?? IMG_PRESETS.CONTENT.maxW;
  const q = opts.q ?? IMG_PRESETS.CONTENT.q;
  const fm = opts.fm ?? "webp";
  return `https:${base}?fm=${fm}&w=${w}&q=${q}`;
}

// Tiny blur placeholder using Contentful transform
export function ctfBlurDataURL(x: unknown): string | undefined {
  if (!isAssetLike(x)) return undefined;
  const base = x.fields?.file?.url;
  if (!base) return undefined;
  return `https:${base}?fm=webp&w=24&q=20`;
}

export function getAssetTagIds(a?: AssetLike | null): string[] {
  return (
    a?.metadata?.tags
      ?.map((t) => t?.sys?.id)
      .filter((id): id is string => Boolean(id)) ?? []
  );
}

// Quick check
export function assetHasTag(
  a: AssetLike | null | undefined,
  tagId: string
): boolean {
  return getAssetTagIds(a).includes(tagId);
}

// Turn tag id like "mudroom-storage" → "Mudroom Storage"
export function humanizeTagId(id: string): string {
  return id.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
