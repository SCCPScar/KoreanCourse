/**
 * Botões de áudio: qualquer elemento com data-action="speak" e data-speak="텍스트"
 * lê esse texto em coreano. Mostra um aviso se não houver voz coreana.
 */
import { registerAction } from '../core/actions.js';
import { el } from '../core/dom.js';
import { readJSON, writeJSON } from '../core/storage.js';
import { hasKoreanVoice, isSpeechSupported, onVoicesChanged, speak } from '../core/speech.js';

/** Cria um botão de áudio (só com ícone, por isso tem aria-label). */
export function audioButton(text) {
  return el('button', {
    className: 'btn btn--icon btn--small',
    text: '🔊',
    attrs: { type: 'button', 'aria-label': `Ouvir ${text}`, title: 'Ouvir' },
    data: { action: 'speak', speak: text },
  });
}

const DISMISSED_KEY = 'voice-warning-dismissed';

export function initAudio(warning, warningText) {
  registerAction('speak', (button) => speak(button.dataset.speak));
  registerAction('dismiss-voice-warning', () => {
    writeJSON(DISMISSED_KEY, true);
    warning.hidden = true;
  });
  if (readJSON(DISMISSED_KEY, false)) return;

  if (!isSpeechSupported()) {
    warningText.textContent =
      'Seu navegador não tem síntese de voz, por isso o áudio não vai funcionar.';
    warning.hidden = false;
    return;
  }

  const update = () => {
    hasKoreanVoice().then((available) => {
      warning.hidden = available;
    });
  };
  update();
  // Se as vozes chegarem mais tarde, o aviso desaparece sozinho.
  onVoicesChanged(update);
}
