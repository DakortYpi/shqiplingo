import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShqipLingo - Albanisch lernen auf Deutsch",
  description: "Lerne Standardalbanisch (Gjuha Standarde) spielerisch mit interaktiven Lektionen, Karteikarten und KI-Tutor.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShqipLingo",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#E41B17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-red-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
