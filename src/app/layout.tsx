import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { OfflineNotice, ServiceWorkerRegistration } from "@/components/offline";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "JesTech Nexus — Skills and knowledge that work for Liberia",
    template: "%s · JesTech Nexus",
  },
  description:
    "Practical courses, a digital library, local experts and partners — a JesTech innovation and talent ecosystem for Liberia.",
  applicationName: "JesTech Nexus",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <OfflineNotice />
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
