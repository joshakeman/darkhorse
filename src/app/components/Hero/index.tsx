// components/Hero.tsx
import heroImage from "../../../../public/neids-1.webp"; // Replace with your image path
export default function Hero() {
  return (
    <section
      className="relative h-screen flex items-center justify-center bg-center bg-cover pt-20"
      style={{
        backgroundImage: `url(${heroImage.src})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-black/50 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-x-0 top-0 h-24 z-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Modern Frameless Cabinetry
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Precision-crafted designs for the most elegant spaces
        </p>
        <a
          href="/work"
          className="inline-block px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white hover:text-black transition"
        >
          View Our Work
        </a>
      </div>
    </section>
  );
}
