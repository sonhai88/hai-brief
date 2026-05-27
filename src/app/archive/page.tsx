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
  return date.slice(0, 7);
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-");
  const d = new Date(parseInt(y), parseInt(m) - 1, 1);
  return d.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
}

export default async function ArchivePage() {
  const briefs = await listBriefMetas();
  const dates = briefs.map((b) => b.date);

  const grouped = new Map<string, typeof briefs>();
  for (const b of briefs) {
    const k = monthKey(b.date);
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(b);
  }

  return (
    <section className="px-6 pt-20 pb-24 sm:pt-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-xs uppercase tracking-[0.18em] text-stone-500">Archive</div>
        <h1
          className="mt-6 font-semibold tracking-[-0.035em] text-stone-900"
          style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.02 }}
        >
          <span className="tabular">{briefs.length}</span>{" "}
          <span className="text-emerald-700">briefs</span> published.
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-xl leading-[1.65] text-stone-700">
          Mỗi sáng 1 digest tech. Duyệt theo lịch hoặc cuộn list bên dưới.
        </p>

        <div className="mt-12">
          <BriefCalendar availableDates={dates} />
        </div>

        {briefs.length === 0 ? (
          <p className="mt-16 font-serif text-stone-600">Chưa có brief nào. Đợi 7h sáng mai.</p>
        ) : (
          <div className="mt-16 space-y-12">
            {[...grouped.entries()].map(([mk, items]) => (
              <div key={mk}>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] capitalize text-emerald-700">
                  {monthLabel(mk)}
                  <span className="ml-3 font-sans text-stone-400 normal-case tracking-normal tabular">
                    {items.length} brief{items.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <ol className="divide-y divide-stone-200">
                  {items.map((m) => (
                    <li key={m.date}>
                      <Link
                        href={`/brief/${m.date}`}
                        className="tactile group flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-6"
                      >
                        <div className="shrink-0 sm:w-40">
                          <p className="text-xs uppercase tracking-[0.12em] text-stone-500 tabular">
                            {m.date}
                          </p>
                          <p className="mt-1 text-sm text-stone-600">{formatLongDate(m.date)}</p>
                        </div>
                        <p className="flex-1 font-serif text-[17px] leading-[1.6] text-stone-800 transition-colors group-hover:text-stone-900 sm:text-lg">
                          {m.summary}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-stone-500 tabular">
                          <span>{m.items} items</span>
                          <span
                            aria-hidden
                            className="text-stone-400 transition-colors group-hover:text-emerald-700"
                          >
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
