/**
 * Síntese de voz em coreano (ko-KR) com a Web Speech API do navegador.
 *
 * A voz depende do sistema operacional: se não houver uma voz coreana instalada,
 * o navegador pode ficar mudo ou ler com sotaque errado. Por isso a app
 * verifica isto e mostra um aviso ao aluno.
 */

const VOICE_WAIT_MS = 1500;

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Procura uma voz coreana numa lista de vozes (ex.: 'ko-KR' ou 'ko_KR'). */
export function findKoreanVoice(voices) {
  return (
    voices.find((voice) => voice.lang.toLowerCase().replace('_', '-').startsWith('ko')) ?? null
  );
}

/** A voz coreana disponível AGORA (pode ser null se as vozes ainda não carregaram). */
function getKoreanVoice() {
  return findKoreanVoice(window.speechSynthesis.getVoices());
}

/**
 * Espera o navegador carregar a lista de vozes (no Chrome é assíncrono),
 * com um limite de tempo para não ficar esperando para sempre.
 */
function waitForVoices() {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (synth.getVoices().length > 0) {
      resolve();
      return;
    }
    synth.addEventListener('voiceschanged', () => resolve(), { once: true });
    setTimeout(resolve, VOICE_WAIT_MS);
  });
}

/** true se o navegador tiver uma voz coreana instalada. */
export async function hasKoreanVoice() {
  if (!isSpeechSupported()) return false;
  await waitForVoices();
  return Boolean(getKoreanVoice());
}

/**
 * Chama `callback` sempre que a lista de vozes mudar.
 * Útil quando as vozes chegam depois do tempo limite de waitForVoices().
 */
export function onVoicesChanged(callback) {
  if (isSpeechSupported()) window.speechSynthesis.addEventListener('voiceschanged', callback);
}

/** Lê o texto em voz alta, em coreano. */
export function speak(text, { rate = 0.85 } = {}) {
  if (!isSpeechSupported() || !text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = rate;
  const voice = getKoreanVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.cancel(); // interrompe o áudio anterior, se houver
  window.speechSynthesis.speak(utterance);
}
