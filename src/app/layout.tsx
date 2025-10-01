// app/layout.tsx
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google"; // <— NEW
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
}); // <— NEW

// src/app/layout.tsx
export const metadata = {
  metadataBase: new URL("https://darkhorse-woodworks.netlify.app/"), // replace with your domain
  title: "Dark Horse Woodworks",
  description: "Modern design. Timeless craft.",
  openGraph: {
    type: "website",
    url: "/",
    title: "Dark Horse Woodworks",
    description: "Modern design. Timeless craft.",
    images: [
      {
        url: "/logo.png", // <- logo as preview
        width: 600, // your logo’s actual pixel size if you know it
        height: 600,
        alt: "Dark Horse Woodworks logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dark Horse Woodworks",
    description: "Modern design. Timeless craft.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} min-h-screen bg-white text-neutral-900 antialiased`}
      >
        {/* Skip to content for keyboard/screen readers */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-neutral-900 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        {/* Fixed site header (72px high) */}
        <Header />

        {/* Reserve space for the fixed header (with iOS notch safety) */}
        <main
          id="main"
          className="pt-[96px] [padding-top:calc(96px+env(safe-area-inset-top))]"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
