import Link from "next/link";
import { Hero } from "@/components/Hero";
import { BriefSection } from "@/components/BriefSection";
import { getLatestBrief, listBriefMetas, totalItems, formatLongDate } from "@/lib/briefs";

export const revalidate = 60;

export default async function HomePage() {
  const brief = await getLatestBrief();
  if (!brief) return <EmptyState />;

  const archive = (await listBriefMetas()).slice(1, 6);

  return (
    <>
      <Hero
        date={brief.date}
        itemsCount={totalItems(brief)}
        summary={brief.summary}
        isLatest
      />

      <div className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          {brief.sections.map((s) => (
            <BriefSection key={s.id} section={s} date={brief.date} />
          ))}
        </div>

        {archive.length > 0 && (
          <div className="mx-auto mt-24 max-w-4xl border-t border-white/5 pt-16">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-white">Previous briefs</h2>
              <Link href="/archive" className="text-sm text-zinc-400 hover:text-white">
                View all →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {archive.map((m) => (
                <Link
                  key={m.date}
                  href={`/brief/${m.date}`}
                  className="tactile group block rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/[0.04]"
                >
                  <p className="text-xs text-zinc-500 tabular">{formatLongDate(m.date)}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-snug text-zinc-200 group-hover:text-white">
                    {m.summary}
                  </p>
                  <p className="mt-3 text-xs text-zinc-600 tabular">{m.items} stories</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-start px-6 pt-32 pb-24">
      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">No brief yet</div>
      <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
        Brief đầu tiên
        <br />
        <span className="text-emerald-400">đang chuẩn bị.</span>
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-zinc-400">
        Mỗi sáng 7h, Hai Brief tự fetch tin công nghệ từ HN, GitHub, AI labs, EU/CN tech và tóm tắt thành
        digest đọc trong 3 phút.
      </p>
      <a
        href="https://t.me/ClaudeHaiCode_bot"
        target="_blank"
        rel="noreferrer"
        className="tactile mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-emerald-300"
      >
        Mở bot Telegram →
      </a>
    </section>
  );
}
