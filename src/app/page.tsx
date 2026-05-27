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
        <div className="mx-auto max-w-3xl">
          {brief.sections.map((s) => (
            <BriefSection key={s.id} section={s} date={brief.date} />
          ))}
        </div>

        {archive.length > 0 && (
          <div className="mx-auto mt-24 max-w-3xl border-t border-stone-200 pt-16">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Previous briefs
              </h2>
              <Link
                href="/archive"
                className="text-sm text-stone-600 hover:text-stone-900"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {archive.map((m) => (
                <Link
                  key={m.date}
                  href={`/brief/${m.date}`}
                  className="tactile group block rounded-xl border border-stone-200 bg-white p-5 transition-colors hover:border-emerald-700/40 hover:bg-emerald-50"
                >
                  <p className="text-xs text-stone-500 tabular">{formatLongDate(m.date)}</p>
                  <p className="mt-2 line-clamp-2 font-serif text-[15px] leading-[1.55] text-stone-800 group-hover:text-stone-900">
                    {m.summary}
                  </p>
                  <p className="mt-3 text-xs text-stone-500 tabular">{m.items} stories</p>
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
      <div className="text-xs uppercase tracking-[0.18em] text-stone-500">No brief yet</div>
      <h1 className="mt-6 text-5xl font-semibold tracking-tight text-stone-900 sm:text-6xl">
        Brief đầu tiên
        <br />
        <span className="text-emerald-700">đang chuẩn bị.</span>
      </h1>
      <p className="mt-6 font-serif text-xl leading-[1.65] text-stone-700">
        Mỗi sáng 7h, Hai Brief tự fetch tin công nghệ từ HN, GitHub, AI labs, EU/CN tech và tóm tắt
        thành digest đọc trong 3 phút.
      </p>
      <a
        href="https://t.me/ClaudeHaiCode_bot"
        target="_blank"
        rel="noreferrer"
        className="tactile mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
      >
        Mở bot Telegram →
      </a>
    </section>
  );
}
