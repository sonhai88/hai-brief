import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import {
  getBriefItem,
  listBriefDates,
  getBrief,
  formatLongDate,
  hostnameOf,
  slugify,
  readingMinutes,
} from "@/lib/briefs";

export const revalidate = 60;

export async function generateStaticParams() {
  const dates = await listBriefDates();
  const out: { date: string; slug: string }[] = [];
  for (const date of dates) {
    const b = await getBrief(date);
    if (!b) continue;
    for (const section of b.sections) {
      for (const item of section.items) {
        if (item.analysis) out.push({ date, slug: slugify(item.title) });
      }
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string; slug: string }>;
}): Promise<Metadata> {
  const { date, slug } = await params;
  const found = await getBriefItem(date, slug);
  if (!found) return { title: "Not found — Hai Brief" };
  return {
    title: `${found.entry.item.title} — Hai Brief`,
    description: found.entry.item.summary,
  };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ date: string; slug: string }>;
}) {
  const { date, slug } = await params;
  const found = await getBriefItem(date, slug);
  if (!found) notFound();
  const { brief, entry } = found;
  const { item } = entry;
  const hostname = hostnameOf(item.source_url);
  const minutes = item.analysis ? readingMinutes(item.analysis) : 1;

  const sameSection = brief.sections.find((s) => s.id === entry.sectionId);
  const others = (sameSection?.items ?? []).filter((it) => it.title !== item.title).slice(0, 3);

  return (
    // Reading mode: cream bg + dark warm text + serif prose (Substack/Medium pattern)
    <article className="bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-2xl px-6 pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Breadcrumb */}
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-900 transition-colors">Hai Brief</Link>
          <span aria-hidden className="text-stone-300">/</span>
          <Link href={`/brief/${date}`} className="hover:text-stone-900 transition-colors tabular">
            {date}
          </Link>
          <span aria-hidden className="text-stone-300">/</span>
          <span className="text-stone-500">{entry.sectionTitle}</span>
        </nav>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-stone-500">
          <span className="rounded-md border border-emerald-700/20 bg-emerald-700/5 px-2 py-1 font-semibold text-emerald-800">
            {item.source}
          </span>
          <span className="tabular">{formatLongDate(brief.date)}</span>
          <span aria-hidden>·</span>
          <span className="tabular">{minutes} phút đọc</span>
        </div>

        {/* Title — sans (Geist) cho display để contrast với body serif */}
        <h1
          className="mt-6 font-sans font-semibold tracking-[-0.02em] text-stone-900"
          style={{ fontSize: "clamp(32px, 4.6vw, 48px)", lineHeight: 1.1 }}
        >
          {item.title}
        </h1>

        {/* Source link */}
        <a
          href={item.source_url}
          target="_blank"
          rel="noreferrer"
          className="tactile mt-5 inline-flex items-center gap-2 text-base font-medium text-emerald-700 hover:text-emerald-800"
        >
          <span className="tabular underline decoration-emerald-700/30 underline-offset-[3px] hover:decoration-emerald-700">
            {hostname}
          </span>
          <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* TL;DR card */}
        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">TL;DR</p>
          <p className="mt-3 font-serif text-[18px] leading-[1.65] text-stone-800">{item.summary}</p>
          {item.why_care && (
            <p className="mt-4 border-t border-stone-200 pt-4 font-serif text-[17px] leading-[1.6] text-stone-700">
              <span className="font-sans font-semibold text-emerald-800">Why care · </span>
              {item.why_care}
            </p>
          )}
        </div>

        {/* Analysis */}
        {item.analysis ? (
          <div className="mt-14">
            <h2 className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Phân tích
            </h2>
            <Prose>{item.analysis}</Prose>
          </div>
        ) : (
          <p className="mt-14 font-serif text-[18px] leading-[1.75] text-stone-700">
            Chưa có phân tích chi tiết cho bài này. Đọc nguyên bản tại{" "}
            <a
              href={item.source_url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-700 underline decoration-emerald-700/30 underline-offset-[3px] hover:decoration-emerald-700"
            >
              {hostname} ↗
            </a>
            .
          </p>
        )}

        {/* Source CTA */}
        <div className="mt-16 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Nguồn gốc</p>
            <p className="mt-1 font-sans text-base font-medium text-stone-900">{hostname}</p>
          </div>
          <a
            href={item.source_url}
            target="_blank"
            rel="noreferrer"
            className="tactile inline-flex items-center gap-2 self-start rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 sm:self-auto"
          >
            Đọc bài gốc
            <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Recommended reading */}
        {others.length > 0 && (
          <aside className="mt-20 border-t border-stone-200 pt-10">
            <h3 className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
              Cùng mục {entry.sectionTitle}
            </h3>
            <ul className="divide-y divide-stone-200">
              {others.map((it) => {
                const otherSlug = slugify(it.title);
                const href = it.analysis ? `/brief/${date}/${otherSlug}` : it.source_url;
                const ext = !it.analysis;
                return (
                  <li key={it.title}>
                    <a
                      href={href}
                      target={ext ? "_blank" : undefined}
                      rel={ext ? "noreferrer" : undefined}
                      className="tactile group flex items-start justify-between gap-4 py-4"
                    >
                      <div>
                        <p className="font-sans text-base font-medium text-stone-900 transition-colors group-hover:text-emerald-700">
                          {it.title}
                        </p>
                        <p className="mt-1 font-serif text-[15px] leading-[1.55] text-stone-600 line-clamp-2">
                          {it.summary}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-stone-500 tabular">{it.source}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}

        {/* Back */}
        <div className="mt-16">
          <Link
            href={`/brief/${date}`}
            className="text-sm text-stone-500 transition-colors hover:text-stone-900"
          >
            ← Quay lại brief {date}
          </Link>
        </div>
      </div>
    </article>
  );
}
