import type { Rating as TRating } from "@/lib/briefs";
import { ratingHighlights } from "@/lib/briefs";

/** Inline badges — hiện CHỈ trục nào ≥ 4 (không spam list). */
export function RatingBadges({ rating }: { rating?: TRating }) {
  const hits = ratingHighlights(rating);
  if (hits.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {hits.map((h) => (
        <span
          key={h.key}
          className="inline-flex items-center gap-1 rounded-full border border-emerald-700/25 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800"
          title={`${h.label} — ${rating?.[h.key]}/5`}
        >
          <span aria-hidden>{h.icon}</span>
          {h.label}
        </span>
      ))}
    </div>
  );
}

/** Full dashboard 3 bar — render trên trang phân tích chi tiết. */
export function RatingDashboard({ rating }: { rating?: TRating }) {
  if (!rating) return null;
  const items: Array<{ key: keyof TRating; label: string; icon: string; help: string }> = [
    { key: "hay", label: "Hay / Đáng đọc", icon: "💡", help: "Depth, storytelling, novelty" },
    { key: "apply", label: "Áp dụng được", icon: "🛠️", help: "Dev VN/Flutter/mobile dùng ngay được" },
    { key: "bunno", label: "Bùng nổ", icon: "🔥", help: "Tiềm năng 6-12 tháng — capital, ecosystem" },
  ];
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
        Đánh giá
      </p>
      <div className="mt-4 space-y-4">
        {items.map((it) => {
          const score = rating[it.key];
          const pct = (score / 5) * 100;
          return (
            <div key={it.key}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-medium text-stone-800">
                  <span aria-hidden>{it.icon}</span>
                  {it.label}
                </p>
                <p className="font-sans text-sm font-semibold tabular text-stone-900">
                  <span>{score}</span>
                  <span className="text-stone-400">/5</span>
                </p>
              </div>
              <div
                className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100"
                role="meter"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={5}
                aria-label={it.label}
              >
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-stone-500">{it.help}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
