export interface ProjectMeta {
  timeframe: string;
}

export interface HasProjectMeta {
  data: ProjectMeta;
}

/** Extracts the start year from a timeframe string, e.g. "January 2000 – 2003" -> 2000. */
export function parseStartYear(timeframe: string): number {
  const match = timeframe.match(/\d{4}/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

/** Returns a new array sorted oldest-first by the start year of `data.timeframe`. */
export function sortByTimeframe<T extends HasProjectMeta>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => parseStartYear(a.data.timeframe) - parseStartYear(b.data.timeframe),
  );
}

/** Two-digit, zero-padded display index for positions 1–99, e.g. 8 -> "08". */
export function padIndex(position: number): string {
  return String(position).padStart(2, '0');
}
