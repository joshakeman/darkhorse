import ProjectGrid from "./components/ProjectGrid";
import { getProjects } from "../../lib/contentful";
import Hero from "./components/Hero";
import { HomeTriptych } from "./components/HomeTryptich";
import logo from "../../public/logo.png"; // Replace with your logo path
import Image from "next/image";

export default async function Home() {
  const projects = await getProjects(3); // returns ProjectEntry[]

  return (
    <div>
      <div className="-mt-[80px]">
        <Hero />
      </div>
      {/* Featured Projects */}

      <section className="container mx-auto px-4 py-8">
        <ProjectGrid projects={projects} />
      </section>
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <span className="inline-block w-16 h-[2px] bg-gray-300"></span>
            <Image
              src={logo}
              alt="Dark Horse Logo"
              className="mx-4 h-6 w-auto"
            />
            <span className="inline-block w-16 h-[2px] bg-gray-300"></span>
          </div>
          <h2 className="text-3xl font-semibold text-center mb-12">
            Learn More About Us
          </h2>
          <HomeTriptych />
        </div>
      </section>
    </div>
  );
  //
}
