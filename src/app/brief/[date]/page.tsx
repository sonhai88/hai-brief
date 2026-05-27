import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { BriefSection } from "@/components/BriefSection";
import {
  getBrief,
  listBriefDates,
  totalItems,
  formatLongDate,
} from "@/lib/briefs";

export const revalidate = 60;

export async function generateStaticParams() {
  const dates = await listBriefDates();
  return dates.map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const b = await getBrief(date);
  if (!b) return { title: "Not found — Hai Brief" };
  return {
    title: `${formatLongDate(b.date)} — Hai Brief`,
    description: b.summary,
  };
}

export default async function BriefPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const brief = await getBrief(date);
  if (!brief) notFound();

  const dates = await listBriefDates();
  const idx = dates.indexOf(date);
  const newer = idx > 0 ? dates[idx - 1] : null;
  const older = idx < dates.length - 1 ? dates[idx + 1] : null;
  const isLatest = idx === 0;

  return (
    <>
      <Hero
        date={brief.date}
        itemsCount={totalItems(brief)}
        summary={brief.summary}
        isLatest={isLatest}
      />

      <div className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          {brief.sections.map((s) => (
            <BriefSection key={s.id} section={s} date={brief.date} />
          ))}

          <nav className="mt-16 grid grid-cols-2 gap-4 border-t border-stone-200 pt-8 text-sm">
            {older ? (
              <Link
                href={`/brief/${older}`}
                className="tactile group rounded-xl border border-stone-200 bg-white p-5 transition-colors hover:border-emerald-700/40 hover:bg-emerald-50"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">← Older</p>
                <p className="mt-2 text-stone-700 group-hover:text-stone-900 tabular">
                  {formatLongDate(older)}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {newer ? (
              <Link
                href={`/brief/${newer}`}
                className="tactile group rounded-xl border border-stone-200 bg-white p-5 text-right transition-colors hover:border-emerald-700/40 hover:bg-emerald-50"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Newer →</p>
                <p className="mt-2 text-stone-700 group-hover:text-stone-900 tabular">
                  {formatLongDate(newer)}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
