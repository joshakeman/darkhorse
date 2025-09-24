import PageHeader from "../components/PageHeader";
import Prose from "../components/Prose";
import { Pencil, FileText, ClipboardCheck, Hammer } from "lucide-react";

export const metadata = { title: "Working With Darkhorse" };

export default function WorkingWithDarkhorsePage() {
  return (
    <article className="container mx-auto px-4 pb-24">
      <PageHeader
        title="Working With Darkhorse"
        subtitle="Our design and build process"
        imageSrc="/triptych-process.jpg" // swap for a better hero if you like
      />

      {/* Intro */}
      <section className="mx-auto max-w-3xl">
        <Prose>
          <p>
            Designing custom cabinetry, shelving, and other home furnishings lets you
            choose every detail—style, materials, color, finish, and size.
          </p>
        </Prose>
      </section>

      {/* Process steps */}

<section className="mx-auto mt-10 max-w-5xl">
  <h2 className="text-xl font-semibold tracking-tight">Our Process</h2>
  <ol className="mt-6 grid gap-6 sm:grid-cols-2">
    <li className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6">
      <Pencil className="h-8 w-8 text-neutral-600" />
      <h3 className="mt-3 font-medium">Design Conversation</h3>
      <p className="mt-2 text-sm text-neutral-700">
        We review photos, styles, and how you’ll use the space. If you have sketches,
        we’ll look at those too.
      </p>
    </li>

    <li className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6">
      <FileText className="h-8 w-8 text-neutral-600" />
      <h3 className="mt-3 font-medium">Collaborative Planning</h3>
      <p className="mt-2 text-sm text-neutral-700">
        Together—as needed with your architect or designer—we shape a one-of-a-kind plan.
      </p>
    </li>

    <li className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6">
      <ClipboardCheck className="h-8 w-8 text-neutral-600" />
      <h3 className="mt-3 font-medium">Proposal</h3>
      <p className="mt-2 text-sm text-neutral-700">
        You’ll receive a detailed proposal with pricing and an estimated delivery date.
      </p>
    </li>

    <li className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6">
      <Hammer className="h-8 w-8 text-neutral-600" />
      <h3 className="mt-3 font-medium">Scheduling & Installation</h3>
      <p className="mt-2 text-sm text-neutral-700">
        We’ll be transparent about lead times (often a few weeks to a few months).
        Unless noted, quotes include setup and installation.
      </p>
    </li>
  </ol>
</section>

      {/* Details band */}
      <section className="mx-auto mt-12 max-w-5xl rounded-3xl bg-neutral-50 p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Payment */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Payment</h2>
            <p className="mt-2 text-sm text-neutral-700">
              We accept cash, checks, Visa, MasterCard, American Express, and Discover.
            </p>
          </div>

          {/* Warranty */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Warranty</h2>
            <p className="mt-2 text-sm text-neutral-700">
              We stand behind our work for normal indoor use. If our cabinetry or furniture
              fails at any time during the original owner’s lifetime due to our workmanship
              or materials, we’ll repair or replace it at no cost.
            </p>
          </div>
        </div>
      </section>

      {/* Fine print / full prose (optional extra context) */}
      <section className="mx-auto mt-10 max-w-3xl">
        <Prose>
          <p>
            If you’re exploring a project and want to talk through ideas, timelines, or
            materials, we’re happy to help.
          </p>
        </Prose>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-12 max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-neutral-900 p-6 text-white md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold">Ready to start your project?</h3>
            <p className="mt-1 text-white/80">
              Tell us about your space and we’ll follow up with next steps.
            </p>
          </div>
          <a
            href="/contact"
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-neutral-900 hover:opacity-90"
          >
            Contact Us
          </a>
        </div>
      </section>
    </article>
  );
}