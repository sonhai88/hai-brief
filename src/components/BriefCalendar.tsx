"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Props = {
  availableDates: string[]; // YYYY-MM-DD list
};

const VI_WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
}

export function BriefCalendar({ availableDates }: Props) {
  const today = useMemo(() => new Date(), []);
  const todayIso = toIso(today);
  const availableSet = useMemo(() => new Set(availableDates), [availableDates]);

  // mặc định mở vào tháng có today
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  // cells của lưới: bắt đầu Mon (theo VN). offset = (dayOfWeek + 6) % 7 cho Mon=0
  const firstDow = (cursor.getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const monthBriefsCount = cells.filter((d) => d && availableSet.has(toIso(d))).length;

  const goMonth = (delta: number) => {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  };
  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      {/* header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold capitalize text-white sm:text-xl">{monthLabel(cursor)}</h2>
          <p className="mt-0.5 text-xs text-zinc-400 tabular">
            {monthBriefsCount} brief{monthBriefsCount === 1 ? "" : "s"} tháng này
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goMonth(-1)}
            className="tactile rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
            aria-label="Tháng trước"
          >
            ←
          </button>
          <button
            onClick={goToday}
            className="tactile rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-zinc-200 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
          >
            Today
          </button>
          <button
            onClick={() => goMonth(1)}
            className="tactile rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
            aria-label="Tháng sau"
          >
            →
          </button>
        </div>
      </div>

      {/* weekday header */}
      <div className="mb-2 grid grid-cols-7 gap-1.5 text-center">
        {VI_WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {d}
          </div>
        ))}
      </div>

      {/* grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="aspect-square" aria-hidden />;
          const iso = toIso(d);
          const has = availableSet.has(iso);
          const isToday = iso === todayIso;
          const isFuture = d > today;

          const base =
            "aspect-square flex flex-col items-center justify-center rounded-lg text-sm tabular transition-colors";

          if (has) {
            return (
              <Link
                key={iso}
                href={`/brief/${iso}`}
                className={`${base} tactile border ${
                  isToday
                    ? "border-emerald-400 bg-emerald-400/20 text-white font-semibold ring-1 ring-emerald-400/40"
                    : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:border-emerald-400/60 hover:bg-emerald-400/20 hover:text-white"
                }`}
                aria-label={`Mở brief ${iso}`}
              >
                <span>{d.getDate()}</span>
                <span className="mt-0.5 size-1 rounded-full bg-emerald-400" aria-hidden />
              </Link>
            );
          }
          return (
            <div
              key={iso}
              className={`${base} border border-transparent ${
                isToday
                  ? "bg-white/[0.04] text-zinc-300 ring-1 ring-white/20"
                  : isFuture
                  ? "text-zinc-700"
                  : "text-zinc-500"
              }`}
              title={isToday ? "Hôm nay — brief chưa có" : has ? "" : "Không có brief"}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>

      {/* legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded border border-emerald-400/40 bg-emerald-400/15" aria-hidden />
          có brief
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded ring-1 ring-white/30" aria-hidden />
          hôm nay
        </span>
        <span className="flex items-center gap-1.5 text-zinc-600">
          <span className="size-2.5 rounded bg-white/5" aria-hidden />
          chưa có
        </span>
      </div>
    </div>
  );
}
