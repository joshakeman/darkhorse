import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative h-screen flex items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: "url('/8Th-Street-03.jpg')" }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-black/50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 z-0 from-black/10 to-transparent" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="font-serif text-5xl md:text-7xl sm:text-4xl leading-tight md:leading-tight">
          Modern Design
        </h1>
        <h2 className="font-serif text-3xl md:text-4xl sm:text-xl font-normal -mt-1 opacity-90">
          Timeless Craft
        </h2>
        {/* <p className="text-lg md:text-xl mb-8 opacity-90 font-serif">Modern Design, Timeless Craft</p> */}
        <Link
          href="/gallery"
          className="inline-block border rounded-md px-6 py-2 mt-4 text-sm text-white border-white/70 hover:bg-white hover:text-neutral-900 transition"
        >
          View Our Work
        </Link>
      </div>
    </section>
  );
}
