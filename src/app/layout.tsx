import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GTG, getPublicSiteUrl } from "@/lib/gtg-config";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "From Girlhood to Greatness — Second Edition",
    template: "%s · From Girlhood to Greatness",
  },
  description: "Accepting My Greatness — From Becoming Her to Believing in Her. Sunday, 29 November 2026 at 1:00 PM, Yakubu Hub, Kaduna, Nigeria.",
  applicationName: GTG.title,
  authors: [{ name: GTG.organiser }],
  creator: GTG.organiser,
  publisher: GTG.organiser,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: GTG.title,
    title: "From Girlhood to Greatness — Second Edition",
    description: GTG.theme,
  },
  twitter: {
    card: "summary",
    title: "From Girlhood to Greatness — Second Edition",
    description: GTG.theme,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#5B2A4E",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
      <body>{children}</body>
    </html>
  );
}
