import Image from "next/image";

type Props = {
  title: string;
  subtitle?: string;
  imageSrc?: string;      // optional override; defaults to walnut
  priority?: boolean;
};

export default function PageHeader({
  title,
  subtitle,
  imageSrc,
  priority = true,
}: Props) {
  const src = imageSrc ?? "/black-walnut-american-wood.webp";

  return (
    <header className="-mt-[96px] mb-10">
      <div className="relative w-full overflow-hidden rounded-b-3xl
                      h-[26vh] min-h-[220px] sm:h-[32vh] sm:min-h-[260px] md:h-[36vh]">

        {/* Walnut background */}
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-center"
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
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-white/90 text-base md:text-lg">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
