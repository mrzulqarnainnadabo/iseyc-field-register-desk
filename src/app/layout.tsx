import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE, ORG, EVENT } from "@/lib/constants";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://iseyc-field-register-desk.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.productName}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.productName,
  authors: [{ name: ORG.fullName, url: ORG.web }],
  creator: ORG.name,
  publisher: ORG.fullName,
  category: "Community systems",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: SITE.productName,
    title: SITE.title,
    description: SITE.shortDescription,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${SITE.productName} — ${EVENT.programme} · Powered by ISEYC`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.shortDescription,
    images: ["/og.png"],
  },
  other: {
    "theme-color": "#0B3D2E",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B3D2E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-desk-paper font-sans antialiased">{children}</body>
    </html>
  );
}
