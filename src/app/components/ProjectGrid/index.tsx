import type { ProjectEntry } from "../../../../lib/contentful-types";
import ProjectCard from "../../components/ProjectCard";

export default function ProjectGrid({
  projects,
}: {
  projects: ProjectEntry[];
}) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Featured Projects
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.sys.id} p={p} />
        ))}
      </div>
    </section>
  );
}
