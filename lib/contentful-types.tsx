// lib/contentful-types.ts
import { Entry, EntryFieldTypes } from 'contentful';

export const PROJECT_TYPE_ID = 'projects'; // <- your content type API ID

export type ProjectSkeleton = {
  contentTypeId: typeof PROJECT_TYPE_ID;
  fields: {
    title: EntryFieldTypes.Symbol;
    featureImage?: EntryFieldTypes.AssetLink;                  // single media field
    galleryImages?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>; // multi-asset field
    textContent?: EntryFieldTypes.RichText;                    // rich text
    categoryKitchens?: EntryFieldTypes.Boolean;
    categoryBathrooms?: EntryFieldTypes.Boolean;
    categoryBuiltIns?: EntryFieldTypes.Boolean;
  };
};

export const REVIEW_TYPE_ID = 'review'; // <- your content type API ID

export type ReviewSkeleton = {
  contentTypeId: typeof REVIEW_TYPE_ID; // Content Type API ID in Contentful (lowercase recommended)
  fields: {
    clientName: EntryFieldTypes.Symbol;
    textContent: EntryFieldTypes.Text;       // if it's plain text, change to EntryFieldTypes.Text
    projectImage?: EntryFieldTypes.AssetLink;
    projectName?: EntryFieldTypes.RichText;
  };
};

export const BLOG_TYPE_ID = 'blogPosts'

export type BlogPostSkeleton = {
  contentTypeId: typeof BLOG_TYPE_ID; // Content Type API ID
  fields: {
    title: EntryFieldTypes.Symbol;
    publishDate?: EntryFieldTypes.Date;
    featureImage?: EntryFieldTypes.AssetLink;
    textContent?: EntryFieldTypes.RichText;
    galleryImages?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  };
};

export type ProjectEntry = Entry<ProjectSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">;
export type ReviewEntry = Entry<ReviewSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">;
export type BlogPostEntry = Entry<BlogPostSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">;
