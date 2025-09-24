import Link from "next/link";

// src/app/components/Footer/index.tsx
export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-600">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-sm md:flex-row">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Dark Horse Woodworks. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link href="/our-story" className="hover:text-neutral-900">
            About
          </Link>
          <Link href="/gallery" className="hover:text-neutral-900">
            Gallery
          </Link>
          <Link href="/contact" className="hover:text-neutral-900">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
