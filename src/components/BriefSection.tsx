import Link from "next/link";
import type { BriefSection as TSection } from "@/lib/briefs";
import { hostnameOf, slugify } from "@/lib/briefs";

export function BriefSection({ section, date }: { section: TSection; date: string }) {
  return (
    <section className="border-t border-stone-200 py-12 sm:py-16">
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            <span aria-hidden className="text-[1.3em]">{section.icon}</span>
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-1 text-sm text-stone-500 tabular">{section.subtitle}</p>
          )}
        </div>
        <span className="text-xs text-stone-400 tabular">{section.items.length} items</span>
      </header>

      <div className="divide-y divide-stone-200">
        {section.items.map((item, i) => {
          const slug = slugify(item.title);
          const detailHref = item.analysis ? `/brief/${date}/${slug}` : null;
          return (
            <article key={i} className="group py-7 first:pt-0">
              <div className="flex items-start justify-between gap-4">
                {detailHref ? (
                  <Link
                    href={detailHref}
                    className="tactile text-xl font-semibold leading-snug text-stone-900 transition-colors hover:text-emerald-800 sm:text-2xl"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="tactile text-xl font-semibold leading-snug text-stone-900 transition-colors hover:text-emerald-800 sm:text-2xl"
                  >
                    {item.title}
                  </a>
                )}
                <span className="shrink-0 rounded-md border border-stone-200 bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                  {item.source}
                </span>
              </div>

              <a
                href={item.source_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-emerald-700 tabular hover:text-emerald-800"
              >
                {hostnameOf(item.source_url)} ↗
              </a>

              <p className="mt-4 font-serif text-[18px] leading-[1.75] text-stone-800">
                {item.summary}
              </p>

              {item.why_care && (
                <p className="mt-4 border-l-2 border-emerald-700/50 pl-4 font-serif text-[16px] leading-[1.7] text-stone-700">
                  <span className="font-sans font-semibold text-emerald-800">Why care · </span>
                  {item.why_care}
                </p>
              )}

              {detailHref && (
                <Link
                  href={detailHref}
                  className="tactile mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  Đọc phân tích chi tiết
                  <span aria-hidden>→</span>
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
