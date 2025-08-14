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

export type ProjectEntry = Entry<ProjectSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">;
