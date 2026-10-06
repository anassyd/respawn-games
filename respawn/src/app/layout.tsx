import type { Metadata } from "next";
import { Chakra_Petch, Sora, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Starfield } from "@/components/fx/starfield";
import { CursorGlow } from "@/components/fx/cursor-glow";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const display = Chakra_Petch({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const sans = Sora({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Respawn — Discover, rate and rank games", template: "%s · Respawn" },
  description: "Explore the most popular games and iconic characters, rate what you play and build tier lists.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Providers>
          <Starfield />
          <CursorGlow />
          <Navbar />
          <main className="relative z-10 min-h-[70vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
