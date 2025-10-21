import Link from "next/link";
import Image from "next/image";

type Card = {
  title: string;
  href: string;
  image: string; // /public path or remote URL (whitelisted in next.config)
  blurb?: string;
  eyebrow?: string;
};

export function HomeTriptych({
  items = [
    {
      title: "Our Story",
      href: "/our-story",
      image: "/old-childhood-photo.jpeg",
      blurb: "Decades of precision craft in modern frameless cabinetry.",
    },
    {
      title: "Process",
      href: "/working-with-darkhorse",
      image: "/workshop-photo.jpg",
      blurb: "From materials to millwork—our method, step by step.",
    },
    {
      title: "Contact",
      href: "/contact",
      image: "/contact-photo.jpeg",
      blurb: "Start your project with a consultation.",
    },
  ],
}: {
  items?: Card[];
}) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative isolate overflow-hidden rounded-xl ring-1 ring-black/5 transition-transform duration-300 will-change-transform hover:-translate-y-0.5"
            aria-label={card.title}
          >
            {/* Image */}
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                priority={false}
              />
              {/* Overlay + subtle vignette */}
              <div className="absolute inset-0" />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]" />
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
              {card.eyebrow && (
                <div className="mb-1 font-serif text-[11px] uppercase tracking-[0.14em] text-white/70">
                  {card.eyebrow}
                </div>
              )}
              <h3 className="text-lg font-serif font-semibold tracking-wide uppercase">
                {card.title}
              </h3>
              {card.blurb && (
                <p className="mt-1 font-serif text-sm text-white/90 line-clamp-2">
                  {card.blurb}
                </p>
              )}
              <span className="font-serif mt-3 inline-flex items-center gap-2 rounded-full border border-white/80 px-3 py-1 text-xs uppercase tracking-wider transition group-hover:bg-white group-hover:text-black">
                Learn more
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7.5 5.5 12 10l-4.5 4.5" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
