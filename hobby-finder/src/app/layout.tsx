import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hobby Finder - Find Your Perfect Hobby",
  description: "Take a 5-minute personality test and discover hobbies that match who you are",
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
