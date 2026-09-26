/**
 * Janela compartilhada pelos jogos da seção Praticar (quiz, leitura e pronúncia).
 *
 * Cada jogo chama openPractice() e desenha o conteúdo em `stage` (meio) e
 * `footer` (botões). Ao fechar, a janela chama o `onClose` do jogo, para ele
 * parar cronômetros ou o microfone.
 */
import { registerAction } from '../core/actions.js';
import { byId, el } from '../core/dom.js';

let ui;
let closeHandler = null;

/** Título da tela atual (recebe o foco, para o leitor de tela anunciar). */
export function practiceHeading(text, lang) {
  return el('h2', {
    className: 'lesson__heading',
    text,
    lang,
    attrs: { id: 'practice-heading', tabindex: '-1' },
  });
}

export const focusPracticeHeading = () => byId('practice-heading')?.focus();

/** Barra de progresso do topo (0 a 1). */
export function setPracticeProgress(fraction) {
  const percent = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  ui.meterFill.style.width = `${percent}%`;
  ui.meter.setAttribute('aria-valuenow', String(percent));
}

/**
 * Abre a janela e devolve as áreas onde o jogo desenha.
 * `game` identifica o jogo aberto (útil para os atalhos de teclado de cada um).
 */
export function openPractice({ game, label, onClose = null }) {
  closeHandler?.();
  closeHandler = onClose;
  ui.dialog.dataset.game = game;
  ui.meter.setAttribute('aria-label', label);
  ui.dialog.setAttribute('aria-label', label);
  setPracticeProgress(0);
  ui.stage.replaceChildren();
  ui.footer.replaceChildren();
  if (!ui.dialog.open) ui.dialog.showModal();
  return { stage: ui.stage, footer: ui.footer, dialog: ui.dialog };
}

export function closePractice() {
  ui.dialog.close();
}

export function initPracticeDialog() {
  ui = {
    dialog: byId('practice-dialog'),
    stage: byId('practice-stage'),
    footer: byId('practice-footer'),
    meter: byId('practice-meter'),
    meterFill: byId('practice-meter-fill'),
  };
  registerAction('practice-close', closePractice);
  // O evento "close" acontece em qualquer forma de fechar (✕, Esc ou código).
  ui.dialog.addEventListener('close', () => {
    const handler = closeHandler;
    closeHandler = null;
    handler?.();
  });
}
