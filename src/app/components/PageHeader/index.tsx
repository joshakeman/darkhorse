// src/app/components/PageHeader/index.tsx
import Image from "next/image";

type Props = {
  title: string;
  subtitle?: string;
  /** Optional override; defaults to walnut texture in /public */
  imageSrc?: string;
  /** Optional custom blur placeholder; falls back to a tiny SVG shimmer */
  blurDataURL?: string;
  /** Pass through to next/image for LCP sections */
  priority?: boolean;
};

// tiny SVG shimmer as a lightweight default blurDataURL
function shimmer(width = 1200, height = 600, c1 = "#222", c2 = "#111") {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <defs>
        <linearGradient id="g">
          <stop stop-color="${c1}" offset="20%" />
          <stop stop-color="${c2}" offset="50%" />
          <stop stop-color="${c1}" offset="80%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="${c1}" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="2s" repeatCount="indefinite"  />
    </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default function PageHeader({
  title,
  subtitle,
  imageSrc,
  blurDataURL,
  priority = true,
}: Props) {
  const src = imageSrc ?? "/black-walnut-american-wood.webp";
  const blur = blurDataURL ?? shimmer(1200, 600, "#1c1c1c", "#111111");

  return (
    <header className="-mt-[96px] mb-10">
      <div
        className="relative w-full overflow-hidden rounded-b-3xl
                   h-[26vh] min-h-[220px] sm:h-[32vh] sm:min-h-[260px] md:h-[36vh]"
      >
        {/* Background */}
        <Image
          src={src}
          alt="Dark walnut woodgrain"
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={blur}
          priority={priority}
          sizes="100vw"
          fetchPriority={priority ? "high" : "auto"}
        />

        {/* 1) Top gradient: boosts title contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-transparent" />

        {/* 2) Radial vignette: adds depth, eye focus */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 60% at 50% 60%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.18) 100%)",
          }}
        />

        {/* 3) Subtle top sheen: luxury feel without glare */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-16"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0))",
            mixBlendMode: "soft-light",
          }}
        />

        {/* Text */}
        <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 max-w-4xl text-white">
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-white/90 text-base md:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
