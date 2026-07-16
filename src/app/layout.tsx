import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

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
  // No production domain exists yet (see README - not deployed). Update
  // this to the real domain the moment one is chosen; until then it
  // falls back to localhost, which is only wrong for OG image URLs
  // generated in a production build, not for local dev.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
