import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const canonicalBase = basePath ? `${siteUrl}${basePath}` : siteUrl;

export const metadata: Metadata = {
  title: "Hobby Finder - Find Your Perfect Hobby",
  description:
    "Take a 5-minute personality test and discover hobbies that match who you are",
  metadataBase: new URL(canonicalBase),
  openGraph: {
    title: "Hobby Finder - Find Your Perfect Hobby",
    description:
      "Take a 5-minute personality test and discover hobbies that match who you are",
    type: "website",
    images: [
      {
        url: "/images/hero-hobbies.png",
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
    images: ["/images/hero-hobbies.png"],
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
        {children}
      </body>
    </html>
  );
}
