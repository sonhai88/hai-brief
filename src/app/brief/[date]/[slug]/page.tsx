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

  // recommended reading: same section, other items
  const sameSection = brief.sections.find((s) => s.id === entry.sectionId);
  const others = (sameSection?.items ?? [])
    .filter((it) => it.title !== item.title)
    .slice(0, 3);

  return (
    <article className="px-6 pt-16 pb-24 sm:pt-24">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Hai Brief</Link>
          <span aria-hidden className="text-zinc-700">/</span>
          <Link href={`/brief/${date}`} className="hover:text-white transition-colors tabular">
            {date}
          </Link>
          <span aria-hidden className="text-zinc-700">/</span>
          <span className="text-zinc-500">{entry.sectionTitle}</span>
        </nav>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-zinc-400">
          <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 font-semibold text-emerald-300">
            {item.source}
          </span>
          <span className="tabular">{formatLongDate(brief.date)}</span>
          <span aria-hidden>·</span>
          <span className="tabular">{minutes} phút đọc</span>
        </div>

        {/* Title */}
        <h1
          className="mt-6 font-semibold tracking-[-0.025em] text-white"
          style={{ fontSize: "clamp(34px, 5vw, 56px)", lineHeight: 1.05 }}
        >
          {item.title}
        </h1>

        {/* Source link */}
        <a
          href={item.source_url}
          target="_blank"
          rel="noreferrer"
          className="tactile mt-5 inline-flex items-center gap-2 text-base font-medium text-emerald-400 hover:text-emerald-300"
        >
          <span className="tabular">{hostname}</span>
          <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* TL;DR */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">TL;DR</p>
          <p className="mt-3 text-lg leading-[1.6] text-zinc-100">{item.summary}</p>
          {item.why_care && (
            <p className="mt-4 border-t border-white/10 pt-4 text-base leading-[1.6] text-zinc-200">
              <span className="font-semibold text-emerald-300">Why care · </span>
              {item.why_care}
            </p>
          )}
        </div>

        {/* Analysis (markdown) */}
        {item.analysis ? (
          <div className="mt-12">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Phân tích
            </h2>
            <Prose>{item.analysis}</Prose>
          </div>
        ) : (
          <p className="mt-12 text-base text-zinc-400">
            Chưa có phân tích chi tiết cho bài này. Đọc nguyên bản tại{" "}
            <a
              href={item.source_url}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300"
            >
              {hostname} ↗
            </a>
            .
          </p>
        )}

        {/* Source CTA */}
        <div className="mt-16 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Nguồn gốc</p>
            <p className="mt-1 text-base text-zinc-100">{hostname}</p>
          </div>
          <a
            href={item.source_url}
            target="_blank"
            rel="noreferrer"
            className="tactile inline-flex items-center gap-2 self-start rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-emerald-300 sm:self-auto"
          >
            Đọc bài gốc
            <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Recommended reading — same section */}
        {others.length > 0 && (
          <aside className="mt-20 border-t border-white/5 pt-10">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-400">
              Cùng mục {entry.sectionTitle}
            </h3>
            <ul className="divide-y divide-white/5">
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
                        <p className="text-base font-medium text-zinc-100 transition-colors group-hover:text-emerald-300">
                          {it.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{it.summary}</p>
                      </div>
                      <span className="shrink-0 text-xs text-zinc-500 tabular">{it.source}</span>
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
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            ← Quay lại brief {date}
          </Link>
        </div>
      </div>
    </article>
  );
}
