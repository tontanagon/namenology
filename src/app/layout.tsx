import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "NAMENOLOGY — The Science of Name. The Power of Destiny.",
  description:
    "Discover the deep mathematical harmonics, phonetic vibrations, and numerological intelligence encoded within your name. Built for global thinkers, leaders, and innovators.",
  keywords: [
    "name science",
    "name analysis",
    "numerology",
    "phonetic resonance",
    "namenology",
    "destiny calculation",
    "scientific name analysis",
    "name harmony",
    "vibrational analysis",
  ],
  authors: [{ name: "NAMENOLOGY" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col font-sans bg-white text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
