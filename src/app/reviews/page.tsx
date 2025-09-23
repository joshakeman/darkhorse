// src/app/reviews/page.tsx
import ReviewCard from "../components/ReviewCard";
import { getReviews } from "../../../lib/contentful";
import PageHeader from "../components/PageHeader";

export const revalidate = 60; // ISR

export default async function ReviewsPage() {
  const reviews = await getReviews(36);

  return (
    <article className="container mx-auto px-4 pb-20">
      {/* Header band like your other pages */}
      {/* <header className="-mt-[96px] mb-10">
        <div className="relative h-[32vh] min-h-[240px] w-full overflow-hidden rounded-b-3xl bg-neutral-100">
          <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Reviews</h1>
            <p className="mt-2 text-neutral-600">
              What our clients say about working with Dark Horse.
            </p>
          </div>
        </div>
      </header> */}
      <PageHeader title="Reviews" subtitle="What our clients say about working with Dark Horse"/>

      {/* Grid */}
      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.sys.id} r={r} />
          ))}
        </div>
      </section>
    </article>
  );
}
