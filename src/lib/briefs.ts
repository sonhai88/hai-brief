import fs from "node:fs/promises";
import path from "node:path";

export type BriefItem = {
  title: string;
  source: string;
  source_url: string;
  summary: string;
  why_care?: string;
};

export type BriefSection = {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  items: BriefItem[];
};

export type Brief = {
  date: string; // YYYY-MM-DD
  generated_at: string;
  summary: string;
  sections: BriefSection[];
};

export type BriefMeta = Pick<Brief, "date" | "summary"> & { items: number };

const DATA_DIR = path.join(process.cwd(), "data");

export async function listBriefDates(): Promise<string[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    return files
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => f.replace(/\.json$/, ""))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export async function getBrief(date: string): Promise<Brief | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${date}.json`), "utf-8");
    return JSON.parse(raw) as Brief;
  } catch {
    return null;
  }
}

export async function getLatestBrief(): Promise<Brief | null> {
  const dates = await listBriefDates();
  return dates[0] ? getBrief(dates[0]) : null;
}

export async function listBriefMetas(): Promise<BriefMeta[]> {
  const dates = await listBriefDates();
  const briefs = await Promise.all(dates.map(getBrief));
  return briefs
    .filter((b): b is Brief => !!b)
    .map((b) => ({
      date: b.date,
      summary: b.summary,
      items: b.sections.reduce((n, s) => n + s.items.length, 0),
    }));
}

export function formatLongDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function totalItems(b: Brief): number {
  return b.sections.reduce((n, s) => n + s.items.length, 0);
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
