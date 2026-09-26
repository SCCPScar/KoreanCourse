/**
 * Microfone: reconhecimento de voz e gravação curta.
 *
 * Duas ferramentas diferentes do navegador:
 *  1. SpeechRecognition (Chrome, Edge, Safari): transforma a fala em texto.
 *     ATENÇÃO (privacidade): o navegador envia o áudio para o serviço de voz
 *     da empresa dele (Google, Apple…) para fazer a transcrição.
 *  2. MediaRecorder: grava um trecho curto que fica SÓ no aparelho, para o
 *     aluno se ouvir e comparar com o modelo. Nada é enviado.
 *
 * Nenhuma das duas é chamada sem o consentimento do aluno (hasMicConsent, abaixo).
 */
import { readJSON, removeKey, writeJSON } from './storage.js';

const CONSENT_KEY = 'mic-consent';

const Recognition = () => window.SpeechRecognition ?? window.webkitSpeechRecognition;

export const isRecognitionSupported = () => typeof Recognition() === 'function';

export const isRecordingSupported = () =>
  Boolean(navigator.mediaDevices?.getUserMedia) && typeof window.MediaRecorder === 'function';

/* ───────── Consentimento (RGPD: explícito, informado e revogável) ───────── */

export const hasMicConsent = () => Boolean(readJSON(CONSENT_KEY, null));

export const grantMicConsent = () => writeJSON(CONSENT_KEY, { givenAt: new Date().toISOString() });

export const revokeMicConsent = () => removeKey(CONSENT_KEY);

/* ───────── Reconhecimento de voz ───────── */

/**
 * Ouve UMA frase em coreano.
 * Resolve com a lista de transcrições possíveis (a mais provável primeiro).
 * Rejeita com um código: 'not-allowed', 'no-speech', 'network', 'audio-capture'…
 */
export function recognizeKorean() {
  return new Promise((resolve, reject) => {
    const recognition = new (Recognition())();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    let heard = null;
    recognition.addEventListener('result', (event) => {
      heard = [...event.results[0]].map((alternative) => alternative.transcript);
    });
    recognition.addEventListener('error', (event) => reject(event.error ?? 'unknown'));
    recognition.addEventListener('end', () => (heard ? resolve(heard) : reject('no-speech')));
    recognition.start();
  });
}

/* ───────── Gravação local ───────── */

/** Grava até `ms` milissegundos e resolve com o áudio (Blob). */
export async function recordClip(ms = 4000) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks = [];
  recorder.addEventListener('dataavailable', (event) => chunks.push(event.data));
  const stopped = new Promise((resolve) => recorder.addEventListener('stop', resolve));
  recorder.start();
  setTimeout(() => recorder.state !== 'inactive' && recorder.stop(), ms);
  await stopped;
  // Desliga o microfone logo depois (o indicador de gravação do navegador apaga).
  stream.getTracks().forEach((track) => track.stop());
  return new Blob(chunks, { type: recorder.mimeType });
}
