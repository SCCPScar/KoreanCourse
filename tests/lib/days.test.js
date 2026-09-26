import { describe, expect, it } from 'vitest';
import { addDays, dayKey, daysBetween, weekdayOf } from '../../public/js/lib/days.js';

describe('days', () => {
  it('gera a chave do dia com a data LOCAL', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('soma e subtrai dias, atravessando meses e anos', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
  });

  it('não perde dias na mudança de horário de verão', () => {
    expect(addDays('2026-03-28', 1)).toBe('2026-03-29');
    expect(addDays('2026-10-24', 2)).toBe('2026-10-26');
    expect(daysBetween('2026-03-28', '2026-03-30')).toBe(2);
  });

  it('conta a diferença de dias com sinal', () => {
    expect(daysBetween('2026-09-20', '2026-09-26')).toBe(6);
    expect(daysBetween('2026-09-26', '2026-09-20')).toBe(-6);
  });

  it('sabe o dia da semana (0 = domingo)', () => {
    expect(weekdayOf('2026-09-27')).toBe(0);
    expect(weekdayOf('2026-09-26')).toBe(6);
  });
});
