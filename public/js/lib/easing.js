/**
 * Curvas de animação ("easing") sem bibliotecas.
 *
 * A Web Animations API do navegador aceita a função CSS `linear(...)`, que
 * desenha QUALQUER curva a partir de uma lista de pontos. Aqui calculamos a
 * curva elástica (a mesma ideia do elastic.out do GSAP) e a transformamos
 * nessa lista de pontos.
 */

/**
 * Curva elástica de SAÍDA: passa do fim, volta e "treme" até parar em 1.
 * @param {number} t - tempo de 0 a 1
 * @param {number} amplitude - força do exagero (≥ 1)
 * @param {number} period - tamanho de cada oscilação (menor = treme mais)
 */
export function elasticOut(t, amplitude = 1, period = 0.3) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const a = Math.max(1, amplitude);
  const shift = (period / (2 * Math.PI)) * Math.asin(1 / a);
  return a * 2 ** (-10 * t) * Math.sin(((t - shift) * 2 * Math.PI) / period) + 1;
}

/** Curva elástica de ENTRADA: o espelho da de saída (treme no começo). */
export const elasticIn = (t, amplitude, period) => 1 - elasticOut(1 - t, amplitude, period);

/** Converte uma curva (função de 0..1) em texto `linear(...)` com `samples` pontos. */
export function toLinearEasing(curve, samples = 40) {
  const points = Array.from({ length: samples + 1 }, (_, i) => {
    const value = curve(i / samples);
    return Number(value.toFixed(4));
  });
  return `linear(${points.join(', ')})`;
}

/** Curvas usadas no site. Se o navegador não conhece linear(), usa uma alternativa simples. */
export function buildEasings(supportsLinear) {
  if (!supportsLinear) {
    return {
      elasticOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      elasticIn: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
      softElastic: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
    };
  }
  return {
    elasticOut: toLinearEasing((t) => elasticOut(t, 1, 0.72)),
    elasticIn: toLinearEasing((t) => elasticIn(t, 1, 0.72)),
    softElastic: toLinearEasing((t) => elasticOut(t, 1, 0.9)),
  };
}
