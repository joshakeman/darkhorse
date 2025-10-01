// src/app/components/Footer/index.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-600">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-8 text-sm">
        {/* Left: copyright */}
        <p className="text-center md:text-left text-neutral-500">
          © {new Date().getFullYear()} Dark Horse Woodworks.{" "}
          <span className="hidden sm:inline">All rights reserved.</span>
        </p>

        {/* Right: navigation */}
        <nav className="flex gap-6 text-neutral-600">
          <Link
            href="/our-story"
            className="transition-colors hover:text-neutral-900"
          >
            About
          </Link>
          <Link
            href="/gallery"
            className="transition-colors hover:text-neutral-900"
          >
            Gallery
          </Link>
          <Link
            href="/blog"
            className="transition-colors hover:text-neutral-900"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-neutral-900"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
