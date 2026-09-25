/**
 * Construtor de sílabas: o aluno escolhe consoante + vogal (+ batchim)
 * e vê o bloco formado, a romanização e a fórmula Unicode usada.
 */
import { byId, el } from '../core/dom.js';
import {
  FINALS,
  FINAL_COUNT,
  INITIALS,
  MEDIALS,
  MEDIAL_COUNT,
  composeSyllable,
  romanizeSyllable,
  syllableCodePoint,
} from '../lib/hangul-unicode.js';

const hex = (value) => value.toString(16).toUpperCase();

/** Texto da fórmula, ex.: "0xAC00 + (0 × 21 + 0) × 28 + 4 = 0xAC04". */
export function formulaText(initial, medial, final) {
  const code = syllableCodePoint(initial, medial, final);
  return `0xAC00 + (${initial} × ${MEDIAL_COUNT} + ${medial}) × ${FINAL_COUNT} + ${final} = 0x${hex(code)}`;
}

function fillSelect(select, letters, emptyLabel) {
  const options = letters.map((letter, index) =>
    el('option', { text: letter || emptyLabel, attrs: { value: String(index) } }),
  );
  select.replaceChildren(...options);
}

export function initHangulTrainer() {
  const form = byId('syllable-builder');
  const selects = {
    initial: byId('builder-initial'),
    medial: byId('builder-medial'),
    final: byId('builder-final'),
  };
  const result = byId('builder-result');
  const roman = byId('builder-roman');
  const formula = byId('builder-formula');
  const audio = byId('builder-audio');

  fillSelect(selects.initial, INITIALS);
  fillSelect(selects.medial, MEDIALS);
  fillSelect(selects.final, FINALS, '(sem batchim)');

  function update() {
    const initial = Number(selects.initial.value);
    const medial = Number(selects.medial.value);
    const final = Number(selects.final.value);
    const syllable = composeSyllable(initial, medial, final);

    result.textContent = syllable;
    roman.textContent = romanizeSyllable(initial, medial, final);
    formula.textContent = formulaText(initial, medial, final);
    audio.dataset.speak = syllable;
    audio.setAttribute('aria-label', `Ouvir ${syllable}`);
  }

  form.addEventListener('change', update);
  form.addEventListener('submit', (event) => event.preventDefault());
  update();
}
