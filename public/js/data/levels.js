/**
 * Níveis do aluno, escolhidos no onboarding.
 * A equivalência TOPIK é aproximada e serve só de orientação.
 */
export const LEVELS = [
  {
    id: 'zero',
    name: 'Zero',
    hint: 'Nunca estudei coreano. Quero começar pelo alfabeto (Hangul).',
  },
  {
    id: 'basico',
    name: 'Básico',
    hint: 'Já leio Hangul e sei frases simples (≈ TOPIK 1–2).',
  },
  {
    id: 'intermedio',
    name: 'Intermédio',
    hint: 'Consigo conversar sobre o dia a dia (≈ TOPIK 3).',
  },
  {
    id: 'avancado',
    name: 'Avançado',
    hint: 'Quero consolidar para o TOPIK 4 e além.',
  },
];

/** Retorna o nível com este id, ou undefined se não existir. */
export function findLevel(id) {
  return LEVELS.find((level) => level.id === id);
}
