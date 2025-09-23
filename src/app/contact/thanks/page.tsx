import Link from "next/link";

export const metadata = { title: "Thanks" };

export default function ContactThanksPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">Thanks — we got your message.</h1>
      <p className="mt-2 text-neutral-600">
        We’ll be in touch shortly.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
