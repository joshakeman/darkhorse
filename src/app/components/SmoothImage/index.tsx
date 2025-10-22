"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";

function shimmer(width = 32, height = 20, c1 = "#222", c2 = "#111") {
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g"><stop stop-color="${c1}" offset="20%"/><stop stop-color="${c2}" offset="50%"/><stop stop-color="${c1}" offset="80%"/></linearGradient></defs>
    <rect width="${width}" height="${height}" fill="${c1}"/>
    <rect id="r" width="${width}" height="${height}" fill="url(#g)"/>
    <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="2s" repeatCount="indefinite"/>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

type Props = Omit<ImageProps, "onLoad"> & { blurDataURLFallback?: string };

export default function SmoothImage({
  className,
  blurDataURL,
  blurDataURLFallback,
  alt,
  ...imgProps
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Handle cached images that are already complete on mount
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <Image
      ref={ref as any}
      alt={alt}
      {...imgProps}
      placeholder="blur"
      blurDataURL={blurDataURL || blurDataURLFallback || shimmer()}
      className={[
        "transition-[opacity,transform,filter] duration-700 will-change-[opacity,transform,filter]",
        "opacity-[0.01] scale-[1.02] blur-[12px]",
        loaded && "opacity-100 scale-100 blur-0",
        className || "",
      ].join(" ")}
      onLoadingComplete={() => setLoaded(true)}
    />
  );
}
