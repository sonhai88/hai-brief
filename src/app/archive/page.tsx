import Link from "next/link";
import type { Metadata } from "next";
import { listBriefMetas, formatLongDate } from "@/lib/briefs";

export const metadata: Metadata = {
  title: "Archive — Hai Brief",
  description: "Tất cả tech brief đã xuất bản.",
};

export const revalidate = 60;

export default async function ArchivePage() {
  const briefs = await listBriefMetas();

  return (
    <section className="px-6 pt-24 pb-24 sm:pt-32">
      <div className="mx-auto max-w-4xl">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Archive</div>
        <h1
          className="mt-6 font-semibold tracking-[-0.035em] text-white"
          style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1 }}
        >
          {briefs.length} <span className="text-emerald-400">briefs</span> published.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Mỗi sáng 1 digest tech. Không spam, không clickbait. Lưu file JSON, render Next.js, host
          Vercel — đọc nhanh, share dễ.
        </p>

        {briefs.length === 0 ? (
          <p className="mt-16 text-zinc-500">Chưa có brief nào. Đợi 7h sáng mai.</p>
        ) : (
          <ol className="mt-16 divide-y divide-white/5">
            {briefs.map((m) => (
              <li key={m.date}>
                <Link
                  href={`/brief/${m.date}`}
                  className="tactile group flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-8"
                >
                  <div className="shrink-0 sm:w-48">
                    <p className="text-xs uppercase tracking-[0.12em] text-zinc-500 tabular">
                      {m.date}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{formatLongDate(m.date)}</p>
                  </div>
                  <p className="flex-1 text-base leading-relaxed text-zinc-200 transition-colors group-hover:text-white sm:text-lg">
                    {m.summary}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 tabular">
                    <span>{m.items} items</span>
                    <span aria-hidden className="text-zinc-700 transition-colors group-hover:text-emerald-400">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
