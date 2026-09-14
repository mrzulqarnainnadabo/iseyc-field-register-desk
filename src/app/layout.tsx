import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE, ORG, PARTNER, STEWARDSHIP } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://iseyc-field-register-desk.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE.title,
    template: `%s · ${ORG.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.productName,
  authors: [{ name: ORG.fullName, url: ORG.web }],
  creator: ORG.name,
  publisher: ORG.fullName,
  category: "Health equity · Community systems",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: SITE.productName,
    title: SITE.title,
    description: SITE.shortDescription,
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: SITE.productName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.shortDescription,
    images: [`${siteUrl}/og.svg`],
  },
  appleWebApp: {
    capable: true,
    title: "Outreach Desk",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "theme-color": "#245B43",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#245B43",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE.productName,
  url: siteUrl,
  description: SITE.description,
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "NGN",
  },
  provider: {
    "@type": "Organization",
    name: ORG.fullName,
    url: ORG.web,
  },
  about: {
    "@type": "Thing",
    name: "Community outreach evidence for sickle cell health equity in Nigeria",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Field workers, programme managers, non-profit partners",
  },
  creator: {
    "@type": "Organization",
    name: ORG.name,
  },
  contributor: {
    "@type": "Person",
    name: STEWARDSHIP.dataSteward,
    jobTitle: STEWARDSHIP.stewardTitle,
    worksFor: {
      "@type": "Organization",
      name: PARTNER.name,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jakarta.variable} min-h-screen bg-desk-paper font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-desk-green focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
