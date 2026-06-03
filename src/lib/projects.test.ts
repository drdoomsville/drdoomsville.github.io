import { describe, it, expect } from 'vitest';
import { sortByOrder, type HasProjectMeta } from './projects';

const make = (order: number): HasProjectMeta => ({
  data: { order },
});

describe('sortByOrder', () => {
  it('sorts ascending by order without mutating the input', () => {
    const input = [make(3), make(1), make(2)];
    const result = sortByOrder(input);
    expect(result.map((p) => p.data.order)).toEqual([1, 2, 3]);
    // original untouched
    expect(input.map((p) => p.data.order)).toEqual([3, 1, 2]);
  });
});
