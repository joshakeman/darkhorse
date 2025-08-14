// app/gallery/page.tsx
import ProjectGrid from "../components/ProjectGrid";
import { getProjects } from "../../../lib/contentful";
import GalleryClient from "../components/GalleryClient";

export const revalidate = 60;

export default async function GalleryPage() {
  const projects = await getProjects(100); // pull enough to filter/sort
  return (
    <main className="pt-24">
      {" "}
      {/* header is ~64px high */}
      <GalleryClient projects={projects} />
    </main>
  );
}
