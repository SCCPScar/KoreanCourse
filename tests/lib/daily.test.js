import { describe, expect, it } from 'vitest';
import { dayNumber, pickDaily } from '../../public/js/lib/daily.js';

const list = ['a', 'b', 'c'];

describe('pickDaily', () => {
  it('devolve o mesmo item durante todo o dia', () => {
    const morning = new Date(2026, 8, 25, 0, 5);
    const night = new Date(2026, 8, 25, 23, 55);
    expect(pickDaily(list, morning)).toBe(pickDaily(list, night));
  });

  it('passa ao item seguinte no dia seguinte', () => {
    const today = new Date(2026, 8, 25, 12);
    const tomorrow = new Date(2026, 8, 26, 12);
    const index = list.indexOf(pickDaily(list, today));
    expect(pickDaily(list, tomorrow)).toBe(list[(index + 1) % list.length]);
  });

  it('funciona na mudança de mês e de ano', () => {
    expect(dayNumber(new Date(2027, 0, 1)) - dayNumber(new Date(2026, 11, 31))).toBe(1);
  });

  it('devolve null com a lista vazia', () => {
    expect(pickDaily([])).toBeNull();
  });
});
