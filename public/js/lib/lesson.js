/**
 * Motor das lições (lógica pura, sem DOM — por isso é fácil de testar).
 *
 * Uma lição é uma lista de passos. Há passos de explicação ("learn") e exercícios:
 *  - "choice": escolher a opção certa (pode ser de ouvir: listen = true);
 *  - "build":  montar a frase coreana com peças, a partir da tradução;
 *  - "read":   ler o Hangul e escrever a romanização.
 *
 * Técnica pedagógica: um exercício errado volta UMA vez no fim da lição
 * (prática de recuperação). A pontuação conta só os acertos de primeira.
 */

export const EXERCISE_TYPES = ['choice', 'build', 'read'];

export const isExercise = (step) => EXERCISE_TYPES.includes(step.type);

/**
 * Deixa a romanização comparável: minúsculas, sem espaços, hífens, apóstrofos
 * nem pontuação. Assim "Annyeong-haseyo!" e "annyeonghaseyo" contam como iguais.
 */
export function normalizeRomanization(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '');
}

/** Junta as peças de um exercício "build" numa frase (com espaços entre as peças). */
export const joinTiles = (tiles) => tiles.join(' ');

/** A resposta está certa? `response` depende do tipo de exercício. */
export function isCorrect(step, response) {
  switch (step.type) {
    case 'choice':
      return response === step.answer;
    case 'build':
      return Array.isArray(response) && joinTiles(response) === joinTiles(step.tiles);
    case 'read':
      return step.answers.some(
        (answer) => normalizeRomanization(answer) === normalizeRomanization(response),
      );
    default:
      return false;
  }
}

/** A resposta certa, em texto, para mostrar quando o aluno erra. */
export function correctAnswerText(step) {
  if (step.type === 'build') return joinTiles(step.tiles);
  if (step.type === 'read') return step.answers[0];
  return step.answer;
}

/** Cria uma sessão nova para a lista de passos. */
export function createSession(steps) {
  return {
    queue: steps.map((step, index) => ({ step, index, retry: false })),
    position: 0,
    firstTry: {}, // índice do exercício → true/false (acertou de primeira?)
  };
}

export const currentItem = (session) => session.queue[session.position] ?? null;

export const isFinished = (session) => session.position >= session.queue.length;

/** Fração da lição já feita (0 a 1), para a barra de progresso. */
export const progressOf = (session) => session.position / session.queue.length;

/**
 * Avança para o próximo passo. Nos exercícios, `correct` diz se o aluno acertou.
 * Retorna uma sessão NOVA (não altera a anterior), o que facilita os testes.
 */
export function advance(session, correct = true) {
  const item = currentItem(session);
  if (!item) return session;

  const queue = [...session.queue];
  const firstTry = { ...session.firstTry };

  if (isExercise(item.step) && !item.retry) {
    firstTry[item.index] = correct;
    if (!correct) queue.push({ ...item, retry: true });
  }
  return { queue, position: session.position + 1, firstTry };
}

/** Pontuação: acertos de primeira sobre o total de exercícios. */
export function scoreOf(session) {
  const results = Object.values(session.firstTry);
  return { correct: results.filter(Boolean).length, total: results.length };
}

/** Embaralha uma cópia da lista (Fisher–Yates). `random` pode ser trocado nos testes. */
export function shuffle(list, random = Math.random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
