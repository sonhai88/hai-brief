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
      <body className="min-h-full bg-stone-50 text-stone-900">
        <div className="flex min-h-screen flex-col">
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
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="tactile flex items-baseline gap-2">
          <span className="text-base font-semibold tracking-tight text-stone-900">Hai Brief</span>
          <span className="hidden text-xs text-stone-500 tabular sm:inline">— daily tech digest</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-stone-600 transition-colors hover:text-stone-900">
            Today
          </Link>
          <Link href="/archive" className="text-stone-600 transition-colors hover:text-stone-900">
            Archive
          </Link>
          <a
            href="https://t.me/ClaudeHaiCode_bot"
            target="_blank"
            rel="noreferrer"
            className="tactile inline-flex items-center gap-1.5 rounded-full border border-emerald-700/25 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 transition-colors hover:border-emerald-700/50 hover:bg-emerald-100"
          >
            <span className="size-1.5 rounded-full bg-emerald-700" aria-hidden />
            Telegram
          </a>
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-stone-200">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
        <p className="text-xs text-stone-500">
          Curated daily by Claude · Sources: HN, GitHub, The Verge, Anthropic, HF Papers, Sifted, KR-Asia
        </p>
        <p className="text-xs text-stone-400 tabular">© 2026 Hai Brief</p>
      </div>
    </footer>
  );
}
