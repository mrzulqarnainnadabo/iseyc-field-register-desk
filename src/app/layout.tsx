import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISEYC Field Register Desk",
  description:
    "Intake desk for the Tirngan Sickle Cell Foundation 5th Anniversary Dinner & Recognition Ceremony, and ongoing programme participation records. Powered by ISEYC.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-desk-paper font-sans antialiased">{children}</body>
    </html>
  );
}
