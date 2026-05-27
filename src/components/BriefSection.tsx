import Link from "next/link";
import type { BriefSection as TSection } from "@/lib/briefs";
import { hostnameOf, slugify } from "@/lib/briefs";

export function BriefSection({ section, date }: { section: TSection; date: string }) {
  return (
    <section className="border-t border-white/5 py-12 sm:py-16">
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            <span aria-hidden className="text-[1.4em]">{section.icon}</span>
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-1 text-sm text-zinc-500 tabular">{section.subtitle}</p>
          )}
        </div>
        <span className="text-xs text-zinc-600 tabular">{section.items.length} items</span>
      </header>

      <div className="divide-y divide-white/10">
        {section.items.map((item, i) => {
          const slug = slugify(item.title);
          const detailHref = item.analysis ? `/brief/${date}/${slug}` : null;
          return (
            <article key={i} className="group py-7 first:pt-0">
              <div className="flex items-start justify-between gap-4">
                {detailHref ? (
                  <Link
                    href={detailHref}
                    className="tactile text-xl font-semibold leading-snug text-white transition-colors hover:text-emerald-300 sm:text-2xl"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="tactile text-xl font-semibold leading-snug text-white transition-colors hover:text-emerald-300 sm:text-2xl"
                  >
                    {item.title}
                  </a>
                )}
                <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-200">
                  {item.source}
                </span>
              </div>

              <a
                href={item.source_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-emerald-400 tabular hover:text-emerald-300"
              >
                {hostnameOf(item.source_url)} ↗
              </a>

              <p className="mt-4 text-[17px] leading-[1.7] text-zinc-100">{item.summary}</p>

              {item.why_care && (
                <p className="mt-4 border-l-2 border-emerald-400/60 pl-4 text-base leading-[1.65] text-zinc-200">
                  <span className="font-semibold text-emerald-300">Why care · </span>
                  {item.why_care}
                </p>
              )}

              {detailHref && (
                <Link
                  href={detailHref}
                  className="tactile mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300"
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
