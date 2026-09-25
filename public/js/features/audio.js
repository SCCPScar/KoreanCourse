/**
 * Botões de áudio: qualquer elemento com data-action="speak" e data-speak="텍스트"
 * lê esse texto em coreano. Mostra um aviso se não houver voz coreana.
 */
import { registerAction } from '../core/actions.js';
import { el } from '../core/dom.js';
import { hasKoreanVoice, isSpeechSupported, speak } from '../core/speech.js';

/** Cria um botão de áudio (só com ícone, por isso tem aria-label). */
export function audioButton(text) {
  return el('button', {
    className: 'btn btn--icon btn--small',
    text: '🔊',
    attrs: { type: 'button', 'aria-label': `Ouvir ${text}`, title: 'Ouvir' },
    data: { action: 'speak', speak: text },
  });
}

export function initAudio(warning, warningText) {
  registerAction('speak', (button) => speak(button.dataset.speak));

  if (!isSpeechSupported()) {
    warningText.textContent =
      'O teu browser não suporta síntese de voz, por isso o áudio não vai funcionar.';
    warning.hidden = false;
    return;
  }

  hasKoreanVoice().then((available) => {
    warning.hidden = available;
  });
}
