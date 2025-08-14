import { createClient } from 'contentful';
import type { ProjectSkeleton, ProjectEntry, PROJECT_TYPE_ID } from './contentful-types';


const space = process.env.CONTENTFUL_SPACE_ID!;
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const accessToken = process.env.CONTENTFUL_CDA_TOKEN!;
const previewToken = process.env.CONTENTFUL_CPA_TOKEN;

export const contentful = createClient({
  space,
  environment,
  accessToken,
});

export const contentfulPreview = previewToken
  ? createClient({
      space,
      environment,
      accessToken: previewToken,
      host: 'preview.contentful.com',
    })
  : null;

export async function getProjects(limit = 12): Promise<ProjectEntry[]> {
  const res = await contentful.getEntries<ProjectSkeleton>({
    content_type: "projects",
    include: 2, // resolve linked assets/entries
    order: ["-sys.createdAt"],
    limit,
  });
  return res.items as ProjectEntry[];
}

// export async function getPostBySlug(slug: string, preview = false) {
//   const client = preview && contentfulPreview ? contentfulPreview : contentful;
//   const res = await client.getEntries<ProjectFields>({
//     content_type: 'projects',
//     'fields.slug': slug,
//     limit: 1,
//   });
//   return res.items[0] ?? null;
// }
