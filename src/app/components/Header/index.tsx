"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

const NAV: Item[] = [
  { href: "/gallery", label: "Gallery" },
  { href: "/our-story", label: "Our Story" },
  { href: "/working-with-darkhorse", label: "Our Process" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!onHome);
  const [open, setOpen] = useState(false);

  // Transparent on top of home, solid on scroll
  useEffect(() => {
    if (!onHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-[200] transition-colors duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 text-neutral-900 shadow-sm"
          : "bg-black/30 backdrop-blur-sm text-white",
      ].join(" ")}
    >
      <div className="container mx-auto flex h-[96px] items-center gap-4 px-4 pt-[env(safe-area-inset-top)]">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Home">
          {/* Adjust the sizes if you want the logo to ‘kiss’ the header bottom on desktop */}
          <Image
            src="/logo.png"
            alt="Dark Horse Woodworks"
            width={256}
            height={256}
            priority
            className="h-20 w-auto md:h-28"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-8 md:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "text-sm transition-opacity hover:opacity-80",
                  active ? "font-medium" : "opacity-90",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}

          {/* CTA */}
          <Link
            href="/gallery"
            className="rounded-md border px-4 py-2 text-sm transition hover:bg-neutral-900 hover:text-white border-current"
          >
            View Our Work
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 md:hidden focus:outline-none focus:ring-2 focus:ring-neutral-500/30"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      <MobileMenu open={open} pathname={pathname} />
    </header>
  );
}

function MobileMenu({ open, pathname }: { open: boolean; pathname: string }) {
  return (
    <div
      className={[
        "md:hidden overflow-hidden transition-[max-height,opacity] duration-300",
        open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0",
      ].join(" ")}
    >
      <div className="border-t border-black/10 bg-white/95 px-4 pb-6 pt-3 text-neutral-900 backdrop-blur">
        <nav className="flex flex-col">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-md px-2 py-2 text-base",
                  active ? "font-semibold" : "font-normal",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/gallery"
            className="mt-2 rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium"
          >
            View Our Work
          </Link>
        </nav>
      </div>
    </div>
  );
}
