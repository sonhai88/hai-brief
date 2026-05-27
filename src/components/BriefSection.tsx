import type { BriefSection as TSection } from "@/lib/briefs";
import { hostnameOf } from "@/lib/briefs";

export function BriefSection({ section }: { section: TSection }) {
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

      <div className="divide-y divide-white/5">
        {section.items.map((item, i) => (
          <article key={i} className="group py-6 first:pt-0">
            <a
              href={item.source_url}
              target="_blank"
              rel="noreferrer"
              className="tactile block"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-medium leading-snug text-zinc-100 transition-colors group-hover:text-emerald-300 sm:text-xl">
                  {item.title}
                </h3>
                <span className="shrink-0 rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  {item.source}
                </span>
              </div>

              <p className="mt-2 text-sm text-emerald-400/80 tabular">
                {hostnameOf(item.source_url)}
              </p>

              <p className="mt-3 text-base leading-relaxed text-zinc-300">
                {item.summary}
              </p>

              {item.why_care && (
                <p className="mt-3 border-l-2 border-emerald-400/30 pl-4 text-sm italic leading-relaxed text-zinc-400">
                  <span className="font-medium not-italic text-zinc-300">Why care: </span>
                  {item.why_care}
                </p>
              )}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
