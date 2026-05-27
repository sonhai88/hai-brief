import Link from "next/link";
import type { Metadata } from "next";
import { listBriefMetas, formatLongDate } from "@/lib/briefs";
import { BriefCalendar } from "@/components/BriefCalendar";

export const metadata: Metadata = {
  title: "Archive — Hai Brief",
  description: "Mục lục tất cả tech brief đã xuất bản, duyệt theo lịch.",
};

export const revalidate = 60;

function monthKey(date: string): string {
  // "2026-05-27" → "2026-05"
  return date.slice(0, 7);
}

function monthLabel(key: string): string {
  // "2026-05" → "Tháng 5, 2026"
  const [y, m] = key.split("-");
  const d = new Date(parseInt(y), parseInt(m) - 1, 1);
  return d.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
}

export default async function ArchivePage() {
  const briefs = await listBriefMetas();
  const dates = briefs.map((b) => b.date);

  // group by month — desc
  const grouped = new Map<string, typeof briefs>();
  for (const b of briefs) {
    const k = monthKey(b.date);
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(b);
  }

  return (
    <section className="px-6 pt-24 pb-24 sm:pt-32">
      <div className="mx-auto max-w-4xl">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Archive</div>
        <h1
          className="mt-6 font-semibold tracking-[-0.035em] text-white"
          style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1 }}
        >
          <span className="tabular">{briefs.length}</span>{" "}
          <span className="text-emerald-400">briefs</span> published.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-[1.55] text-zinc-100">
          Mỗi sáng 1 digest tech. Duyệt theo lịch hoặc cuộn list bên dưới.
        </p>

        {/* CALENDAR */}
        <div className="mt-12">
          <BriefCalendar availableDates={dates} />
        </div>

        {/* LIST grouped by month */}
        {briefs.length === 0 ? (
          <p className="mt-16 text-zinc-400">Chưa có brief nào. Đợi 7h sáng mai.</p>
        ) : (
          <div className="mt-16 space-y-12">
            {[...grouped.entries()].map(([mk, items]) => (
              <div key={mk}>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400 capitalize">
                  {monthLabel(mk)}
                  <span className="ml-3 text-zinc-500 normal-case tracking-normal tabular">
                    {items.length} brief{items.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <ol className="divide-y divide-white/10">
                  {items.map((m) => (
                    <li key={m.date}>
                      <Link
                        href={`/brief/${m.date}`}
                        className="tactile group flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-6"
                      >
                        <div className="shrink-0 sm:w-40">
                          <p className="text-xs uppercase tracking-[0.12em] text-zinc-500 tabular">
                            {m.date}
                          </p>
                          <p className="mt-1 text-sm text-zinc-300">{formatLongDate(m.date)}</p>
                        </div>
                        <p className="flex-1 text-base leading-[1.6] text-zinc-100 transition-colors group-hover:text-white sm:text-lg">
                          {m.summary}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 tabular">
                          <span>{m.items} items</span>
                          <span aria-hidden className="text-zinc-600 transition-colors group-hover:text-emerald-400">
                            →
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
