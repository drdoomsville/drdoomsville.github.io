export interface ProjectMeta {
  order: number;
}

export interface HasProjectMeta {
  data: ProjectMeta;
}

/** Returns a new array sorted ascending by `data.order` (lower first). */
export function sortByOrder<T extends HasProjectMeta>(items: T[]): T[] {
  return [...items].sort((a, b) => a.data.order - b.data.order);
}

/** Two-digit, zero-padded display index for orders 1–99, e.g. 8 -> "08". */
export function padIndex(order: number): string {
  return String(order).padStart(2, '0');
}
