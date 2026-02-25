import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
// For metadata (og:image etc.) we need absolute URLs. metadataBase must be the origin
// so that paths like /repo/images/... resolve correctly on GitHub Pages.
const metadataBaseUrl = new URL(siteUrl);
const sharingImagePath = basePath
  ? `${basePath}/images/hero-hobbies.png`
  : "/images/hero-hobbies.png";

export const metadata: Metadata = {
  title: "Hobby Finder - Find Your Perfect Hobby",
  description:
    "Take a 5-minute personality test and discover hobbies that match who you are",
  metadataBase: metadataBaseUrl,
  icons: {
    icon: basePath ? `${basePath}/favicon.png` : "/favicon.png",
  },
  openGraph: {
    title: "Hobby Finder - Find Your Perfect Hobby",
    description:
      "Take a 5-minute personality test and discover hobbies that match who you are",
    type: "website",
    images: [
      {
        url: sharingImagePath,
        width: 800,
        height: 500,
        alt: "Hobby Finder — find your perfect hobby",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hobby Finder - Find Your Perfect Hobby",
    description:
      "Take a 5-minute personality test and discover hobbies that match who you are",
    images: [sharingImagePath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-413VRE62X1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-413VRE62X1');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
