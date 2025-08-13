import { createClient, Entry, Asset } from 'contentful';

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

// Example helpers for a `post` content type with fields: title, slug, body, coverImage
export type ProjectFields = {
  title: string;
  // slug: string;
  // body: any;            // Rich Text
  // coverImage?: Asset;
};

export async function getProjects(limit = 10, preview = false) {
  const client = preview && contentfulPreview ? contentfulPreview : contentful;
  const res = await client.getEntries<ProjectFields>({
    content_type: 'projects',
    order: ['-sys.createdAt'],
    limit,
  });
  return res.items;
}

export async function getPostBySlug(slug: string, preview = false) {
  const client = preview && contentfulPreview ? contentfulPreview : contentful;
  const res = await client.getEntries<ProjectFields>({
    content_type: 'projects',
    'fields.slug': slug,
    limit: 1,
  });
  return res.items[0] ?? null;
}
