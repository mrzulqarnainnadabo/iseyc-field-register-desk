import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE, ORG, EVENT } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://iseyc-field-register-desk.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: SITE.title, template: `%s · ${SITE.productName}` },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.productName,
  authors: [{ name: ORG.fullName, url: ORG.web }],
  creator: ORG.name,
  publisher: ORG.fullName,
  category: "Community systems",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: SITE.productName,
    title: SITE.title,
    description: SITE.shortDescription,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: `${SITE.productName} — ${EVENT.programme}` }],
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.shortDescription, images: [`${siteUrl}/og.svg`] },
  other: { "theme-color": "#0B5D43" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B5D43",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jakarta.variable} min-h-screen bg-desk-paper font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
