import Link from "next/link";
import { formatLongDate } from "@/lib/briefs";

type Props = {
  date: string;
  itemsCount: number;
  summary: string;
  isLatest?: boolean;
};

export function Hero({ date, itemsCount, summary, isLatest = true }: Props) {
  return (
    <section className="relative px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-4xl">
        <div className="reveal flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
          {isLatest && <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden />}
          <span className="tabular">{formatLongDate(date)}</span>
          <span aria-hidden>·</span>
          <span className="tabular">{itemsCount} stories</span>
        </div>

        <h1
          className="reveal mt-6 font-semibold tracking-[-0.035em] text-white"
          style={{
            fontSize: "clamp(48px, 7.5vw, 104px)",
            lineHeight: 0.95,
            animationDelay: "60ms",
          }}
        >
          {isLatest ? "Today" : "Brief"}{" "}
          <span className="text-emerald-400">in tech.</span>
        </h1>

        <p
          className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl"
          style={{ animationDelay: "120ms" }}
        >
          {summary}
        </p>

        <div className="reveal mt-10 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: "180ms" }}>
          <Link
            href={`/brief/${date}`}
            className="tactile inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-300"
          >
            Read full brief
            <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href="/archive" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Browse archive →
          </Link>
        </div>
      </div>
    </section>
  );
}
