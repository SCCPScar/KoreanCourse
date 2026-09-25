/**
 * Onboarding: na primeira visita, pede ao aluno que escolha o nível.
 * A escolha fica guardada no localStorage e pode ser alterada no Início.
 */
import { registerAction } from '../core/actions.js';
import { byId, el } from '../core/dom.js';
import { readJSON, writeJSON } from '../core/storage.js';
import { LEVELS, findLevel } from '../data/levels.js';

const STORAGE_KEY = 'level';

/** Nível atual do aluno (id), ou null se ainda não escolheu. */
export function getLevel() {
  const id = readJSON(STORAGE_KEY);
  return findLevel(id) ? id : null;
}

function renderChoices(container) {
  const choices = LEVELS.map((level) => {
    const input = el('input', {
      attrs: { type: 'radio', name: 'level', value: level.id, required: '' },
    });
    const texts = el('span', {}, [
      el('span', { className: 'choice__title', text: level.name }),
      el('span', { className: 'choice__hint', text: level.hint }),
    ]);
    return el('label', { className: 'choice' }, [input, texts]);
  });
  container.append(...choices);
}

function updateLevelLabel(label) {
  label.textContent = findLevel(getLevel())?.name ?? 'Não escolhido';
}

export function initOnboarding() {
  const dialog = byId('onboarding-dialog');
  const form = byId('onboarding-form');
  const label = byId('level-label');

  renderChoices(byId('onboarding-choices'));
  updateLevelLabel(label);

  function open() {
    const current = form.querySelector(`input[value="${getLevel()}"]`);
    if (current) current.checked = true;
    dialog.showModal();
  }

  // O form usa method="dialog": ao submeter, o <dialog> fecha sozinho.
  form.addEventListener('submit', () => {
    const level = new FormData(form).get('level');
    if (findLevel(level)) writeJSON(STORAGE_KEY, level);
    updateLevelLabel(label);
  });

  // Na primeira visita, o diálogo não pode ser fechado sem escolher (tecla Esc).
  dialog.addEventListener('cancel', (event) => {
    if (!getLevel()) event.preventDefault();
  });

  registerAction('open-onboarding', open);

  if (!getLevel()) open();
}
