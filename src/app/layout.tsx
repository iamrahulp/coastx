import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url.mjs";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "CoastX | Experience the coast", template: "%s | CoastX" },
  description: "Discover extraordinary adventures, culture, food and hidden experiences across coastal Karnataka.",
  openGraph: { title: "CoastX | Experience the coast", description: "Don't just visit the coast. Experience it.", type: "website", locale: "en_IN" },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/coastx-icon.svg", apple: "/coastx-icon.svg" },
  applicationName: "CoastX",
  appleWebApp: { capable: true, title: "CoastX", statusBarStyle: "default" },
  other: { "theme-color": "#092f33" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
