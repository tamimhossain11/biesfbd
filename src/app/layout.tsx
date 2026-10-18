import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.SITE_URL || "https://biesfbd.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BIESF 2026 Bangladesh | Dhaka to Bali",
    template: "%s | BIESF 2026 Bangladesh",
  },
  description:
    "Official Bangladesh website for BIESF 2026 (Bali International Engineering Science Fair). Dreams of Bangladesh is the Official Representative & National Selection Body. Register now.",
  openGraph: {
    type: "website",
    siteName: "BIESF 2026 Bangladesh",
    locale: "en_US",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "BIESF 2026 Bangladesh: Dhaka to Bali" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#163496",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable} data-scroll-behavior="smooth">
      <body className="font-sans">{children}</body>
    </html>
  );
}
