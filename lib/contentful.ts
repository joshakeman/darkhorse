// lib/contentful.ts
import "server-only"; // <-- prevents client bundling
import { createClient } from "contentful";
import type {
  ProjectSkeleton,
  ProjectEntry,
  ReviewSkeleton,
  ReviewEntry,
  BlogPostEntry,
  BlogPostSkeleton,
} from "./contentful-types";
import { slugifyTitle } from "./slug"; // <-- use our own slug function

// function req(name: string) {
//   const v = process.env[name]?.trim();
//   if (!v) throw new Error(`[contentful] Missing required env: ${name}`);
//   return v;
// }

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!;
const environment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT ?? "master";
const accessToken = process.env.CONTENTFUL_CDA_TOKEN!;

export const contentful = createClient({ space, environment, accessToken });

export async function getProjects(limit = 12): Promise<ProjectEntry[]> {
  const res = await contentful.getEntries<ProjectSkeleton>({
    content_type: "projects", // your content type API ID
    include: 2,
    order: ["-sys.createdAt"],
    limit,
  });
  return res.items as ProjectEntry[];
}

// Return all titles (and ids) to generate static params
export async function getProjectTitles(): Promise<
  Array<{ id: string; title: string }>
> {
  const res = await contentful.getEntries<ProjectSkeleton>({
    content_type: "projects",
    select: ["sys.id", "fields.title"], // keep it lean
    limit: 1000,
  });
  return res.items
    .map((e) => {
      const t = (e.fields as any)?.title as string | undefined;
      return t ? { id: e.sys.id, title: t } : null;
    })
    .filter(Boolean) as Array<{ id: string; title: string }>;
}

// Resolve by slug-from-title (two-step for precision)
export async function getProjectBySlugFromTitle(
  slug: string
): Promise<ProjectEntry | null> {
  // 1) fetch only ids + titles and find the matching one
  const titles = await getProjectTitles();
  const match = titles.find((t) => slugifyTitle(t.title) === slug);
  if (!match) return null;

  // 2) fetch the full entry by id with includes
  const entry = await contentful.getEntry<ProjectSkeleton>(match.id, {
    include: 2,
  });
  return entry as unknown as ProjectEntry;
}

export async function getReviews(limit = 24): Promise<ReviewEntry[]> {
  const res = await contentful.getEntries<ReviewSkeleton>({
    content_type: "review", // match your Content Type API ID
    include: 2, // resolve the projectImage asset
    order: ["-sys.createdAt"], // newest first
    limit,
  });
  return res.items as ReviewEntry[];
}

export async function getBlogPosts(limit = 20): Promise<BlogPostEntry[]> {
  const res = await contentful.getEntries<BlogPostSkeleton>({
    content_type: "blogPosts",
    include: 2,
    order: ["-fields.publishDate", "-sys.createdAt"],
    limit,
  });
  return res.items as BlogPostEntry[];
}

export async function getBlogTitles(): Promise<
  Array<{ id: string; title: string }>
> {
  const res = await contentful.getEntries<BlogPostSkeleton>({
    content_type: "blogPosts",
    select: ["sys.id", "fields.title"],
    limit: 1000,
  });
  return res.items
    .map((e) => {
      const t = (e.fields as any)?.title as string | undefined;
      return t ? { id: e.sys.id, title: t } : null;
    })
    .filter(Boolean) as Array<{ id: string; title: string }>;
}

export async function getBlogBySlugFromTitle(
  slug: string
): Promise<BlogPostEntry | null> {
  const titles = await getBlogTitles();
  const match = titles.find((t) => slugifyTitle(t.title) === slug);
  if (!match) return null;
  const entry = await contentful.getEntry<BlogPostSkeleton>(match.id, {
    include: 2,
  });
  return entry as unknown as BlogPostEntry;
}
