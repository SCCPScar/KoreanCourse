/**
 * Pronúncia: o aluno lê uma frase em voz alta e recebe um retorno.
 *
 * - "Falar": o reconhecimento de voz do navegador transcreve a fala e
 *   comparamos com a frase esperada (lib/pronunciation.js).
 * - "Gravar e ouvir": grava 4 segundos que ficam só no aparelho, para o
 *   aluno comparar com o áudio modelo. Funciona também no Firefox.
 *
 * RGPD: antes do primeiro uso, uma tela explica o que acontece com o áudio
 * e pede o consentimento. Ele pode ser retirado na mesma tela.
 */
import { registerAction } from '../core/actions.js';
import { el } from '../core/dom.js';
import {
  grantMicConsent,
  hasMicConsent,
  isRecognitionSupported,
  isRecordingSupported,
  recognizeKorean,
  recordClip,
  revokeMicConsent,
} from '../core/microphone.js';
import { MINUTES_PER_CARD, recordStudy } from '../core/study-log.js';
import { shuffle } from '../lib/lesson.js';
import { bestSimilarity, verdict } from '../lib/pronunciation.js';
import { audioButton } from './audio.js';
import { reviewSummary } from './flashcards.js';
import {
  closePractice,
  focusPracticeHeading,
  openPractice,
  practiceHeading,
} from './practice-dialog.js';
import { practicePool } from './practice-pool.js';

const GAME = 'pronunciation';
const RECORD_MS = 4000;

const VERDICT_TEXT = {
  great: '정확해요! Perfeito: o coreano entendeu você.',
  close: 'Quase! Ouça o modelo e tente de novo.',
  retry: 'Não deu para entender. Ouça o modelo, fale devagar e tente de novo.',
};

const ERROR_TEXT = {
  'not-allowed':
    'O navegador bloqueou o microfone. Libere o acesso nas configurações do site (o ícone ao lado do endereço).',
  'service-not-allowed': 'O reconhecimento de voz está desativado neste navegador.',
  'no-speech': 'Não ouvi nada. Aperte "Falar" e diga a frase logo em seguida.',
  'audio-capture': 'Não encontrei um microfone neste aparelho.',
  network: 'O reconhecimento de voz precisa de internet.',
};

let ui;
let state;

const button = (text, onClick, className = 'btn') => {
  const node = el('button', { className, text, attrs: { type: 'button' } });
  node.addEventListener('click', onClick);
  return node;
};

/** Frases: os cartões do aluno (o que ele já estudou) ou, no começo, o vocabulário do nível. */
function phrasePool() {
  const { deck } = reviewSummary();
  return shuffle(deck.length >= 5 ? deck : practicePool());
}

function releaseClip() {
  state?.clip?.pause();
  if (state?.clipUrl) URL.revokeObjectURL(state.clipUrl);
  if (state) {
    state.clip = null;
    state.clipUrl = null;
  }
}

function showResult(children, tone = 'info') {
  const result = ui.stage.querySelector('.pron__result');
  result.dataset.tone = tone;
  result.replaceChildren(...children);
}

/* ───────── Telas ───────── */

function renderUnsupported() {
  ui.stage.replaceChildren(
    practiceHeading('Microfone indisponível'),
    el('p', {
      className: 'lesson__text',
      text: 'Este navegador não permite usar o microfone aqui. Tente no Chrome, Edge, Safari ou Firefox atualizados.',
    }),
  );
  ui.footer.replaceChildren(button('Fechar', closePractice, 'btn btn--primary lesson__primary'));
  focusPracticeHeading();
}

function renderConsent() {
  const items = [
    'O microfone só liga quando você aperta "Falar" ou "Gravar" e desliga sozinho em seguida.',
  ];
  if (isRecognitionSupported()) {
    items.push(
      '"Falar" (verificação automática): para transformar a sua voz em texto, o seu navegador envia o áudio ao serviço de voz da empresa dele (por exemplo, a Google no Chrome ou a Apple no Safari). O Haru não recebe nem guarda esse áudio.',
    );
  }
  if (isRecordingSupported()) {
    items.push(
      '"Gravar e ouvir": a gravação fica só no seu aparelho e some quando você fecha a janela.',
    );
  }
  items.push('Você pode retirar esta permissão quando quiser, nesta mesma janela.');

  ui.stage.replaceChildren(
    practiceHeading('Antes de usar o microfone'),
    el(
      'ul',
      { className: 'pron__consent' },
      items.map((text) => el('li', { text })),
    ),
    el('p', { className: 'lesson__text' }, [
      'Mais detalhes na ',
      el('a', { text: 'política de privacidade', attrs: { href: 'privacidade.html' } }),
      '.',
    ]),
  );
  ui.footer.replaceChildren(
    el('div', { className: 'lesson__exit-actions' }, [
      button('Agora não', closePractice),
      button(
        'Concordo, continuar',
        () => {
          grantMicConsent();
          renderPhrase();
        },
        'btn btn--primary',
      ),
    ]),
  );
  focusPracticeHeading();
}

function renderPhrase() {
  releaseClip();
  if (state.queue.length === 0) state.queue = phrasePool();
  const phrase = state.queue.pop();
  state.phrase = phrase;
  state.count += 1;

  ui.stage.replaceChildren(
    el('p', { className: 'lesson__eyebrow', text: `Frase ${state.count}` }),
    practiceHeading('Leia em voz alta'),
    el('div', { className: 'lesson__ko-row' }, [
      el('span', { className: 'lesson__ko', text: phrase.ko, lang: 'ko' }),
      audioButton(phrase.ko),
    ]),
    el('p', { className: 'pron__meaning' }, [
      el('span', { className: 'lesson__rom', text: phrase.rom }),
      ` · ${phrase.pt}`,
    ]),
    el('div', { className: 'pron__result', attrs: { role: 'status' } }),
  );

  const actions = [];
  if (isRecognitionSupported()) {
    actions.push(button('🎙️ Falar', onSpeak, 'btn btn--primary pron__speak'));
  }
  if (isRecordingSupported()) {
    actions.push(button('⏺ Gravar e ouvir', onRecord, 'btn pron__record'));
  }
  actions.push(button('Próxima frase', renderPhrase));
  ui.footer.replaceChildren(
    el('div', { className: 'pron__actions' }, actions),
    button(
      'Retirar a permissão do microfone',
      () => {
        revokeMicConsent();
        closePractice();
      },
      'link-button pron__revoke',
    ),
  );
  focusPracticeHeading();
}

/* ───────── Ações ───────── */

async function onSpeak(event) {
  const speakButton = event.currentTarget;
  speakButton.disabled = true;
  speakButton.textContent = 'Ouvindo… fale agora';
  showResult([el('p', { text: 'Pode falar.' })]);
  try {
    const heard = await recognizeKorean();
    const score = bestSimilarity(state.phrase.ko, heard);
    const result = verdict(score);
    recordStudy({ minutes: MINUTES_PER_CARD });
    showResult(
      [
        el('strong', { text: VERDICT_TEXT[result] }),
        el('p', {}, [
          'Ouvi: ',
          el('span', { text: heard[0] || '(nada)', lang: 'ko' }),
          ` · ${Math.round(score * 100)}% igual`,
        ]),
      ],
      result === 'great' ? 'right' : result === 'close' ? 'info' : 'wrong',
    );
  } catch (code) {
    showResult(
      [
        el('p', {
          text: ERROR_TEXT[code] ?? 'Não foi possível usar o reconhecimento de voz agora.',
        }),
      ],
      'wrong',
    );
  } finally {
    if (speakButton.isConnected) {
      speakButton.disabled = false;
      speakButton.textContent = '🎙️ Falar';
    }
  }
}

async function onRecord(event) {
  const recordButton = event.currentTarget;
  recordButton.disabled = true;
  recordButton.textContent = `Gravando… (${RECORD_MS / 1000} s)`;
  releaseClip();
  try {
    const blob = await recordClip(RECORD_MS);
    recordStudy({ minutes: MINUTES_PER_CARD });
    state.clipUrl = URL.createObjectURL(blob);
    state.clip = new Audio(state.clipUrl);
    state.clip.play();
    showResult([
      el('p', { text: 'Esta é a sua gravação. Compare com o modelo:' }),
      el('div', { className: 'pron__actions' }, [
        button('▶ Ouvir a minha voz', () => state.clip?.play()),
        audioButton(state.phrase.ko),
      ]),
    ]);
  } catch (error) {
    const blocked = error?.name === 'NotAllowedError';
    showResult(
      [el('p', { text: blocked ? ERROR_TEXT['not-allowed'] : ERROR_TEXT['audio-capture'] })],
      'wrong',
    );
  } finally {
    if (recordButton.isConnected) {
      recordButton.disabled = false;
      recordButton.textContent = '⏺ Gravar e ouvir';
    }
  }
}

/* ───────── Abrir ───────── */

export function openPronunciation() {
  ui = openPractice({ game: GAME, label: 'Pronúncia', onClose: releaseClip });
  state = { queue: [], count: 0, phrase: null, clip: null, clipUrl: null };
  if (!isRecognitionSupported() && !isRecordingSupported()) renderUnsupported();
  else if (!hasMicConsent()) renderConsent();
  else renderPhrase();
}

export function initPronunciation() {
  registerAction('open-pronunciation', openPronunciation);
}
