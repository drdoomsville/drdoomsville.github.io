import { describe, it, expect } from 'vitest';
import { sortByOrder, onlyFeatured, type HasProjectMeta } from './projects';

const make = (order: number, featured: boolean): HasProjectMeta => ({
  data: { order, featured },
});

describe('sortByOrder', () => {
  it('sorts ascending by order without mutating the input', () => {
    const input = [make(3, false), make(1, true), make(2, false)];
    const result = sortByOrder(input);
    expect(result.map((p) => p.data.order)).toEqual([1, 2, 3]);
    // original untouched
    expect(input.map((p) => p.data.order)).toEqual([3, 1, 2]);
  });
});

describe('onlyFeatured', () => {
  it('keeps only featured entries', () => {
    const input = [make(1, true), make(2, false), make(3, true)];
    const result = onlyFeatured(input);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.data.featured)).toBe(true);
  });
});
