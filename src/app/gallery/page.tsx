// app/gallery/page.tsx
import { getProjects } from "../../../lib/contentful";
import GalleryClient from "../components/GalleryClient";
import PageHeader from "../components/PageHeader";

export const revalidate = 60;

export default async function GalleryPage() {
  const projects = await getProjects(100); // pull enough to filter/sort
  return (
    <main className="container mx-auto px-4 pb-20">
      {" "}
      {/* header is ~64px high */}
      <PageHeader title="Featured Projects" subtitle="Designs tailored for the spaces you call home."/>
      <GalleryClient projects={projects} />
    </main>
  );
}
