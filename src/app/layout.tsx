import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import AppFrame from "@/components/shell/AppFrame";
import ShellChrome from "@/components/shell/ShellChrome";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JEDA — Berhenti sejenak, sebelum terjerat lebih dalam",
  description:
    "Intervensi terintegrasi finansial–mental: petakan kondisi keuangan dan kesehatan mentalmu, lalu susun rencana pemulihan personal.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="h-full overflow-hidden font-sans text-ink antialiased">
        <AppFrame>
          <ShellChrome>{children}</ShellChrome>
        </AppFrame>
      </body>
    </html>
  );
}
