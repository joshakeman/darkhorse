import PageHeader from "../components/PageHeader";
import Prose from "../components/Prose";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Our Story" };

export default function OurStoryPage() {
  return (
    <article className="container mx-auto px-4 pb-20">
      <PageHeader
        title="Our Story"
        subtitle="Who knew this would turn into a lifelong passion?"
      />

      <section className="mx-auto max-w-3xl">
                  <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-black/5">
                    <Image
                      src={"/old-childhood-photo.jpeg"}
                      alt={"Childhood photo from Grandfather's workshop"}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                    />
                  </div>
        <Prose>
          <h2><b>Family legacy</b></h2>
          <p>
            When working in my studio, I often think about how much I enjoy what I do
            and how lucky I am to make a living doing work that I love.
          </p>
          <br></br>
          <p>
            Woodworking has been a lifelong passion of mine, stretching all the way
            back to childhood, when I would spend hours with my grandfather in his
            workshop. For a 5-year-old, filing a piece of scrap wood into a pile of
            sawdust was pretty exciting.
          </p>
          <br></br>
          <p>
            I think of woodworking as being in my DNA. My great-grandfather was a
            German woodworker who immigrated to the United States late in the 19th
            century, and I’m amazed at the artistry he created using the tools of his
            day. His work is truly inspiring and led me to carry on his tradition of
            craftsmanship. I hope he would be pleased with the pieces his
            great-grandson creates by combining Old World techniques with New World
            ideas.
          </p>
          <br></br>

          <h2><b>The Dark Horse tradition</b></h2>
          <p>
            Turning a passion into a profession is extremely satisfying. I built
            commissioned pieces for nearly 25 years, moonlighting while working day
            jobs in the technology and construction management industries. Then I
            decided it was time for a change and turned my woodworking side line into
            a full-time endeavor.
          </p>
          <br></br>
          <p>
            Dark Horse Woodworks opened in 2007 in Atlanta’s Metropolitan Business and
            Arts District, a historic warehouse complex that has been transformed into
            a thriving center for art studios, galleries and workshops.
          </p>
          <br></br>

          <h2><b>Industry leadership</b></h2>
          <p>
            In 2012, Dark Horse joined the Cabinet Makers Association (CMA), an
            industry group for shops throughout the US and Canada. We have been
            recognized by the CMA with many Wood Diamond Awards for our work, and I
            have taken on a leadership role with the organization.
          </p>
          <br></br>
          <p>
            I’ve served as a member of the Board of Directors, as vice-president and
            am currently leading the board as president. I have shared my expertise at
            national industry meetings and hosted a shop tour for CMA members from
            across the country.
          </p>
          <br></br>
          <p>
            Our involvement with the CMA has improved how I run my business, as well
            as improving our products. We’ve been exposed to both new materials and
            new ideas that have enhanced our manufacturing process. Along the way, I’ve
            gained a few mentors who are always at the other end of the phone when I
            need help with unusual problems.
          </p>
          <br></br>
          <p>
            All of this means that the work we do for you follows the latest, greatest
            industry guidance and expertise.
          </p>
          <br></br>

          <h2><b>Versatility</b></h2>
          <p>
            The Dark Horse Studios team specializes in contemporary large-scale
            cabinetry and other projects for kitchens, living areas, bathrooms,
            libraries and beyond.
          </p>
          <br></br>
          <p>
            A custom design is a collaboration between you and the Dark Horse
            design-craft team. We’re always excited to talk with you about your
            project and look at the ways we could work together to bring your ideas to
            life.
          </p>
          <br></br>
          <p>
            <Link href="/contact">Click here to contact us about your project.</Link>
          </p>
          <br></br>
          <p>
            The Dark Horse team values working with clients who appreciate the
            distinction of custom, finely crafted cabinetry and furniture, and we find
            the design process as satisfying as the building process.
          </p>
          <br></br>
          <p>
            We enjoy meeting and getting to know our clients, finding out what they
            believe is important, and incorporating their sense of style into a unique
            project.
          </p>
          <br></br>
          <p>
            Our collaborations with innovative design and architecture firms have led
            to awards as well as coverage in national publications such as <em>Dwell</em>
            &nbsp;magazine and <em>The New York Times</em>.
          </p>

          <p>Thanks for taking time to learn more about Dark Horse Woodworks.</p>
          <br></br>
          <p>~ Chris Dehmer</p>
        </Prose>
      </section>
    </article>
  );
}
