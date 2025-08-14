"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import logo from "../../../../public/logo.png"; // Replace with your logo path

// Tailwind prerequisites (suggested):
// - container: { center: true, padding: "1rem" } in tailwind.config
// - font: a refined sans such as Inter or Montserrat via next/font
// - colors: keep neutral palette; use text-neutral-900, text-neutral-600, etc.

export type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/press", label: "Press" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ nav = NAV }: { nav?: NavItem[] }) {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const [scrolled, setScrolled] = useState(!onHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!onHome) return;
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-[200] transition-colors duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur shadow-sm text-neutral-900"
          : "bg-black/30 backdrop-blur-sm text-white", // translucent over hero
      ].join(" ")}
    >
      <div className="container mx-auto h-[96px] px-4 flex items-center gap-6 pt-[env(safe-area-inset-top)]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Dark Horse Woodworks home"
        >
          <Image
            src={logo}
            alt="Logo"
            className="block h-28 w-auto" // <-- block avoids baseline bleed
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "text-sm uppercase tracking-wider transition-colors " +
                  (active
                    ? scrolled
                      ? "text-neutral-900"
                      : "text-white"
                    : scrolled
                    ? "text-neutral-600 hover:text-neutral-900"
                    : "text-white/80 hover:text-white")
                }
              >
                {item.label}
              </Link>
            );
          })}

          {/* CTA (optional) */}
          <Link
            href="/gallery"
            className={
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors " +
              (scrolled
                ? "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                : "border-white/80 text-white hover:bg-white/10")
            }
          >
            View Our Work
          </Link>
        </nav>

        {/* Mobile toggler */}
        <button
          aria-label="Open menu"
          className={
            "md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md ring-1 ring-inset transition-colors " +
            (scrolled
              ? "ring-neutral-300 text-neutral-900"
              : "ring-white/30 text-white")
          }
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={
          "md:hidden transition-[max-height] duration-300 overflow-hidden " +
          (open ? "max-h-96" : "max-h-0")
        }
      >
        <div
          className={"container mx-auto pb-4 " + (scrolled ? "" : "text-white")}
        >
          <nav className="flex flex-col gap-2 pt-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "rounded-md px-2 py-2 text-base tracking-wide transition-colors " +
                    (active
                      ? scrolled
                        ? "bg-neutral-900 text-white"
                        : "bg-white/10 text-white"
                      : scrolled
                      ? "text-neutral-700 hover:bg-neutral-100"
                      : "text-white/90 hover:bg-white/10")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/gallery"
              className={
                "mt-1 rounded-full border px-4 py-2 text-center text-sm font-medium " +
                (scrolled
                  ? "border-neutral-900 text-neutral-900"
                  : "border-white/80 text-white")
              }
            >
              View Our Work
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

/*
USAGE (App Router):

// app/layout.tsx
import type { ReactNode } from "react";
import Header from "@/components/Header";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900">
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
*/
