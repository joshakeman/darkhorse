import PageHeader from "../components/PageHeader";
import Prose from "../components/Prose";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <article className="container mx-auto px-4 pb-20">
      <PageHeader
        title="Contact"
        subtitle="Tell us about your project and we’ll get in touch."
        imageSrc="/triptych-contact.jpg" // swap for a better hero if you like
      />

      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-5">
        {/* Form */}
        <section className="md:col-span-3">
          {/* Netlify form:  name + hidden form-name + data-netlify + honeypot + redirect */}
          <form
            name="contact"
            method="POST"
            action="/contact/thanks"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            {/* Hidden inputs needed by Netlify */}
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Don’t fill this out if you’re human: <input name="bot-field" />
              </label>
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-neutral-500">
                We’ll reply within 1–2 business days.
              </p>
              <button
                type="submit"
                className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Send Message
              </button>
            </div>
          </form>
        </section>

        {/* Contact details / sidebar */}
        <aside className="md:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <Prose>
              <p>
                <strong>Dark Horse Woodworks</strong><br />
                Atlanta, GA
              </p>
              <p>
                <a href="mailto:hello@darkhorsewoodworks.com">hello@darkhorsewoodworks.com</a><br />
                <a href="tel:+14047989829">(404) 798-9829</a>
              </p>
              <p className="text-neutral-600">
                By appointment only.
              </p>
            </Prose>

            <a
              href="https://maps.google.com/?q=Dark+Horse+Woodworks+Atlanta"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
            >
              Open in Google Maps
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
