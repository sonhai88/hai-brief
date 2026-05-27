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
    <section className="px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
      <div className="mx-auto max-w-3xl">
        <div className="reveal flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-stone-500">
          {isLatest && (
            <span
              className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600"
              aria-hidden
            />
          )}
          <span className="tabular">{formatLongDate(date)}</span>
          <span aria-hidden>·</span>
          <span className="tabular">{itemsCount} stories</span>
        </div>

        <h1
          className="reveal mt-6 font-semibold tracking-[-0.035em] text-stone-900"
          style={{
            fontSize: "clamp(40px, 6vw, 80px)",
            lineHeight: 0.98,
            animationDelay: "60ms",
          }}
        >
          {isLatest ? "Today" : "Brief"}{" "}
          <span className="text-emerald-700">in tech.</span>
        </h1>

        <p
          className="reveal mt-7 max-w-2xl font-serif text-xl leading-[1.65] text-stone-700 sm:text-2xl"
          style={{ animationDelay: "120ms" }}
        >
          {summary}
        </p>

        <div
          className="reveal mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
          style={{ animationDelay: "180ms" }}
        >
          <Link
            href={`/brief/${date}`}
            className="tactile inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
          >
            Read full brief
            <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link
            href="/archive"
            className="text-sm text-stone-600 transition-colors hover:text-stone-900"
          >
            Browse archive →
          </Link>
        </div>
      </div>
    </section>
  );
}
