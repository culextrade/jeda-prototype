import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { JedaProvider } from "@/lib/provider";
import AppFrame from "@/components/shell/AppFrame";
import AppHeader from "@/components/shell/AppHeader";
import BottomNav from "@/components/shell/BottomNav";
import FabJedaDulu from "@/components/shell/FabJedaDulu";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JEDA — Berhenti sejenak sebelum memutuskan",
  description: "Platform pemulihan utang emotional-first local-first",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${inter.variable} h-full`}>
      <body className="h-full bg-[#ECEFEF] text-ink font-sans antialiased overflow-hidden">
        <JedaProvider>
          <AppFrame>
            <AppHeader />
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
              {children}
            </main>
            <FabJedaDulu />
            <BottomNav />
          </AppFrame>
        </JedaProvider>
      </body>
    </html>
  );
}
