import { describe, it, expect } from 'vitest';
import { sortByTimeframe, parseStartYear, padIndex, type HasProjectMeta } from './projects';

const make = (timeframe: string): HasProjectMeta => ({
  data: { timeframe },
});

describe('parseStartYear', () => {
  it('returns the year of a single-year timeframe', () => {
    expect(parseStartYear('1995')).toBe(1995);
  });

  it('returns the start year of a range', () => {
    expect(parseStartYear('1993 – 1995')).toBe(1993);
  });

  it('ignores a leading month name', () => {
    expect(parseStartYear('January 2000 – 2003')).toBe(2000);
  });

  it('handles open-ended ranges', () => {
    expect(parseStartYear('2023 – Present')).toBe(2023);
  });
});

describe('sortByTimeframe', () => {
  it('sorts ascending by start year without mutating the input', () => {
    const input = [make('2016 – 2018'), make('1995'), make('January 2000 – 2003')];
    const result = sortByTimeframe(input);
    expect(result.map((p) => p.data.timeframe)).toEqual([
      '1995',
      'January 2000 – 2003',
      '2016 – 2018',
    ]);
    // original untouched
    expect(input.map((p) => p.data.timeframe)).toEqual([
      '2016 – 2018',
      '1995',
      'January 2000 – 2003',
    ]);
  });

  it('keeps input order for equal start years', () => {
    const a = make('2023 – Present');
    const b = make('2023 – Present');
    const result = sortByTimeframe([a, b]);
    expect(result[0]).toBe(a);
    expect(result[1]).toBe(b);
  });
});

describe('padIndex', () => {
  it('zero-pads single digits and leaves two-digit numbers', () => {
    expect(padIndex(8)).toBe('08');
    expect(padIndex(10)).toBe('10');
    expect(padIndex(1)).toBe('01');
  });
});
