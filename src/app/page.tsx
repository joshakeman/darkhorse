import ProjectGrid from "./components/ProjectGrid";
import { getProjects } from "../../lib/contentful";
import Hero from "./components/Hero";
import { HomeTriptych } from "./components/HomeTryptich";

export default async function Home() {
  const projects = await getProjects(3); // returns ProjectEntry[]

  return (
    <div>
      <div className="-mt-[80px]">
        <Hero />
      </div>
      {/* Featured Projects */}

      <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-serif text-center">
            Featured Projects
          </h2>
        <ProjectGrid projects={projects} />
      </section>
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">

          <h2 className="text-3xl font-serif text-center">
            Learn More About Us
          </h2>
          <HomeTriptych />
        </div>
      </section>
    </div>
  );
  //
}
