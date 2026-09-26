import { describe, expect, it } from 'vitest';
import { NEW_PER_DAY, buildDeck, dueQueue, newAllowance } from '../../public/js/lib/deck.js';

const TODAY = '2026-09-26';

const WORDS = [
  { id: 'comida:우유', ko: '우유', rom: 'uyu', pt: 'leite' },
  { id: 'pessoas:아이', ko: '아이', rom: 'ai', pt: 'criança' },
  { id: 'pessoas:친구', ko: '친구', rom: 'chingu', pt: 'amigo' },
];

const STATIONS = [
  {
    id: 's1',
    steps: [
      { type: 'learn', items: [{ ko: '아', rom: 'a', pt: 'vogal a' }] },
      { type: 'read', ko: '우유', answers: ['uyu'], pt: 'leite' },
      { type: 'choice', ko: '오' },
    ],
  },
  { id: 's2', steps: [{ type: 'learn', items: [{ ko: '가', rom: 'ga', pt: 'ga' }] }] },
];

const deckOf = (learned, completed) =>
  buildDeck({
    learnedIds: new Set(learned),
    completedStations: completed,
    words: WORDS,
    stations: STATIONS,
  });

describe('buildDeck', () => {
  it('sem nada estudado, o baralho está vazio', () => {
    expect(deckOf([], [])).toEqual([]);
  });

  it('usa as palavras aprendidas', () => {
    expect(deckOf(['pessoas:친구'], []).map((card) => card.id)).toEqual(['pessoas:친구']);
  });

  it('usa só as estações CONCLUÍDAS (learn e read; choice não)', () => {
    expect(deckOf([], ['s1']).map((card) => card.id)).toEqual(['curso:아', 'comida:우유']);
  });

  it('a mesma palavra nos dois lugares vira um cartão só, com o id do Vocabulário', () => {
    const deck = deckOf(['comida:우유'], ['s1']);
    expect(deck.filter((card) => card.ko === '우유')).toHaveLength(1);
    expect(deck.find((card) => card.ko === '우유').id).toBe('comida:우유');
  });
});

describe('dueQueue e newAllowance', () => {
  const deck = Array.from({ length: 15 }, (_, i) => ({ id: `c${String(i).padStart(2, '0')}` }));

  it('limita os cartões novos por dia', () => {
    const queue = dueQueue(deck, {}, TODAY);
    expect(queue.newCount).toBe(NEW_PER_DAY);
    expect(queue.cards).toHaveLength(NEW_PER_DAY);
  });

  it('desconta os cartões novos já começados hoje', () => {
    const states = {
      c00: { due: '2026-09-27', added: TODAY },
      c01: { due: '2026-09-27', added: TODAY },
    };
    expect(newAllowance(states, TODAY)).toBe(NEW_PER_DAY - 2);
    expect(newAllowance(states, '2026-09-27')).toBe(NEW_PER_DAY);
  });

  it('põe as revisões vencidas primeiro, as mais atrasadas antes', () => {
    const states = {
      c05: { due: '2026-09-25', added: '2026-09-01' },
      c03: { due: '2026-09-20', added: '2026-09-01' },
      c04: { due: '2026-10-01', added: '2026-09-01' },
    };
    const queue = dueQueue(deck, states, TODAY);
    expect(queue.dueCount).toBe(2);
    expect(queue.cards.slice(0, 2).map((card) => card.id)).toEqual(['c03', 'c05']);
    expect(queue.cards.map((card) => card.id)).not.toContain('c04');
  });

  it('respeita o tamanho da sessão', () => {
    expect(dueQueue(deck, {}, TODAY, 4).cards).toHaveLength(4);
  });
});
