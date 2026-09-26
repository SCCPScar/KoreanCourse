/**
 * Compara o que o reconhecimento de voz ouviu com a frase esperada.
 *
 * Usamos a "distância de edição" (Levenshtein): quantas sílabas é preciso
 * trocar, apagar ou acrescentar para uma frase virar a outra. Comparamos
 * sílaba a sílaba de Hangul, ignorando espaços e pontuação.
 *
 * Lógica pura, sem microfone nem DOM.
 */

/** Só as sílabas de Hangul (sem espaços, pontuação nem letras latinas). */
export const hangulOnly = (text) => [...String(text ?? '')].filter((char) => /[가-힣]/.test(char));

/** Distância de edição entre duas listas (ou strings). */
export function editDistance(a, b) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j];
      previous[j] = Math.min(
        previous[j] + 1, // apagar
        previous[j - 1] + 1, // acrescentar
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1), // trocar
      );
      diagonal = above;
    }
  }
  return previous[b.length];
}

/** Semelhança de 0 a 1 entre a frase esperada e a ouvida. */
export function similarity(target, heard) {
  const expected = hangulOnly(target);
  const got = hangulOnly(heard);
  if (expected.length === 0) return 0;
  const distance = editDistance(expected, got);
  return Math.max(0, 1 - distance / Math.max(expected.length, got.length));
}

/** A melhor semelhança entre as alternativas que o reconhecimento devolveu. */
export const bestSimilarity = (target, alternatives) =>
  Math.max(0, ...alternatives.map((heard) => similarity(target, heard)));

/** Resultado para mostrar ao aluno: 'great' (≥ 85%), 'close' (≥ 50%) ou 'retry'. */
export function verdict(score) {
  if (score >= 0.85) return 'great';
  if (score >= 0.5) return 'close';
  return 'retry';
}
