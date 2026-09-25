/**
 * Síntese de voz em coreano (ko-KR) com a Web Speech API do browser.
 *
 * A voz depende do sistema operativo: se não houver uma voz coreana instalada,
 * o browser pode ficar calado ou ler com sotaque errado. Por isso a app
 * verifica isto e mostra um aviso ao aluno.
 */

const VOICE_WAIT_MS = 1500;
let koreanVoicePromise;

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Procura uma voz coreana numa lista de vozes (ex.: 'ko-KR' ou 'ko_KR'). */
export function findKoreanVoice(voices) {
  return (
    voices.find((voice) => voice.lang.toLowerCase().replace('_', '-').startsWith('ko')) ?? null
  );
}

/**
 * As vozes carregam de forma assíncrona em alguns browsers (Chrome):
 * espera pelo evento 'voiceschanged', com um limite de tempo.
 */
function loadKoreanVoice() {
  koreanVoicePromise ??= new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const tryResolve = () => {
      const voices = synth.getVoices();
      if (voices.length === 0) return false;
      resolve(findKoreanVoice(voices));
      return true;
    };
    if (tryResolve()) return;
    synth.addEventListener('voiceschanged', tryResolve, { once: true });
    setTimeout(() => resolve(findKoreanVoice(synth.getVoices())), VOICE_WAIT_MS);
  });
  return koreanVoicePromise;
}

/** true se o browser tiver uma voz coreana instalada. */
export async function hasKoreanVoice() {
  if (!isSpeechSupported()) return false;
  return Boolean(await loadKoreanVoice());
}

/** Lê o texto em voz alta, em coreano. */
export async function speak(text, { rate = 0.85 } = {}) {
  if (!isSpeechSupported() || !text) return;
  const voice = await loadKoreanVoice();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = rate;
  if (voice) utterance.voice = voice;
  window.speechSynthesis.cancel(); // interrompe o áudio anterior, se houver
  window.speechSynthesis.speak(utterance);
}
