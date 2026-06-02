export interface ProjectMeta {
  order: number;
  featured: boolean;
}

export interface HasProjectMeta {
  data: ProjectMeta;
}

/** Returns a new array sorted ascending by `data.order` (lower first). */
export function sortByOrder<T extends HasProjectMeta>(items: T[]): T[] {
  return [...items].sort((a, b) => a.data.order - b.data.order);
}

/** Returns only the entries flagged `data.featured`. */
export function onlyFeatured<T extends HasProjectMeta>(items: T[]): T[] {
  return items.filter((i) => i.data.featured);
}
