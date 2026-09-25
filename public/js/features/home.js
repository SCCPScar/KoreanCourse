/**
 * Início em grade de cartões ("bento"): responde logo a "o que faço hoje?".
 *
 * Só mostra dados reais: palavra do dia, progresso do vocabulário, pontos de
 * gramática do nível e uma curiosidade cultural. Sequência de dias e revisões
 * aparecem quando essas funcionalidades existirem.
 */
import { byId, el } from '../core/dom.js';
import { getLevel, isWithinLevel, onLevelChange } from '../core/level.js';
import { FACTS } from '../data/facts.js';
import { GRAMMAR } from '../data/grammar.js';
import { findLevel } from '../data/levels.js';
import { WORDS } from '../data/vocabulary.js';
import { pickDaily } from '../lib/daily.js';
import { audioButton } from './audio.js';
import { getLearnedIds } from './vocabulary.js';

/** Próximo passo sugerido, conforme o nível. */
function nextStep(level, wordsAtLevel) {
  if (!level || level === 'zero') {
    return {
      title: 'Comece pelo Hangul',
      text: '14 consoantes e 10 vogais básicas. Em poucos dias você lê qualquer palavra.',
      href: '#hangul',
      cta: 'Aprender o Hangul',
    };
  }
  return {
    title: 'Palavras do seu nível',
    text: `${wordsAtLevel} palavras esperando por você no nível ${findLevel(level).name}.`,
    href: '#vocabulario',
    cta: 'Estudar vocabulário',
  };
}

function renderFact(container, parts) {
  const nodes = parts.map((part) =>
    typeof part === 'string' ? part : el('span', { text: part.ko, lang: 'ko' }),
  );
  container.replaceChildren(...nodes);
}

export function initHome() {
  const next = {
    title: byId('home-next-title'),
    text: byId('home-next-text'),
    link: byId('home-next-link'),
  };
  const word = {
    ko: byId('home-word-ko'),
    rom: byId('home-word-rom'),
    pt: byId('home-word-pt'),
    audio: byId('home-word-audio'),
  };
  const progress = {
    count: byId('home-progress-count'),
    meter: byId('home-progress-meter'),
    fill: byId('home-progress-fill'),
  };
  const grammarCount = byId('home-grammar-count');
  const fact = byId('home-fact');

  function render() {
    const level = getLevel();
    const wordsAtLevel = WORDS.filter((item) => isWithinLevel(item.level, level));
    const learned = getLearnedIds();
    const learnedAtLevel = wordsAtLevel.filter((item) => learned.has(item.id)).length;

    const step = nextStep(level, wordsAtLevel.length);
    next.title.textContent = step.title;
    next.text.textContent = step.text;
    next.link.textContent = step.cta;
    next.link.href = step.href;

    const daily = pickDaily(wordsAtLevel);
    word.ko.textContent = daily.ko;
    word.rom.textContent = daily.rom;
    word.pt.textContent = daily.pt;
    word.audio.replaceChildren(audioButton(daily.ko));

    const percent = Math.round((learnedAtLevel / wordsAtLevel.length) * 100);
    progress.count.textContent = `${learnedAtLevel} de ${wordsAtLevel.length}`;
    progress.meter.setAttribute('aria-valuenow', String(percent));
    progress.fill.style.width = `${percent}%`;

    const points = GRAMMAR.filter((point) => isWithinLevel(point.level, level)).length;
    grammarCount.textContent = String(points);

    renderFact(fact, pickDaily(FACTS));
  }

  onLevelChange(render);
  render();
  // O progresso muda em outras seções: redesenha sempre que o Início é aberto.
  return render;
}
