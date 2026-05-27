"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Props = {
  availableDates: string[];
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
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const firstDow = (cursor.getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const monthBriefsCount = cells.filter((d) => d && availableSet.has(toIso(d))).length;

  const goMonth = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  const goToday = () => setCursor(new Date(today.getFullYear(), today.getMonth(), 1));

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold capitalize text-stone-900 sm:text-xl">
            {monthLabel(cursor)}
          </h2>
          <p className="mt-0.5 text-xs text-stone-500 tabular">
            {monthBriefsCount} brief{monthBriefsCount === 1 ? "" : "s"} tháng này
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goMonth(-1)}
            className="tactile rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 hover:border-emerald-700/40 hover:bg-emerald-50 hover:text-emerald-800"
            aria-label="Tháng trước"
          >
            ←
          </button>
          <button
            onClick={goToday}
            className="tactile rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:border-emerald-700/40 hover:bg-emerald-50 hover:text-emerald-800"
          >
            Today
          </button>
          <button
            onClick={() => goMonth(1)}
            className="tactile rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 hover:border-emerald-700/40 hover:bg-emerald-50 hover:text-emerald-800"
            aria-label="Tháng sau"
          >
            →
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1.5 text-center">
        {VI_WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500"
          >
            {d}
          </div>
        ))}
      </div>

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
                    ? "border-emerald-700 bg-emerald-100 text-emerald-900 font-semibold ring-1 ring-emerald-700/40"
                    : "border-emerald-700/30 bg-emerald-50 text-emerald-800 hover:border-emerald-700 hover:bg-emerald-100"
                }`}
                aria-label={`Mở brief ${iso}`}
              >
                <span>{d.getDate()}</span>
                <span className="mt-0.5 size-1 rounded-full bg-emerald-700" aria-hidden />
              </Link>
            );
          }
          return (
            <div
              key={iso}
              className={`${base} border ${
                isToday
                  ? "border-stone-300 bg-stone-100 text-stone-700 ring-1 ring-stone-400/50"
                  : isFuture
                  ? "border-transparent text-stone-300"
                  : "border-transparent text-stone-400"
              }`}
              title={isToday ? "Hôm nay — brief chưa có" : isFuture ? "" : "Không có brief"}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-500">
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded border border-emerald-700/40 bg-emerald-50"
            aria-hidden
          />
          có brief
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded ring-1 ring-stone-400/60" aria-hidden />
          hôm nay
        </span>
        <span className="flex items-center gap-1.5 text-stone-400">
          <span className="size-2.5 rounded bg-stone-100" aria-hidden />
          chưa có
        </span>
      </div>
    </div>
  );
}
