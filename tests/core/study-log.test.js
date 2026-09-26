import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getStudyDays,
  recordStudy,
  replaceStudyDays,
  studiedDayKeys,
} from '../../public/js/core/study-log.js';
import { createFakeStorage } from '../helpers/fakeStorage.js';

describe('study-log', () => {
  let dispatched;

  beforeEach(() => {
    dispatched = [];
    vi.stubGlobal('localStorage', createFakeStorage());
    vi.stubGlobal('document', { dispatchEvent: (event) => dispatched.push(event.detail) });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('soma a atividade no dia local e avisa quem estiver ouvindo', () => {
    const now = new Date(2026, 8, 26, 21, 0);
    recordStudy({ minutes: 6, lessons: 1 }, now);
    recordStudy({ minutes: 0.25, cards: 1 }, now);
    expect(getStudyDays()).toEqual({ '2026-09-26': { minutes: 6.25, cards: 1, lessons: 1 } });
    expect(dispatched).toEqual(['2026-09-26', '2026-09-26']);
  });

  it('só dias com minutos contam para o streak', () => {
    replaceStudyDays({
      '2026-09-25': { minutes: 0, cards: 0, lessons: 0 },
      '2026-09-26': { minutes: 1, cards: 4, lessons: 0 },
    });
    expect(studiedDayKeys()).toEqual(['2026-09-26']);
    expect(dispatched).toEqual([null]);
  });
});
