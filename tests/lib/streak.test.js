import { describe, expect, it } from 'vitest';
import { addDays } from '../../public/js/lib/days.js';
import { computeStreak, lastSevenDays } from '../../public/js/lib/streak.js';

const TODAY = '2026-09-26';
/** Dias estudados a partir de "quantos dias atrás" (0 = hoje). */
const ago = (...offsets) => offsets.map((n) => addDays(TODAY, -n));

describe('computeStreak', () => {
  it('sem estudo nenhum, o streak é zero', () => {
    expect(computeStreak([], TODAY)).toEqual({
      count: 0,
      studiedToday: false,
      restDays: [],
      restAvailable: true,
    });
  });

  it('conta os dias seguidos até hoje', () => {
    const streak = computeStreak(ago(0, 1, 2), TODAY);
    expect(streak.count).toBe(3);
    expect(streak.studiedToday).toBe(true);
  });

  it('hoje ainda sem estudo não quebra o streak (o dia não acabou)', () => {
    const streak = computeStreak(ago(1, 2), TODAY);
    expect(streak.count).toBe(2);
    expect(streak.studiedToday).toBe(false);
  });

  it('um dia sem estudo vira dia de descanso', () => {
    const streak = computeStreak(ago(0, 2, 3), TODAY);
    expect(streak.count).toBe(3);
    expect(streak.restDays).toEqual(ago(1));
    expect(streak.restAvailable).toBe(false);
  });

  it('ontem de descanso e hoje ainda sem estudo: o streak continua vivo', () => {
    expect(computeStreak(ago(2, 3), TODAY).count).toBe(2);
  });

  it('dois dias seguidos sem estudo encerram o streak', () => {
    expect(computeStreak(ago(0, 3, 4), TODAY).count).toBe(1);
    expect(computeStreak(ago(3, 4), TODAY).count).toBe(0);
  });

  it('só um descanso a cada 7 dias', () => {
    // Descanso há 1 dia e outro há 4 dias (menos de 7 dias entre eles): o segundo não vale.
    expect(computeStreak(ago(0, 2, 3, 5, 6), TODAY).count).toBe(3);
    // Descansos há 1 e há 8 dias: os dois valem.
    const streak = computeStreak(ago(0, 2, 3, 4, 5, 6, 7, 9, 10), TODAY);
    expect(streak.count).toBe(9);
    expect(streak.restDays).toEqual(ago(1, 8));
  });

  it('o descanso volta a ficar disponível depois de 7 dias', () => {
    const streak = computeStreak(ago(0, 1, 2, 3, 4, 5, 6, 8), TODAY);
    expect(streak.restDays).toEqual(ago(7));
    expect(streak.restAvailable).toBe(true);
  });
});

describe('lastSevenDays', () => {
  it('mostra os últimos 7 dias, com hoje por último', () => {
    const days = lastSevenDays(ago(0, 2), TODAY, ago(1));
    expect(days).toHaveLength(7);
    expect(days[6]).toMatchObject({ day: TODAY, state: 'studied', short: 'S', name: 'sábado' });
    expect(days[5].state).toBe('rest');
    expect(days[4].state).toBe('studied');
    expect(days[0].state).toBe('missed');
  });

  it('marca hoje como "today" enquanto não houver estudo', () => {
    expect(lastSevenDays([], TODAY)[6].state).toBe('today');
  });
});
