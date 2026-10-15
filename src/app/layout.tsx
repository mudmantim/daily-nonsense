import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const title = "The Daily Nonsense";
const description = "Your daily permission to waste 60 seconds.";

export const metadata: Metadata = {
  title,
  description,
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg" },
  // One canonical origin for metadata, RSS and /api/today: src/lib/site.ts
  // (NEXT_PUBLIC_SITE_URL when set, else the Vercel URL). Keeping it in one
  // place makes the custom-domain cutover a single change.
  metadataBase: new URL(SITE_URL),
  // Advertises the RSS feed to browsers and readers via
  // <link rel="alternate" type="application/rss+xml">, resolved against
  // metadataBase above.
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: "The Daily Nonsense" }],
    },
  },
  // Without these, a shared link renders bare in iMessage/Slack/Twitter -
  // no preview at all. The image itself is generated per-day from
  // today's actual item (see opengraph-image.tsx), not a static banner.
  openGraph: {
    title,
    description,
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1e293b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* One quiet outward link back to the parent site — the app's first
            element that points off-site, kept deliberately low-emphasis so it
            doesn't fight the restrained aesthetic. */}
        <footer className="bg-zinc-950 py-6 text-center">
          <a
            href="https://mudmantimsapps.com"
            className="text-[10px] uppercase tracking-[0.25em] text-white/30 underline-offset-4 transition hover:text-white/60 hover:underline"
          >
            Part of mudmantimsapps.com
          </a>
        </footer>
      </body>
    </html>
  );
}
