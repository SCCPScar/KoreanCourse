/**
 * O "baralho" de flashcards de cada aluno e a fila de revisão do dia.
 *
 * De onde vêm os cartões (só do que o aluno JÁ viu, nunca matéria nova):
 *  1. as palavras marcadas como aprendidas no Vocabulário;
 *  2. as palavras e sílabas das estações do percurso já concluídas.
 *
 * Se a mesma palavra aparece nos dois lugares, vira um cartão só
 * (o id do Vocabulário tem preferência).
 */
import { isDue } from './srs.js';

/** Cartões novos por dia: evita uma avalanche se o aluno marcar 50 palavras de uma vez. */
export const NEW_PER_DAY = 10;
/** Tamanho de uma sessão de revisão (dá uns 5 minutos). */
export const SESSION_SIZE = 20;

/** Itens (hangul, romanização, português) ensinados numa estação. */
function stationItems(station) {
  return (station.steps ?? []).flatMap((step) => {
    if (step.type === 'learn') return step.items;
    if (step.type === 'read') return [{ ko: step.ko, rom: step.answers[0], pt: step.pt }];
    return [];
  });
}

/**
 * Monta o baralho.
 * @param {object} options
 * @param {Set<string>} options.learnedIds  ids das palavras aprendidas
 * @param {string[]} options.completedStations  ids das estações concluídas
 * @param {object[]} options.words  lista do Vocabulário (data/vocabulary.js)
 * @param {object[]} options.stations  estações do percurso (data/course.js)
 */
export function buildDeck({ learnedIds, completedStations, words, stations }) {
  const cards = new Map();
  const wordByKo = new Map();
  words.forEach((word) => {
    if (!wordByKo.has(word.ko)) wordByKo.set(word.ko, word);
    if (learnedIds.has(word.id)) {
      cards.set(word.id, { id: word.id, ko: word.ko, rom: word.rom, pt: word.pt });
    }
  });

  const done = new Set(completedStations);
  stations
    .filter((station) => done.has(station.id))
    .flatMap(stationItems)
    .forEach((item) => {
      const word = wordByKo.get(item.ko);
      const card = word
        ? { id: word.id, ko: word.ko, rom: word.rom, pt: word.pt }
        : { id: `curso:${item.ko}`, ko: item.ko, rom: item.rom, pt: item.pt };
      if (!cards.has(card.id)) cards.set(card.id, card);
    });

  return [...cards.values()];
}

/** Quantos cartões novos o aluno ainda pode começar hoje. */
export function newAllowance(states, today) {
  const startedToday = Object.values(states).filter((state) => state.added === today).length;
  return Math.max(0, NEW_PER_DAY - startedToday);
}

/**
 * Fila de hoje: primeiro as revisões vencidas (as mais atrasadas antes),
 * depois os cartões novos permitidos. Retorna também as contagens.
 */
export function dueQueue(deck, states, today, limit = SESSION_SIZE) {
  const due = deck
    .filter((card) => isDue(states[card.id], today))
    .sort((a, b) => states[a.id].due.localeCompare(states[b.id].due) || a.id.localeCompare(b.id));
  const fresh = deck.filter((card) => !states[card.id]).slice(0, newAllowance(states, today));
  return {
    cards: [...due, ...fresh].slice(0, limit),
    dueCount: due.length,
    newCount: fresh.length,
  };
}
