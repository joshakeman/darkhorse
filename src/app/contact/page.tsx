// src/app/contact/page.tsx
import PageHeader from "../components/PageHeader";
import ContactForm from "../components/ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <article className="container mx-auto px-4 pb-20">
      <PageHeader title="Contact" subtitle="We’d love to hear about your project." />
      <section className="mx-auto max-w-3xl">
        <ContactForm />
      </section>
    </article>
  );
}
