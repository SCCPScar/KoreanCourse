/**
 * Seção Praticar: os cartões que abrem cada atividade (revisão, quiz,
 * leitura rápida e pronúncia), com um resumo em cada um.
 */
import { onCardsChange } from '../core/cards.js';
import { byId } from '../core/dom.js';
import { getRecord } from '../core/game-records.js';
import { isRecognitionSupported, isRecordingSupported } from '../core/microphone.js';
import { onStudyChange } from '../core/study-log.js';
import { reviewSummary } from './flashcards.js';

export function initPractice() {
  const ui = {
    reviews: byId('practice-review-count'),
    reading: byId('practice-reading-best'),
    mic: byId('practice-mic-note'),
  };

  function render() {
    const { dueCount, newCount } = reviewSummary();
    const waiting = dueCount + newCount;
    ui.reviews.textContent =
      waiting === 0
        ? 'Nada à espera agora.'
        : `${waiting} ${waiting === 1 ? 'cartão' : 'cartões'} à sua espera.`;

    const record = getRecord('reading');
    ui.reading.textContent = record ? `Seu recorde: ${record} palavras.` : 'Ainda sem recorde.';

    if (isRecognitionSupported()) {
      ui.mic.textContent = 'Com verificação automática neste navegador.';
    } else if (isRecordingSupported()) {
      ui.mic.textContent = 'Neste navegador: gravar e comparar com o modelo.';
    } else {
      ui.mic.textContent = 'Este navegador não permite usar o microfone.';
    }
  }

  onCardsChange(render);
  onStudyChange(render);
  render();
  // O recorde muda dentro do jogo: redesenha sempre que a seção é aberta.
  return render;
}
