import type { ProjectEntry } from "../../../../lib/contentful-types";
import type { Entry } from "contentful";
import ProjectCard from "../ProjectCard";

type ProjectLike = ProjectEntry | Entry<any>; // allows slight variation in shape

export default function ProjectGrid({ projects }: { projects: ProjectLike[] }) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.sys.id} p={p as ProjectEntry} />
        ))}
      </div>
    </section>
  );
}
