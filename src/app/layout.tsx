import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hai Brief — Daily tech digest",
  description:
    "Tin công nghệ thế giới mỗi sáng — Hacker News, GitHub trending, AI labs, EU/CN tech. Curated by Claude, đọc trong 3 phút.",
  metadataBase: new URL("https://hai-brief.vercel.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="ambient-blob" aria-hidden />
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/60 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="tactile flex items-baseline gap-2">
          <span className="text-base font-semibold tracking-tight text-white">Hai Brief</span>
          <span className="hidden text-xs text-zinc-500 tabular sm:inline">— daily tech digest</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-zinc-400 transition-colors hover:text-white">
            Today
          </Link>
          <Link href="/archive" className="text-zinc-400 transition-colors hover:text-white">
            Archive
          </Link>
          <a
            href="https://t.me/ClaudeHaiCode_bot"
            target="_blank"
            rel="noreferrer"
            className="tactile inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 transition-colors hover:border-emerald-400/50 hover:bg-emerald-400/15"
          >
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
            Telegram
          </a>
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
        <p className="text-xs text-zinc-500">
          Curated daily by Claude · Sources: HN, GitHub, The Verge, Anthropic, HF Papers, Sifted, KR-Asia
        </p>
        <p className="text-xs text-zinc-600 tabular">© 2026 Hai Brief</p>
      </div>
    </footer>
  );
}
